using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.Models
{
    public class Workshop
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string OwnerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        public TimeSpan OpenTime { get; set; } = new TimeSpan(8, 0, 0);   // 08:00 AM
        public TimeSpan CloseTime { get; set; } = new TimeSpan(22, 0, 0); // 10:00 PM

        public bool IsOpen { get; set; } = true;

        public ICollection<Service> Services { get; set; } = new List<Service>();

        public DateTime JoinDate { get; set; } = DateTime.UtcNow;

        public int TotalOrders { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
