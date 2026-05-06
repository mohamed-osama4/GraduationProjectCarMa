using CarMaintenance.Models.Enums;

namespace CarMaintenance.DTOs.NewNotifications
{
    public class CreateNewNotificationRequestDto
    {
        public int UserId { get; set; }

        public NewNotificationType Type { get; set; }
        public NewNotificationSeverity Severity { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        public string? ActionUrl { get; set; }

        public string? PrimaryActionLabel { get; set; }
        public string? PrimaryActionUrl { get; set; }

        public string? SecondaryActionLabel { get; set; }
        public string? SecondaryActionUrl { get; set; }

        public string? TargetType { get; set; }
        public int? TargetId { get; set; }

        public object? Metadata { get; set; }
    }
}
