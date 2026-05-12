namespace CarMaintenance.DTOs.Reports
{
    public class PieChartItemDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public double Percentage { get; set; }
    }
}
