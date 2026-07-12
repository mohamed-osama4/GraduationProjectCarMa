using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using CarMaintenance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;
using CarMaintenance.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using CarMaintenance.Services.Interfaces;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;
using System.Security.Claims;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly INewNotificationService _newNotificationService;
        private readonly IAdminActivityLogService _activityLogService;
        private readonly ITwilioWhatsAppService _twilioService;

        public OrdersController(
            AppDbContext context,
            IHubContext<NotificationHub> hub,
            INewNotificationService newNotificationService,
            IAdminActivityLogService activityLogService,
            ITwilioWhatsAppService twilioService)
        {
            _context = context;
            _hub = hub;
            _newNotificationService = newNotificationService;
            _activityLogService = activityLogService;
            _twilioService = twilioService;
        }

        // ================= GET ALL ORDERS =================
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null)
        {
            var stats = new
            {
                total = await _context.Orders.CountAsync(),
                pending = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Pending),
                underStudy = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Accepted),
                inProgress = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.InProgress),
                completed = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Completed),
                rejected = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Rejected)
            };

            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Service)
                .Include(o => o.SubService)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(o =>
                    o.Id.ToString().Contains(search) ||
                    o.User.Name.Contains(search) ||
                    o.Service.Name.Contains(search) ||
                    (o.TechnicianName != null && o.TechnicianName.Contains(search)));
            }

            if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
            {
                if (Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                {
                    query = query.Where(o => o.OrderStatus == parsedStatus);
                }
            }

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    id = "#" + o.Id,
                    service = new
                    {
                        name = o.Service.Name,
                        subServiceName = o.SubService != null ? o.SubService.Name : null,
                        icon = o.Service.Name.Contains("زيت") ? "oil-icon" :
                               o.Service.Name.Contains("بطارية") ? "battery-icon" :
                               o.Service.Name.Contains("غسيل") ? "wash-icon" :
                               o.Service.Name.Contains("طارئة") ? "emergency-icon" :
                               o.Service.Name.Contains("ونش") ? "towing-icon" :
                               o.Service.Name.Contains("إطار") ? "tire-icon" : "default-icon",

                        color = o.Service.Name.Contains("زيت") ? "#FFB300" :
                                o.Service.Name.Contains("بطارية") ? "#1E88E5" :
                                o.Service.Name.Contains("غسيل") ? "#8E24AA" :
                                o.Service.Name.Contains("طارئة") ? "#E53935" :
                                o.Service.Name.Contains("ونش") ? "#FB8C00" : "#43A047"
                    },
                    customer = new
                    {
                        name = o.User.Name,
                        rating = 4.8
                    },

                    location = o.Address,

                    dateTime = o.CreatedAt.ToString("yyyy/MM/dd | hh:mm tt"),
                    neededServiceTime = o.NeededServiceTime != null ? o.NeededServiceTime.Value.ToString("yyyy/MM/dd | hh:mm tt") : null,
                    status = new
                    {
                        label = o.OrderStatus == OrderStatus.Pending ? "قيد المراجعة" :
                                o.OrderStatus == OrderStatus.Accepted ? "تمت الموافقة" :
                                o.OrderStatus == OrderStatus.InProgress ? "جاري التنفيذ" :
                                o.OrderStatus == OrderStatus.Rejected ? "مرفوض" : "مكتمل",
                        value = o.OrderStatus.ToString()
                    },

                    technician = o.TechnicianName ?? "غير معين",
                    paymentStatus = o.IsPaid ? "مدفوع" : "لم يدفع",
                    paymentMethod = (int)o.PaymentMethod,
                    price = o.Price.ToString("N0") + " جنيه"
                })
                .ToListAsync();

            return Ok(new { stats, orders });
        }

        // ================= CREATE ORDER =================
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateOrderDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int tokenUserId))
            {
                dto.UserId = tokenUserId;
            }

            if (dto.UserId <= 0)
                return BadRequest("Invalid or missing User ID.");
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null)
                return BadRequest("Service not found");

            var order = new Order
            {
                UserId = dto.UserId,
                ServiceId = dto.ServiceId,
                SubServiceId = dto.SubServiceId,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                Price = service.Price,
                OrderStatus = OrderStatus.Pending,
                PaymentMethod = dto.PaymentMethod,
                NeededServiceTime = dto.NeededServiceTime?.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow,
                IsPaid = false,

                ImageUrl = dto.ImageUrl,
                Notes = dto.Notes
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.System,
                Severity = NewNotificationSeverity.Info,
                Title = "تم إنشاء الطلب",
                Message = $"تم إنشاء طلب {(order.SubServiceId.HasValue ? order.SubService?.Name : service.Name)} بنجاح. رقم الطلب #{order.Id}",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            await _hub.Clients.All.SendAsync("OrderCreated", new
            {
                orderId = order.Id,
                status = order.OrderStatus.ToString()
            });

            return Ok(new { message = "Order created", order });
        }

        // ================= ACCEPT ORDER =================
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AcceptOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Service)
                .Include(o => o.SubService)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            order.OrderStatus = OrderStatus.Accepted;
            await _context.SaveChangesAsync();

            // ── Send WhatsApp to workshop via Twilio ──
            try
            {
                var serviceName = order.SubService != null
                    ? $"{order.Service?.Name} - {order.SubService.Name}"
                    : order.Service?.Name ?? "صيانة عامة";

                await _twilioService.SendOrderToWorkshopAsync(
                    orderId: order.Id,
                    serviceName: serviceName,
                    customerName: order.User?.Name ?? "عميل",
                    customerPhone: order.PhoneNumber,
                    address: order.Address,
                    details: order.Notes ?? "لا توجد ملاحظات");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to send WhatsApp for order {id}: {ex.Message}");
            }

            try
            {
                await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
                {
                    UserId = order.UserId,
                    Type = NewNotificationType.RequestAccepted,
                    Severity = NewNotificationSeverity.Success,
                    Title = "تم قبول الطلب",
                    Message = $"تم قبول طلبك #{order.Id}",
                    TargetType = "Order",
                    TargetId = order.Id,
                    ActionUrl = $"/orders/{order.Id}"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to create notification for accepted order {id}: {ex.Message}");
            }

            try
            {
                await _hub.Clients.All.SendAsync("OrderUpdated", new
                {
                    orderId = id,
                    status = "Accepted"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to send SignalR update for accepted order {id}: {ex.Message}");
            }

            // Log activity log
            var adminUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(adminUserIdClaim) && int.TryParse(adminUserIdClaim, out int adminUserId))
            {
                await _activityLogService.LogAsync(
                    adminUserId: adminUserId,
                    action: "AcceptOrder",
                    description: $"وافق المسؤول على الطلب رقم #{order.Id}",
                    targetType: "Order",
                    targetId: order.Id,
                    ipAddress: HttpContext.Connection.RemoteIpAddress?.ToString()
                );
            }

            return Ok(new { message = "Order accepted" });
        }

        // ================= REJECT ORDER =================
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RejectOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.OrderStatus = OrderStatus.Rejected;
            await _context.SaveChangesAsync();

            try
            {
                await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
                {
                    UserId = order.UserId,
                    Type = NewNotificationType.System,
                    Severity = NewNotificationSeverity.Error,
                    Title = "تم رفض الطلب",
                    Message = $"تم رفض طلبك #{order.Id}",
                    TargetType = "Order",
                    TargetId = order.Id,
                    ActionUrl = $"/orders/{order.Id}"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to create notification for rejected order {id}: {ex.Message}");
            }

            try
            {
                await _hub.Clients.All.SendAsync("OrderUpdated", new
                {
                    orderId = id,
                    status = "Rejected"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to send SignalR update for rejected order {id}: {ex.Message}");
            }

            // Log activity log
            var adminUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(adminUserIdClaim) && int.TryParse(adminUserIdClaim, out int adminUserId))
            {
                await _activityLogService.LogAsync(
                    adminUserId: adminUserId,
                    action: "RejectOrder",
                    description: $"رفض المسؤول الطلب رقم #{order.Id}",
                    targetType: "Order",
                    targetId: order.Id,
                    ipAddress: HttpContext.Connection.RemoteIpAddress?.ToString()
                );
            }

            return Ok(new { message = "Order rejected" });
        }

        // ================= UPDATE STATUS =================
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.OrderStatus = dto.OrderStatus;
            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("OrderUpdated", new
            {
                orderId = id,
                status = dto.OrderStatus.ToString()
            });

            return Ok(new { message = "Order updated", order });
        }

        // ================= USER ORDERS =================
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = orders
            });
        }

        // ================= GET BY ID =================
      // ================= GET ORDER DETAILS =================
[HttpGet("{id}")]
public async Task<IActionResult> GetOrderById(int id)
{
    var order = await _context.Orders
        .Include(o => o.User)
        .Include(o => o.Service)
        .Include(o => o.SubService)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Order not found"
        });
    }

    var result = new
    {
        id = order.Id,

        customer = new
        {
            name = order.User.Name,
            phone = order.PhoneNumber
        },

        service = new
        {
            name = order.Service.Name,
            subServiceName = order.SubService != null ? order.SubService.Name : null
        },

        address = order.Address,

        status = order.OrderStatus.ToString(),

        price = order.Price,

        paymentStatus = order.IsPaid ? "مدفوع" : "لم يدفع",

        paymentMethod = (int)order.PaymentMethod,

        technician = order.TechnicianName ?? "غير معين",

        createdAt = order.CreatedAt.ToString("yyyy/MM/dd hh:mm tt"),
        neededServiceTime = order.NeededServiceTime != null ? order.NeededServiceTime.Value.ToString("yyyy/MM/dd hh:mm tt") : null,

        imageUrl = order.ImageUrl,

        notes = order.Notes
    };

    return Ok(new
    {
        success = true,
        data = result
    });
}
    }
}