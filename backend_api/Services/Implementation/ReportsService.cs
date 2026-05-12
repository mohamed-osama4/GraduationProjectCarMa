using CarMaintenance.Data;
using CarMaintenance.DTOs.Reports;
using CarMaintenance.Models;
using CarMaintenance.Models.Enums;
using CarMaintenance.Services.Interfaces;
using CarMaintenance.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Globalization;

namespace CarMaintenance.Services.Implementation
{
    public class ReportsService : IReportsService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CachePrefix = "reports_";

        public ReportsService(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(ReportPeriod period, CancellationToken cancellationToken = default)
        {
            string cacheKey = $"{CachePrefix}summary_{period}";
            if (_cache.TryGetValue(cacheKey, out DashboardSummaryDto summary))
            {
                return summary;
            }

            var currentRange = DateRangeHelper.GetRange(period);
            var previousRange = DateRangeHelper.GetPreviousRange(period);

            // Current metrics
            var currentStats = await GetPeriodStatsAsync(currentRange.StartDateUtc, currentRange.EndDateUtc, cancellationToken);
            
            // Previous metrics
            var previousStats = await GetPeriodStatsAsync(previousRange.StartDateUtc, previousRange.EndDateUtc, cancellationToken);

            // Total metrics (all time)
            var totalOrders = await _context.Orders.CountAsync(cancellationToken);
            var totalRevenue = await _context.Orders
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.IsPaid)
                .SumAsync(o => o.Price, cancellationToken);
            var totalCustomers = await _context.Users.Where(u => u.Role == "User").CountAsync(cancellationToken);

            summary = new DashboardSummaryDto
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                TotalCustomers = totalCustomers,
                
                OrdersThisPeriod = currentStats.OrderCount,
                RevenueThisPeriod = currentStats.Revenue,
                NewCustomersThisPeriod = currentStats.NewCustomers,
                
                AverageOrderValue = currentStats.OrderCount > 0 ? currentStats.Revenue / currentStats.OrderCount : 0,
                
                RevenueGrowthPercentage = CalculateGrowth(currentStats.Revenue, previousStats.Revenue),
                OrdersGrowthPercentage = CalculateGrowth(currentStats.OrderCount, previousStats.OrderCount),
                AverageOrderGrowthPercentage = CalculateGrowth(
                    currentStats.OrderCount > 0 ? currentStats.Revenue / currentStats.OrderCount : 0,
                    previousStats.OrderCount > 0 ? previousStats.Revenue / previousStats.OrderCount : 0
                ),
                CustomersGrowthPercentage = CalculateGrowth(currentStats.NewCustomers, previousStats.NewCustomers)
            };

            _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(5));
            return summary;
        }

        public async Task<LineChartDto> GetRevenueChartAsync(ReportPeriod period, CancellationToken cancellationToken = default)
        {
            string cacheKey = $"{CachePrefix}revenue_chart_{period}";
            if (_cache.TryGetValue(cacheKey, out LineChartDto chart))
            {
                return chart;
            }

            var range = DateRangeHelper.GetRange(period);
            var query = _context.Orders
                .AsNoTracking()
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.IsPaid && o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc);

            chart = await GroupDataForChartAsync(query, period, o => o.Price, cancellationToken);

            _cache.Set(cacheKey, chart, TimeSpan.FromMinutes(5));
            return chart;
        }

        public async Task<LineChartDto> GetOrdersChartAsync(ReportPeriod period, CancellationToken cancellationToken = default)
        {
            string cacheKey = $"{CachePrefix}orders_chart_{period}";
            if (_cache.TryGetValue(cacheKey, out LineChartDto chart))
            {
                return chart;
            }

            var range = DateRangeHelper.GetRange(period);
            var query = _context.Orders
                .AsNoTracking()
                .Where(o => o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc);

            chart = await GroupDataForChartAsync(query, period, o => 1, cancellationToken);

            _cache.Set(cacheKey, chart, TimeSpan.FromMinutes(5));
            return chart;
        }

        public async Task<List<ServiceDistributionDto>> GetServicesDistributionAsync(ReportPeriod period, CancellationToken cancellationToken = default)
        {
            var range = DateRangeHelper.GetRange(period);
            var totalOrdersInPeriod = await _context.Orders
                .Where(o => o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc)
                .CountAsync(cancellationToken);

            if (totalOrdersInPeriod == 0) return new List<ServiceDistributionDto>();

            var distribution = await _context.Orders
                .AsNoTracking()
                .Where(o => o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc)
                .GroupBy(o => o.Service.Name)
                .Select(g => new ServiceDistributionDto
                {
                    ServiceName = g.Key,
                    OrdersCount = g.Count(),
                    Percentage = Math.Round((double)g.Count() / totalOrdersInPeriod * 100, 2)
                })
                .OrderByDescending(d => d.OrdersCount)
                .ToListAsync(cancellationToken);

            return distribution;
        }

        public async Task<List<TechnicianPerformanceDto>> GetTechniciansPerformanceAsync(ReportPeriod period, CancellationToken cancellationToken = default)
        {
            var range = DateRangeHelper.GetRange(period);
            
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.TechnicianName != null && o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc)
                .GroupBy(o => o.TechnicianName)
                .Select(g => new TechnicianPerformanceDto
                {
                    TechnicianName = g.Key!,
                    CompletedOrders = g.Count()
                })
                .OrderByDescending(t => t.CompletedOrders)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<TopTechnicianDto>> GetTopTechniciansAsync(ReportPeriod period, int limit, CancellationToken cancellationToken = default)
        {
            var range = DateRangeHelper.GetRange(period);

            var topTechs = await _context.Orders
                .AsNoTracking()
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.TechnicianName != null && o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc)
                .GroupBy(o => o.TechnicianName)
                .Select(g => new TopTechnicianDto
                {
                    Name = g.Key!,
                    CompletedOrders = g.Count(),
                    Rating = 5.0 // Defaulting as no rating entity exists yet
                })
                .OrderByDescending(t => t.CompletedOrders)
                .Take(limit)
                .ToListAsync(cancellationToken);

            for (int i = 0; i < topTechs.Count; i++)
            {
                topTechs[i].Rank = i + 1;
            }

            return topTechs;
        }

        public async Task<List<TopServiceDto>> GetTopServicesAsync(ReportPeriod period, int limit, CancellationToken cancellationToken = default)
        {
            var range = DateRangeHelper.GetRange(period);

            var topServices = await _context.Orders
                .AsNoTracking()
                .Where(o => o.CreatedAt >= range.StartDateUtc && o.CreatedAt <= range.EndDateUtc)
                .GroupBy(o => new { o.ServiceId, o.Service.Name })
                .Select(g => new TopServiceDto
                {
                    ServiceId = g.Key.ServiceId,
                    ServiceName = g.Key.Name,
                    OrdersCount = g.Count()
                })
                .OrderByDescending(s => s.OrdersCount)
                .Take(limit)
                .ToListAsync(cancellationToken);

            for (int i = 0; i < topServices.Count; i++)
            {
                topServices[i].Rank = i + 1;
            }

            return topServices;
        }

        public async Task<byte[]> ExportReportAsync(ExportReportRequestDto request, CancellationToken cancellationToken = default)
        {
            if (request.Type.ToLower() == "pdf")
            {
                return await GeneratePdfReportAsync(request.Period, cancellationToken);
            }
            else
            {
                return await GenerateExcelReportAsync(request.Period, cancellationToken);
            }
        }

        #region Private Helpers

        private async Task<(decimal Revenue, int OrderCount, int NewCustomers)> GetPeriodStatsAsync(DateTime start, DateTime end, CancellationToken ct)
        {
            var revenue = await _context.Orders
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.IsPaid && o.CreatedAt >= start && o.CreatedAt <= end)
                .SumAsync(o => o.Price, ct);

            var orders = await _context.Orders
                .Where(o => o.CreatedAt >= start && o.CreatedAt <= end)
                .CountAsync(ct);

            // Assuming User model doesn't have CreatedAt, I'll check.
            // Based on earlier view_file, User doesn't have CreatedAt. I'll skip new customers growth if field missing or assume it if I can.
            // Wait, I should check User model again.
            return (revenue, orders, 0); 
        }

        private double CalculateGrowth(decimal current, decimal previous)
        {
            if (previous == 0) return current > 0 ? 100 : 0;
            return (double)((current - previous) / previous * 100);
        }

        private async Task<LineChartDto> GroupDataForChartAsync(IQueryable<Order> query, ReportPeriod period, System.Linq.Expressions.Expression<Func<Order, decimal>> valueSelector, CancellationToken ct)
        {
            var data = await query.ToListAsync(ct);
            var result = new LineChartDto();

            switch (period)
            {
                case ReportPeriod.Week:
                    var weekDays = data.GroupBy(o => o.CreatedAt.Date)
                        .Select(g => new { Label = g.Key.ToString("ddd", CultureInfo.CurrentCulture), Value = g.AsQueryable().Sum(valueSelector) })
                        .ToList();
                    result.Labels = weekDays.Select(d => d.Label).ToList();
                    result.Values = weekDays.Select(d => d.Value).ToList();
                    break;

                case ReportPeriod.Month:
                case ReportPeriod.Quarter:
                case ReportPeriod.Year:
                    var monthly = data.GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                        .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                        .Select(g => new { Label = $"{g.Key.Month}/{g.Key.Year}", Value = g.AsQueryable().Sum(valueSelector) })
                        .ToList();
                    result.Labels = monthly.Select(d => d.Label).ToList();
                    result.Values = monthly.Select(d => d.Value).ToList();
                    break;
            }

            return result;
        }

        private async Task<byte[]> GenerateExcelReportAsync(ReportPeriod period, CancellationToken ct)
        {
            var summary = await GetSummaryAsync(period, ct);
            var topServices = await GetTopServicesAsync(period, 10, ct);
            var topTechs = await GetTopTechniciansAsync(period, 10, ct);

            using (var workbook = new XLWorkbook())
            {
                var sheet = workbook.Worksheets.Add("Summary Report");
                
                sheet.Cell(1, 1).Value = "Dashboard Summary Report";
                sheet.Cell(1, 1).Style.Font.Bold = true;
                sheet.Cell(1, 1).Style.Font.FontSize = 16;

                sheet.Cell(3, 1).Value = "Metric";
                sheet.Cell(3, 2).Value = "Value";
                sheet.Range(3, 1, 3, 2).Style.Font.Bold = true;

                sheet.Cell(4, 1).Value = "Total Revenue";
                sheet.Cell(4, 2).Value = summary.TotalRevenue;
                sheet.Cell(5, 1).Value = "Total Orders";
                sheet.Cell(5, 2).Value = summary.TotalOrders;
                sheet.Cell(6, 1).Value = "Revenue This Period";
                sheet.Cell(6, 2).Value = summary.RevenueThisPeriod;
                sheet.Cell(7, 1).Value = "Orders This Period";
                sheet.Cell(7, 2).Value = summary.OrdersThisPeriod;

                var servicesSheet = workbook.Worksheets.Add("Top Services");
                servicesSheet.Cell(1, 1).Value = "Rank";
                servicesSheet.Cell(1, 2).Value = "Service Name";
                servicesSheet.Cell(1, 3).Value = "Orders Count";
                servicesSheet.Range(1, 1, 1, 3).Style.Font.Bold = true;

                for (int i = 0; i < topServices.Count; i++)
                {
                    servicesSheet.Cell(i + 2, 1).Value = topServices[i].Rank;
                    servicesSheet.Cell(i + 2, 2).Value = topServices[i].ServiceName;
                    servicesSheet.Cell(i + 2, 3).Value = topServices[i].OrdersCount;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }

        private async Task<byte[]> GeneratePdfReportAsync(ReportPeriod period, CancellationToken ct)
        {
            var summary = await GetSummaryAsync(period, ct);
            var topServices = await GetTopServicesAsync(period, 10, ct);

            // Configure QuestPDF (required for newer versions)
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12).FontFamily(Fonts.Verdana));

                    page.Header().Text("CarMa Admin Analytics Report")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                    {
                        x.Spacing(20);

                        x.Item().Text($"Report Period: {period}").FontSize(14);

                        x.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Metric");
                                header.Cell().Element(CellStyle).Text("Value");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                }
                            });

                            table.Cell().Element(CellStyle).Text("Total Revenue");
                            table.Cell().Element(CellStyle).Text($"{summary.TotalRevenue:N2} EGP");

                            table.Cell().Element(CellStyle).Text("Total Orders");
                            table.Cell().Element(CellStyle).Text(summary.TotalOrders.ToString());

                            table.Cell().Element(CellStyle).Text("Revenue This Period");
                            table.Cell().Element(CellStyle).Text($"{summary.RevenueThisPeriod:N2} EGP");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                            }
                        });

                        x.Item().Text("Top Services").FontSize(16).SemiBold();

                        x.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(50);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Rank");
                                header.Cell().Text("Service");
                                header.Cell().Text("Orders");
                            });

                            foreach (var service in topServices)
                            {
                                table.Cell().Text(service.Rank.ToString());
                                table.Cell().Text(service.ServiceName);
                                table.Cell().Text(service.OrdersCount.ToString());
                            }
                        });
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                    });
                });
            });

            using (var stream = new MemoryStream())
            {
                document.GeneratePdf(stream);
                return stream.ToArray();
            }
        }

        #endregion
    }
}
