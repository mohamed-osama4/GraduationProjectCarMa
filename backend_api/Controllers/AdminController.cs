using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Models;
using CarMaintenance.Data;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // 📊 DASHBOARD (REAL DATABASE)
    [HttpGet("dashboard")]
    [SwaggerOperation(Summary = "Get Admin Dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();

        var today = DateTime.UtcNow.Date;

        var todayOrders = await _context.Orders
            .Where(o => o.CreatedAt.Date == today)
            .CountAsync();

        var activeOrders = await _context.Orders
            .Where(o => o.OrderStatus == OrderStatus.New ||
                        o.OrderStatus == OrderStatus.InProgress)
            .CountAsync();

        var pendingOrders = await _context.Orders
            .Where(o => o.OrderStatus == OrderStatus.New)
            .CountAsync();

        var totalRevenue = await _context.Orders
            .Where(o => o.OrderStatus == OrderStatus.Completed)
            .SumAsync(o => o.Price);

        var latestRequests = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new
            {
                o.Id,
                o.Address,
                o.PhoneNumber,
                o.Price,
                o.OrderStatus,
                o.CreatedAt
            })
            .ToListAsync();

        var data = new
        {
            stats = new
            {
                totalUsers,
                totalOrders,
                todayOrders,
                activeOrders,
                pendingOrders,
                totalRevenue
            },

            latestRequests
        };

        return Ok(data);
    }

    // 🔎 GLOBAL SEARCH (Search Bar)
    [HttpGet("search")]
    public async Task<IActionResult> GlobalSearch(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest(new { message = "keyword is required" });

        var users = await _context.Users
            .Where(u => u.Name.Contains(keyword) || u.Email.Contains(keyword))
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                Type = "user"
            })
            .ToListAsync();

        var orders = await _context.Orders
            .Where(o => o.PhoneNumber.Contains(keyword) || o.Address.Contains(keyword))
            .Select(o => new
            {
                o.Id,
                o.PhoneNumber,
                o.Address,
                Type = "order"
            })
            .ToListAsync();

        return Ok(new { users, orders });
    }

    //  NOTIFICATIONS (DB VERSION)
    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var notifications = await _context.Notifications
            .OrderByDescending(n => n.CreatedAt)
            .Take(10)
            .ToListAsync();

        return Ok(notifications);
    }

    //  ACCOUNT INFO
    [HttpGet("me")]
    public async Task<IActionResult> GetMyAccount()
    {
        var email = User.FindFirst(ClaimTypes.Name)?.Value;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.PhoneNumber,
            user.Role
        });
    }
}