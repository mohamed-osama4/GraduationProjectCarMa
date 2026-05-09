using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/admin/new-notifications")]
    [Authorize(Roles = "admin")]
    public class AdminNewNotificationsController : ControllerBase
    {
        private readonly INewNotificationService _notificationService;

        public AdminNewNotificationsController(INewNotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("send-to-user")]
        [SwaggerOperation(
            Summary = "Send notification to user",
            Description = "Allows admin users to create and send a notification to a specific user."
        )]
        [ProducesResponseType(typeof(NewNotificationDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<NewNotificationDto>> SendToUser(
            [FromBody] CreateNewNotificationRequestDto request,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _notificationService.CreateAsync(request, cancellationToken);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the notification.", details = ex.Message });
            }
        }
    }
}
