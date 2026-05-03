using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? OrderId { get; set; }
        public Order? Order { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }
    }
}