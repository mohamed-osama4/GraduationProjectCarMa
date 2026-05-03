namespace CarMaintenance.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public int ServiceId { get; set; }

        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string PaymentMethod { get; set; } = "cash";}
}