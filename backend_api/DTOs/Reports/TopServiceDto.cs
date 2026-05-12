namespace CarMaintenance.DTOs.Reports
{
    public class TopServiceDto
    {
        public int ServiceId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public int OrdersCount { get; set; }

        public int Rank { get; set; }
    }
}
