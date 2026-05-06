namespace CarMaintenance.DTOs.NewNotifications
{
    public class PagedNewNotificationsResponseDto
    {
        public List<NewNotificationDto> Items { get; set; } = new();

        public int Page { get; set; }
        public int PageSize { get; set; }

        public int TotalCount { get; set; }
        public int TotalPages { get; set; }

        public int UnreadCount { get; set; }
    }
}
