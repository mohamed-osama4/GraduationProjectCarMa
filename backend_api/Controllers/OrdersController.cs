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

        // ================= GET ORDERS WITH STATS, SEARCH & ICONS =================
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll([FromQuery] string? search = null, [FromQuery] string? status = null)
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
                .Include(o => o.Service)
                .Include(o => o.User)
                .AsQueryable();

            
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(o => 
                    o.Id.ToString().Contains(search) || 
                    o.User.Name.Contains(search) || 
                    o.Service.Name.Contains(search) ||
                    (o.TechnicianName != null && o.TechnicianName.Contains(search)));
            }

            if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
            {
                query = query.Where(o => o.OrderStatus.ToString() == status);
            }

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    id = "#" + o.Id,
                    service = new {
                        name = o.Service.Name,
                        icon = o.Service.Name.Contains("زيت") ? "oil-icon" :
                               o.Service.Name.Contains("بطارية") ? "battery-icon" :
                               o.Service.Name.Contains("غسيل") ? "wash-icon" :
                               o.Service.Name.Contains("طارئة") ? "emergency-icon" :
                               o.Service.Name.Contains("ونش") ? "towing-icon" :
                               o.Service.Name.Contains("إطار") ? "tire-icon" : "default-icon",
                        color = o.Service.Name.Contains("زيت") ? "#FFB300" : // أصفر
                                o.Service.Name.Contains("بطارية") ? "#1E88E5" : // أزرق
                                o.Service.Name.Contains("غسيل") ? "#8E24AA" : // بنفسجي
                                o.Service.Name.Contains("طارئة") ? "#E53935" : // أحمر
                                o.Service.Name.Contains("ونش") ? "#FB8C00" : // برتقالي
                                "#43A047" // أخضر للإطارات
                    },
                    customer = new {
                        name = o.User.Name,
                        rating = 4.8, 
                    },
                    location = o.Address,
                    dateTime = o.CreatedAt.ToString("yyyy/MM/dd | hh:mm tt"),
                    status = new {
                        label = o.OrderStatus == OrderStatus.Pending ? "قيد المراجعة" :
                                o.OrderStatus == OrderStatus.Accepted ? "تمت الموافقة" :
                                o.OrderStatus == OrderStatus.InProgress ? "جاري التنفيذ" : "مكتمل",
                        value = o.OrderStatus.ToString()
                    },
                    technician = o.TechnicianName ?? "غير معين",
                    paymentStatus = o.IsPaid ? "مدفوع" : "لم يدفع",
                    price = o.Price.ToString("N0") + " جنيه"
                }).ToListAsync();

            return Ok(new { stats, orders });
        }

        // ================= CREATE ORDER =================
        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDto dto)
        {
            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null) return BadRequest("Service not found");

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
            return Ok(new { message = "Order created", order });
        }

        // ================= ACCEPT ORDER =================
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AcceptOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            
            order.OrderStatus = OrderStatus.Accepted;
            await _context.SaveChangesAsync();
            
            await _hub.Clients.All.SendAsync("OrderUpdated", new { orderId = id, status = "Accepted" });
            
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
            
            await _hub.Clients.All.SendAsync("OrderUpdated", new { orderId = id, status = "Rejected" });
            
            return Ok(new { message = "Order rejected" });
        }
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

    [HttpGet("{id}")]
public async Task<IActionResult> GetOrderById(int id)
{
    var order = await _context.Orders
        .Include(o => o.User)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null)
    {
        return NotFound(new
        {
            success = false,
            message = "Order not found"
        });
    }

    return Ok(new
    {
        success = true,
        data = order
    });
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