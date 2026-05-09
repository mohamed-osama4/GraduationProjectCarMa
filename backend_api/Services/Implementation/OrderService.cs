using CarMaintenance.Data;
using CarMaintenance.DTOs;
using CarMaintenance.Models;
using CarMaintenance.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;

namespace CarMaintenance.Services.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly INewNotificationService _newNotificationService;

        public OrderService(AppDbContext context, IHubContext<NotificationHub> hub, INewNotificationService newNotificationService)
        {
            _context = context;
            _hub = hub;
            _newNotificationService = newNotificationService;
        }

        // ================= GET ALL =================
        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        // ================= CREATE ORDER =================
        public async Task<Order> CreateAsync(CreateOrderDto dto)
        {
          var service = await _context.Services.FindAsync(dto.ServiceId);

var order = new Order
{
    UserId = dto.UserId,
    ServiceId = dto.ServiceId,

    Address = dto.Address,
    PhoneNumber = dto.PhoneNumber,

    Price = service.Price, 
    OrderStatus = OrderStatus.Pending,
    CreatedAt = DateTime.UtcNow
};

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await CreateNotification(
                order.Id,
                "New order created",
                "OrderCreated"
            );

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.System,
                Severity = NewNotificationSeverity.Info,
                Title = "تم إنشاء الطلب",
                Message = $"تم إنشاء طلبك #{order.Id} بنجاح.",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return order;
        }

        // ================= UPDATE STATUS =================
        public async Task<Order?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.OrderStatus = dto.OrderStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await CreateNotification(
                order.Id,
                $"Order status changed to {dto.OrderStatus}",
                "OrderUpdated"
            );

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

            return order;
        }

        // ================= CANCEL ORDER =================
        public async Task<Order?> CancelAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.OrderStatus = OrderStatus.Rejected;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await CreateNotification(
                order.Id,
                "Order has been canceled",
                "OrderRejected"
            );

            await _newNotificationService.CreateAsync(new CreateNewNotificationRequestDto
            {
                UserId = order.UserId,
                Type = NewNotificationType.System,
                Severity = NewNotificationSeverity.Warning,
                Title = "تم إلغاء الطلب",
                Message = $"تم إلغاء طلبك #{order.Id} بنجاح.",
                TargetType = "Order",
                TargetId = order.Id,
                ActionUrl = $"/orders/{order.Id}"
            });

            return order;
        }

        // ================= NOTIFICATION HELPER =================
        private async Task CreateNotification(int orderId, string message, string type)
        {
            var notification = new Notification
            {
                OrderId = orderId,
                Title = "Order Update",
                Description = message,
                Type = type,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}