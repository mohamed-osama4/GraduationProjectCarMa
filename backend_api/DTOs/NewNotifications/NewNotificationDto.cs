namespace CarMaintenance.DTOs.NewNotifications
{
    public class NewNotificationDto
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public string? ActionUrl { get; set; }

        public NewNotificationActionDto? PrimaryAction { get; set; }
        public NewNotificationActionDto? SecondaryAction { get; set; }

        public string? TargetType { get; set; }
        public int? TargetId { get; set; }

        public object? Metadata { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }
}
