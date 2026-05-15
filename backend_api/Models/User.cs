using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }
        public string? ProfileImageUrl { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } // Admin / User 
    }
}