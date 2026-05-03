using CarMaintenance.Data;
using CarMaintenance.DTOs;
using CarMaintenance.Models;
using CarMaintenance.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;

namespace CarMaintenance.Services.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;

        public OrderService(AppDbContext context, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _hub=hub;
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
    OrderStatus = OrderStatus.New,
    CreatedAt = DateTime.UtcNow
};

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await CreateNotification(
                order.Id,
                "New order created",
                "OrderCreated"
            );

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

            return order;
        }

        // ================= CANCEL ORDER =================
        public async Task<Order?> CancelAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.OrderStatus = OrderStatus.Canceled;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await CreateNotification(
                order.Id,
                "Order has been canceled",
                "OrderRejected"
            );

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