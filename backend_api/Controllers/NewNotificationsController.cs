using System.Security.Claims;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;
using CarMaintenance.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/new-notifications")]
    [Authorize]
    public class NewNotificationsController : ControllerBase
    {
        private readonly INewNotificationService _notificationService;

        public NewNotificationsController(INewNotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Get current user's notifications",
            Description = "Returns paginated notifications for the authenticated user."
        )]
        [ProducesResponseType(typeof(PagedNewNotificationsResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<PagedNewNotificationsResponseDto>> GetNotifications(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isRead = null,
            [FromQuery] NewNotificationType? type = null,
            CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            var result = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize, isRead, type, cancellationToken);
            return Ok(result);
        }

        [HttpGet("unread-count")]
        [SwaggerOperation(
            Summary = "Get unread notifications count",
            Description = "Returns the unread notifications count for the authenticated user."
        )]
        [ProducesResponseType(typeof(UnreadCountDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UnreadCountDto>> GetUnreadCount(CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId, cancellationToken);
            return Ok(new UnreadCountDto { Count = count });
        }

        [HttpPatch("{id}/read")]
        [SwaggerOperation(
            Summary = "Mark notification as read",
            Description = "Marks one notification as read for the authenticated user."
        )]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> MarkAsRead(int id, CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _notificationService.MarkAsReadAsync(userId, id, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Notification not found" });
            }
        }

        [HttpPatch("read-all")]
        [SwaggerOperation(
            Summary = "Mark all notifications as read",
            Description = "Marks all unread notifications as read for the authenticated user."
        )]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            await _notificationService.MarkAllAsReadAsync(userId, cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Delete notification",
            Description = "Soft deletes one notification for the authenticated user."
        )]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _notificationService.DeleteAsync(userId, id, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Notification not found" });
            }
        }

        private int GetCurrentUserId()
        {
            var value =
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue("id");

            if (string.IsNullOrWhiteSpace(value) || !int.TryParse(value, out var userId))
                throw new UnauthorizedAccessException("Invalid user id claim.");

            return userId;
        }
    }
}
