using System.ComponentModel.DataAnnotations;
using CarMaintenance.Models.Enums;

namespace CarMaintenance.Models
{
    public class NewNotification
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public NewNotificationType Type { get; set; }
        public NewNotificationSeverity Severity { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }

        public string? ActionUrl { get; set; }
        public string? PrimaryActionLabel { get; set; }
        public string? PrimaryActionUrl { get; set; }
        public string? SecondaryActionLabel { get; set; }
        public string? SecondaryActionUrl { get; set; }

        public string? TargetType { get; set; }
        public int? TargetId { get; set; }

        public string? MetadataJson { get; set; }  // stored as jsonb

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
