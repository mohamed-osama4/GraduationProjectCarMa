using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.Models.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
