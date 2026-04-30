using CarMaintenance.Data;
using CarMaintenance.DTOs;
using CarMaintenance.Models;
using CarMaintenance.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarMaintenance.Services.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task<Order> CreateAsync(CreateOrderDto dto)
        {
            var order = new Order
            {
                UserId = dto.UserId,
                VehicleId = dto.VehicleId,
                ServiceId = dto.ServiceId,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                OrderStatus = OrderStatus.New,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.OrderStatus = dto.OrderStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order?> CancelAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.OrderStatus = OrderStatus.Canceled;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return order;
        }
    }
}