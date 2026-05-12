namespace CarMaintenance.DTOs.Reports
{
    public class LineChartDto
    {
        public List<string> Labels { get; set; } = new();
        public List<decimal> Values { get; set; } = new();
    }
}
