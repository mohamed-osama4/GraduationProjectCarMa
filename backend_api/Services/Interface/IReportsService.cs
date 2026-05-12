using CarMaintenance.DTOs.Reports;
using CarMaintenance.Models.Enums;

namespace CarMaintenance.Services.Interfaces
{
    public interface IReportsService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(
            ReportPeriod period,
            CancellationToken cancellationToken = default);

        Task<LineChartDto> GetRevenueChartAsync(
            ReportPeriod period,
            CancellationToken cancellationToken = default);

        Task<LineChartDto> GetOrdersChartAsync(
            ReportPeriod period,
            CancellationToken cancellationToken = default);

        Task<List<ServiceDistributionDto>> GetServicesDistributionAsync(
            ReportPeriod period,
            CancellationToken cancellationToken = default);

        Task<List<TechnicianPerformanceDto>> GetTechniciansPerformanceAsync(
            ReportPeriod period,
            CancellationToken cancellationToken = default);

        Task<List<TopTechnicianDto>> GetTopTechniciansAsync(
            ReportPeriod period,
            int limit,
            CancellationToken cancellationToken = default);

        Task<List<TopServiceDto>> GetTopServicesAsync(
            ReportPeriod period,
            int limit,
            CancellationToken cancellationToken = default);

        Task<byte[]> ExportReportAsync(
            ExportReportRequestDto request,
            CancellationToken cancellationToken = default);
    }
}
