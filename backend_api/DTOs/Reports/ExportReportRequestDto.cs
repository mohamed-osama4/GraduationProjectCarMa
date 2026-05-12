using CarMaintenance.Models.Enums;

namespace CarMaintenance.DTOs.Reports
{
    public class ExportReportRequestDto
    {
        public ReportPeriod Period { get; set; }

        public string Type { get; set; } = "excel";
    }
}
