using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using CarMaintenance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;
using CarMaintenance.DTOs;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;

        public OrdersController(AppDbContext context, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _hub = hub;
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

            return Ok(new { message = "Order rejected" });
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