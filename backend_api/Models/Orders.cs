using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Text.Json.Serialization;

namespace CarMaintenance.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public virtual User? User { get; set; } 

        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int ServiceId { get; set; }
        
        [ForeignKey("ServiceId")] 
        public virtual Service? Service { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public string? TechnicianName { get; set; }
        public bool IsPaid { get; set; } = false;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        [Required]
        public string PaymentMethod { get; set; } = "Cash";

        public ICollection<Notification>? Notifications { get; set; }
    }
}