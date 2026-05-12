namespace CarMaintenance.DTOs.Reports
{
    public class TopTechnicianDto
    {
        public string Name { get; set; } = string.Empty;

        public double Rating { get; set; }

        public int CompletedOrders { get; set; }

        public int Rank { get; set; }
    }
}
