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

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL ORDERS =================
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders.ToListAsync();
            return Ok(orders);
        }

        // ================= CREATE ORDER + NOTIFICATION =================
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
    };

    _context.Orders.Add(order);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Order created",
        order
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