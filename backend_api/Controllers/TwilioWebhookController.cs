using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using CarMaintenance.Hubs;
using CarMaintenance.Models;
using CarMaintenance.Models.Enums;
using CarMaintenance.Services.Interfaces;
using CarMaintenance.DTOs.NewNotifications;

namespace CarMaintenance.Controllers
{
    /// <summary>
    /// Receives Twilio webhook callbacks when the workshop clicks
    /// Accept or Decline on the WhatsApp message.
    /// </summary>
    [ApiController]
    [Route("api/twilio")]
    public class TwilioWebhookController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly INewNotificationService _newNotificationService;
        private readonly ILogger<TwilioWebhookController> _logger;

        public TwilioWebhookController(
            AppDbContext context,
            IHubContext<NotificationHub> hub,
            INewNotificationService newNotificationService,
            ILogger<TwilioWebhookController> logger)
        {
            _context = context;
            _hub = hub;
            _newNotificationService = newNotificationService;
            _logger = logger;
        }

        /// <summary>
        /// Twilio sends a POST here when the workshop replies via WhatsApp buttons.
        /// The button payload contains the action (accept/decline) and the order ID.
        /// Expected payload format: "accept_twilio_grad_42" or "decline_twilio_grad_42"
        /// </summary>
        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook()
        {
            // Twilio sends form-encoded data
            var body = Request.Form["Body"].ToString().Trim();
            var buttonPayload = Request.Form["ButtonPayload"].ToString().Trim();

            // Try to get the action from ButtonPayload first, fallback to Body
            var payload = !string.IsNullOrEmpty(buttonPayload) ? buttonPayload : body;

            _logger.LogInformation("Twilio webhook received. Body={Body}, ButtonPayload={ButtonPayload}",
                body, buttonPayload);

            if (string.IsNullOrWhiteSpace(payload))
            {
                _logger.LogWarning("Empty payload received from Twilio webhook");
                return Ok("<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>");
            }

            // Parse: "accept_twilio_grad_42" or "decline_twilio_grad_42"
            bool isAccept;
            int orderId;

            if (payload.StartsWith("accept_twilio_grad", StringComparison.OrdinalIgnoreCase))
            {
                isAccept = true;
                // Extract order ID from the end: accept_twilio_grad_42 → 42
                var parts = payload.Split('_');
                if (parts.Length < 4 || !int.TryParse(parts[^1], out orderId))
                {
                    _logger.LogWarning("Could not parse order ID from accept payload: {Payload}", payload);
                    return Ok("<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>");
                }
            }
            else if (payload.StartsWith("decline_twilio_grad", StringComparison.OrdinalIgnoreCase))
            {
                isAccept = false;
                var parts = payload.Split('_');
                if (parts.Length < 4 || !int.TryParse(parts[^1], out orderId))
                {
                    _logger.LogWarning("Could not parse order ID from decline payload: {Payload}", payload);
                    return Ok("<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>");
                }
            }
            else
            {
                _logger.LogInformation("Unrecognized payload, ignoring: {Payload}", payload);
                return Ok("<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>");
            }

            // Find the order
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("Order #{OrderId} not found for Twilio webhook", orderId);
                return Ok("<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>");
            }

            // Update order status
            if (isAccept)
            {
                order.OrderStatus = OrderStatus.InProgress;
                _logger.LogInformation("Workshop ACCEPTED order #{OrderId}", orderId);
            }
            else
            {
                order.OrderStatus = OrderStatus.Rejected;
                _logger.LogInformation("Workshop DECLINED order #{OrderId}", orderId);
            }

            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Send notification to the customer
            try
            {
                if (isAccept)
                {
                    await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
                    {
                        UserId = order.UserId,
                        Type = NewNotificationType.RequestAccepted,
                        Severity = NewNotificationSeverity.Success,
                        Title = "الورشة قبلت طلبك!",
                        Message = $"الورشة وافقت على طلبك #{order.Id}. سيتم التواصل معك قريبًا لتحديد موعد الصيانة.",
                        TargetType = "Order",
                        TargetId = order.Id,
                        ActionUrl = $"/orders/{order.Id}"
                    });
                }
                else
                {
                    await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
                    {
                        UserId = order.UserId,
                        Type = NewNotificationType.System,
                        Severity = NewNotificationSeverity.Error,
                        Title = "الورشة اعتذرت عن الطلب",
                        Message = $"للأسف الورشة لم تستطع قبول طلبك #{order.Id} حاليًا. سيتم البحث عن ورشة أخرى.",
                        TargetType = "Order",
                        TargetId = order.Id,
                        ActionUrl = $"/orders/{order.Id}"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create notification for order #{OrderId}", orderId);
            }

            // Notify via SignalR
            try
            {
                await _hub.Clients.All.SendAsync("OrderUpdated", new
                {
                    orderId = order.Id,
                    status = order.OrderStatus.ToString()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SignalR update for order #{OrderId}", orderId);
            }

            // Return empty TwiML response
            return Content(
                "<?xml version=\"1.0\" encoding=\"utf-8\"?><Response></Response>",
                "application/xml");
        }
    }
}
