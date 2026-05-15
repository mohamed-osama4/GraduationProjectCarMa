namespace CarMaintenance.Models
{
    public class Car
    {
        public int Id { get; set; }

        public string Brand { get; set; }

        public string Model { get; set; }

        public int Year { get; set; }

        public string PlateNumber { get; set; }

        public string Color { get; set; }

        public bool IsPrimary { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }
    }
}