namespace CarMaintenance.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }

        public int ServiceId { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        // الجديد
        public string? ImageUrl { get; set; }

        public string? Notes { get; set; }
    }
}