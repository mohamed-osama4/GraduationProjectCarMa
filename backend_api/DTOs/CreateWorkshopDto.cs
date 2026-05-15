using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.DTOs
{
    public class CreateWorkshopDto
    {
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
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        public TimeSpan OpenTime { get; set; }

        public TimeSpan CloseTime { get; set; }

        public List<int> ServiceIds { get; set; } = new List<int>();
    }
}
