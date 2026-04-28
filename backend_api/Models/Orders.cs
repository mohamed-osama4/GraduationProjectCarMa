using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CarMaintenance.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public OrderStatus OrderStatus { get; set; } = OrderStatus.New;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}