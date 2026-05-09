using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using CarMaintenance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;
using CarMaintenance.DTOs;
using CarMaintenance.Services.Interfaces;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly INewNotificationService _newNotificationService;

        public OrdersController(AppDbContext context, IHubContext<NotificationHub> hub, INewNotificationService newNotificationService)
        {
            _context = context;
            _hub = hub;
            _newNotificationService = newNotificationService;
        }

        // ================= GET ALL ORDERS (WITH FILTER + JOIN) =================
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll(string? OrderStatus = null)
        {
            var query = _context.Orders
                .Include(o => o.Service)
                .Include(o => o.User)
                .AsQueryable();

            // فلترة حسب الحالة
            if (!string.IsNullOrEmpty(OrderStatus))
            {
                query = query.Where(o => o.OrderStatus.ToString() == OrderStatus);
            }

            var orders = await query.Select(o => new
            {
                id = o.Id,
                service = o.Service.Name,
                customerName = o.User.Name,
                location = o.Address,
                date = o.CreatedAt,
                OrderStatus = o.OrderStatus.ToString(),
                technician = o.TechnicianName,
                paymentStatus = o.IsPaid ? "مدفوع" : "لم يدفع",
                price = o.Price
            }).ToListAsync();

            return Ok(orders);
        }

        // ================= CREATE ORDER =================
        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDto dto)
        {
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null)
                return BadRequest("Service not found");

            var order = new Order
            {
                UserId = dto.UserId,
                ServiceId = dto.ServiceId,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,

                Price = service.Price,

                
                OrderStatus = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                IsPaid = false
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.System,
                Severity = NewNotificationSeverity.Info,
                Title = "تم إنشاء الطلب",
                Message = $"تم إنشاء طلب {service.Name} بنجاح. رقم الطلب #{order.Id}",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return Ok(new
            {
                message = "Order created",
                order
            });
        }

        // ================= ACCEPT ORDER =================
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AcceptOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.OrderStatus = OrderStatus.Accepted;

            await _context.SaveChangesAsync();

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.RequestAccepted,
                Severity = NewNotificationSeverity.Success,
                Title = "تم قبول الطلب",
                Message = $"تم قبول طلبك #{order.Id} وجاري تعيين فني لك.",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return Ok(new { message = "Order accepted" });
        }

        // ================= REJECT ORDER =================
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RejectOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.OrderStatus = OrderStatus.Rejected;

            await _context.SaveChangesAsync();

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.System,
                Severity = NewNotificationSeverity.Error,
                Title = "تم رفض الطلب",
                Message = $"نأسف، تم رفض طلبك #{order.Id}. يرجى التواصل مع الدعم لمزيد من التفاصيل.",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return Ok(new { message = "Order rejected" });
        }

        // ================= UPDATE ORDER STATUS =================
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound(new { message = "Order not found" });

            order.OrderStatus = dto.OrderStatus;
            await _context.SaveChangesAsync();

            var notificationType = dto.OrderStatus switch
            {
                OrderStatus.Accepted => NewNotificationType.RequestAccepted,
                OrderStatus.InProgress => NewNotificationType.TechnicianOnWay,
                OrderStatus.Completed => NewNotificationType.ServiceCompleted,
                OrderStatus.Rejected => NewNotificationType.System,
                _ => NewNotificationType.System
            };

            var severity = dto.OrderStatus switch
            {
                OrderStatus.Completed => NewNotificationSeverity.Success,
                OrderStatus.Accepted => NewNotificationSeverity.Success,
                OrderStatus.Rejected => NewNotificationSeverity.Error,
                _ => NewNotificationSeverity.Info
            };

            var title = dto.OrderStatus switch
            {
                OrderStatus.Accepted => "تم قبول الطلب",
                OrderStatus.InProgress => "الفني في الطريق",
                OrderStatus.Completed => "تم إتمام الخدمة",
                OrderStatus.Rejected => "تم رفض الطلب",
                _ => "تحديث حالة الطلب"
            };

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = notificationType,
                Severity = severity,
                Title = title,
                Message = $"تم تحديث حالة طلبك #{order.Id} إلى {dto.OrderStatus}",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return Ok(new { message = "Order status updated", order });
        }

        // ================= NOTIFICATIONS =================
        [HttpGet("/api/notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var data = await _context.Notifications
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(data);
        }
    }
}