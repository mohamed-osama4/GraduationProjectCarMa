using System.Text.Json;
using CarMaintenance.Data;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Hubs;
using CarMaintenance.Models;
using CarMaintenance.Models.Enums;
using CarMaintenance.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CarMaintenance.Services.Implementation
{
    public class NewNotificationService : INewNotificationService
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<NewNotificationService> _logger;

        public NewNotificationService(
            AppDbContext db,
            IHubContext<NotificationHub> hubContext,
            ILogger<NewNotificationService> logger)
        {
            _db = db;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<PagedNewNotificationsResponseDto> GetUserNotificationsAsync(
            int userId,
            int page,
            int pageSize,
            bool? isRead,
            NewNotificationType? type,
            CancellationToken cancellationToken = default)
        {
            // Clamp pagination
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var query = _db.NewNotifications
                .AsNoTracking()
                .Where(x => x.UserId == userId && !x.IsDeleted);

            // Filters
            if (isRead.HasValue)
            {
                query = query.Where(x => x.IsRead == isRead.Value);
            }

            if (type.HasValue)
            {
                query = query.Where(x => x.Type == type.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            // Global counts (ignoring current filters)
            var totalAllCounts = await _db.NewNotifications
                .CountAsync(x => x.UserId == userId && !x.IsDeleted, cancellationToken);
            var totalUnreadCounts = await _db.NewNotifications
                .CountAsync(x => x.UserId == userId && !x.IsDeleted && !x.IsRead, cancellationToken);

            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new PagedNewNotificationsResponseDto
            {
                Items = items.Select(MapToDto).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                UnreadCount = totalUnreadCounts,
                TotalAllCounts = totalAllCounts,
                TotalUnreadCounts = totalUnreadCounts
            };
        }

        public async Task<int> GetUnreadCountAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await _db.NewNotifications
                .CountAsync(x => x.UserId == userId && !x.IsDeleted && !x.IsRead, cancellationToken);
        }

        public async Task<NewNotificationDto> CreateAsync(CreateNewNotificationRequestDto request, CancellationToken cancellationToken = default)
        {
            // Validate user exists
            var userExists = await _db.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
            if (!userExists)
            {
                throw new KeyNotFoundException($"User with ID {request.UserId} not found.");
            }

            var notification = new NewNotification
            {
                UserId = request.UserId,
                Type = request.Type,
                Severity = request.Severity,
                Title = request.Title,
                Message = request.Message,
                ActionUrl = request.ActionUrl,
                PrimaryActionLabel = request.PrimaryActionLabel,
                PrimaryActionUrl = request.PrimaryActionUrl,
                SecondaryActionLabel = request.SecondaryActionLabel,
                SecondaryActionUrl = request.SecondaryActionUrl,
                TargetType = request.TargetType,
                TargetId = request.TargetId,
                MetadataJson = request.Metadata != null ? JsonSerializer.Serialize(request.Metadata) : null,
                CreatedAt = DateTime.UtcNow
            };

            _db.NewNotifications.Add(notification);
            await _db.SaveChangesAsync(cancellationToken);

            var dto = MapToDto(notification);

            // Send SignalR event
            try
            {
                await _hubContext.Clients.User(request.UserId.ToString())
                    .SendAsync("notification.created", dto, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SignalR notification to user {UserId}", request.UserId);
            }

            return dto;
        }

        public async Task MarkAsReadAsync(int userId, int notificationId, CancellationToken cancellationToken = default)
        {
            var notification = await _db.NewNotifications
                .FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId && !x.IsDeleted, cancellationToken);

            if (notification == null)
            {
                throw new KeyNotFoundException("Notification not found.");
            }

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                notification.UpdatedAt = DateTime.UtcNow;

                await _db.SaveChangesAsync(cancellationToken);

                // Optional: Send SignalR event
                await _hubContext.Clients.User(userId.ToString())
                    .SendAsync("notification.read", new { id = notificationId }, cancellationToken);
            }
        }

        public async Task MarkAllAsReadAsync(int userId, CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;

            await _db.NewNotifications
                .Where(x => x.UserId == userId && !x.IsDeleted && !x.IsRead)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsRead, true)
                    .SetProperty(x => x.ReadAt, now)
                    .SetProperty(x => x.UpdatedAt, now),
                    cancellationToken);

            // Optional: Send SignalR event
            await _hubContext.Clients.User(userId.ToString())
                .SendAsync("notifications.read_all", cancellationToken: cancellationToken);
        }

        public async Task DeleteAsync(int userId, int notificationId, CancellationToken cancellationToken = default)
        {
            var notification = await _db.NewNotifications
                .FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId && !x.IsDeleted, cancellationToken);

            if (notification == null)
            {
                throw new KeyNotFoundException("Notification not found.");
            }

            notification.IsDeleted = true;
            notification.DeletedAt = DateTime.UtcNow;
            notification.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync(cancellationToken);

            // Optional: Send SignalR event
            await _hubContext.Clients.User(userId.ToString())
                .SendAsync("notification.deleted", new { id = notificationId }, cancellationToken);
        }

        private NewNotificationDto MapToDto(NewNotification notification)
        {
            return new NewNotificationDto
            {
                Id = notification.Id,
                Type = notification.Type.ToString(),
                Severity = notification.Severity.ToString(),
                Title = notification.Title,
                Message = notification.Message,
                IsRead = notification.IsRead,
                ActionUrl = notification.ActionUrl,
                PrimaryAction = string.IsNullOrWhiteSpace(notification.PrimaryActionLabel)
                    ? null
                    : new NewNotificationActionDto
                    {
                        Label = notification.PrimaryActionLabel,
                        Url = notification.PrimaryActionUrl
                    },
                SecondaryAction = string.IsNullOrWhiteSpace(notification.SecondaryActionLabel)
                    ? null
                    : new NewNotificationActionDto
                    {
                        Label = notification.SecondaryActionLabel,
                        Url = notification.SecondaryActionUrl
                    },
                TargetType = notification.TargetType,
                TargetId = notification.TargetId,
                Metadata = DeserializeMetadata(notification.MetadataJson),
                CreatedAt = notification.CreatedAt,
                ReadAt = notification.ReadAt
            };
        }

        private static object? DeserializeMetadata(string? metadataJson)
        {
            if (string.IsNullOrWhiteSpace(metadataJson))
                return null;

            try
            {
                return JsonSerializer.Deserialize<object>(metadataJson);
            }
            catch
            {
                return null;
            }
        }
    }
}
