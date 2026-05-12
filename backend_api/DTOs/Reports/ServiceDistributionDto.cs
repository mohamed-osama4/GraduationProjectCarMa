namespace CarMaintenance.DTOs.Reports
{
    public class ServiceDistributionDto
    {
        public string ServiceName { get; set; } = string.Empty;

        public int OrdersCount { get; set; }

        public double Percentage { get; set; }
    }
}
