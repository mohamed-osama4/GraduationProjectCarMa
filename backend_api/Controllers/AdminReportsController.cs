using CarMaintenance.DTOs.Reports;
using CarMaintenance.Models.Enums;
using CarMaintenance.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/admin/reports")]
    [Authorize(Roles = "admin")]
    public class AdminReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public AdminReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        [HttpGet("summary")]
        [SwaggerOperation(Summary = "Get dashboard summary", Description = "Returns KPI summary analytics for the selected period.")]
        [ProducesResponseType(typeof(DashboardSummaryDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetSummary([FromQuery] ReportPeriod period, CancellationToken ct)
        {
            var result = await _reportsService.GetSummaryAsync(period, ct);
            return Ok(result);
        }

        [HttpGet("revenue-chart")]
        [SwaggerOperation(Summary = "Get revenue chart", Description = "Returns revenue analytics grouped by time for the selected period.")]
        [ProducesResponseType(typeof(LineChartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRevenueChart([FromQuery] ReportPeriod period, CancellationToken ct)
        {
            var result = await _reportsService.GetRevenueChartAsync(period, ct);
            return Ok(result);
        }

        [HttpGet("orders-chart")]
        [SwaggerOperation(Summary = "Get orders chart", Description = "Returns orders count grouped by time for the selected period.")]
        [ProducesResponseType(typeof(LineChartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrdersChart([FromQuery] ReportPeriod period, CancellationToken ct)
        {
            var result = await _reportsService.GetOrdersChartAsync(period, ct);
            return Ok(result);
        }

        [HttpGet("services-distribution")]
        [SwaggerOperation(Summary = "Get services distribution", Description = "Returns pie chart distribution data for services.")]
        [ProducesResponseType(typeof(List<ServiceDistributionDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetServicesDistribution([FromQuery] ReportPeriod period, CancellationToken ct)
        {
            var result = await _reportsService.GetServicesDistributionAsync(period, ct);
            return Ok(result);
        }

        [HttpGet("technicians-performance")]
        [SwaggerOperation(Summary = "Get technicians performance", Description = "Returns completed orders per technician.")]
        [ProducesResponseType(typeof(List<TechnicianPerformanceDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTechniciansPerformance([FromQuery] ReportPeriod period, CancellationToken ct)
        {
            var result = await _reportsService.GetTechniciansPerformanceAsync(period, ct);
            return Ok(result);
        }

        [HttpGet("top-technicians")]
        [SwaggerOperation(Summary = "Get top technicians", Description = "Returns ranked top technicians by performance.")]
        [ProducesResponseType(typeof(List<TopTechnicianDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTopTechnicians([FromQuery] ReportPeriod period, [FromQuery] int limit = 5, CancellationToken ct = default)
        {
            if (limit < 1) limit = 1;
            if (limit > 20) limit = 20;

            var result = await _reportsService.GetTopTechniciansAsync(period, limit, ct);
            return Ok(result);
        }

        [HttpGet("top-services")]
        [SwaggerOperation(Summary = "Get top services", Description = "Returns ranked top requested services.")]
        [ProducesResponseType(typeof(List<TopServiceDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTopServices([FromQuery] ReportPeriod period, [FromQuery] int limit = 6, CancellationToken ct = default)
        {
            if (limit < 1) limit = 1;
            if (limit > 20) limit = 20;

            var result = await _reportsService.GetTopServicesAsync(period, limit, ct);
            return Ok(result);
        }

        [HttpGet("export")]
        [SwaggerOperation(Summary = "Export report", Description = "Generates and returns an exportable report file (Excel/PDF).")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ExportReport([FromQuery] ExportReportRequestDto request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Type) || (request.Type.ToLower() != "excel" && request.Type.ToLower() != "pdf"))
            {
                return BadRequest(new { message = "Invalid export type. Supported types: excel, pdf." });
            }

            var result = await _reportsService.ExportReportAsync(request, ct);
            var fileName = $"Report_{request.Period}_{DateTime.UtcNow:yyyyMMddHHmm}";

            if (request.Type.ToLower() == "pdf")
            {
                return File(result, "application/pdf", $"{fileName}.pdf");
            }
            else
            {
                return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{fileName}.xlsx");
            }
        }
    }
}
