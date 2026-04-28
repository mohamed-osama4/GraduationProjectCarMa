namespace CarMaintenance.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public int ServiceId { get; set; }
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}