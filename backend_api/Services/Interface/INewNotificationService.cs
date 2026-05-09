using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;

namespace CarMaintenance.Services.Interfaces
{
    public interface INewNotificationService
    {
        Task<PagedNewNotificationsResponseDto> GetUserNotificationsAsync(
            int userId,
            int page,
            int pageSize,
            bool? isRead,
            NewNotificationType? type,
            CancellationToken cancellationToken = default);

        Task<int> GetUnreadCountAsync(
            int userId,
            CancellationToken cancellationToken = default);

        Task<NewNotificationDto> CreateAsync(
            CreateNewNotificationRequestDto request,
            CancellationToken cancellationToken = default);

        Task MarkAsReadAsync(
            int userId,
            int notificationId,
            CancellationToken cancellationToken = default);

        Task MarkAllAsReadAsync(
            int userId,
            CancellationToken cancellationToken = default);

        Task DeleteAsync(
            int userId,
            int notificationId,
            CancellationToken cancellationToken = default);
    }
}
