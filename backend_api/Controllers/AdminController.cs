using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Models;
using CarMaintenance.Data;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CarMaintenance.DTOs;

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

    [HttpGet("dashboard")]
    [SwaggerOperation(Summary = "Get Admin Dashboard Data")]
    public async Task<IActionResult> GetDashboard()
    {
        var today = DateTime.UtcNow.Date;

        var stats = new
        {
            totalOrders = await _context.Orders.CountAsync(),
            pendingOrders = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Pending),
            inProgressOrders = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.InProgress),
            completedToday = await _context.Orders.CountAsync(o => o.OrderStatus == OrderStatus.Completed && o.CreatedAt.Date == today),
            totalTechs = await _context.Users.CountAsync(u => u.Role == "Technician"),
            todayRevenue = await _context.Orders
                .Where(o => o.OrderStatus == OrderStatus.Completed && o.CreatedAt.Date == today)
                .SumAsync(o => o.Price)
        };

        var requestsNeedingApproval = await _context.Orders
            .Include(o => o.Service) 
            .Include(o => o.User)    
            .Where(o => o.OrderStatus == OrderStatus.Pending)
            .OrderByDescending(o => o.CreatedAt)
            .Take(4)
            .Select(o => new {
                o.Id,
                ServiceName = o.Service != null ? o.Service.Name : "صيانة عامة",
                CustomerName = o.User != null ? o.User.Name : "عميل غير معروف",
                o.Address,
                o.PhoneNumber,
                o.Price,
                o.CreatedAt
            })
            .ToListAsync();

        var technicians = await _context.Users
            .Where(u => u.Role == "Technician")
            .Take(5)
            .Select(u => new {
                u.Name,
                Specialization = "فني صيانة معتمد", 
                Rating = 4.8
            })
            .ToListAsync();

        var currentOrders = await _context.Orders
            .Include(o => o.Service)
            .Include(o => o.User)
            .Where(o => o.OrderStatus == OrderStatus.InProgress || o.OrderStatus == OrderStatus.Accepted)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new {
                o.Id,
                ServiceName  = o.Service.Name,
                CustomerName =o.User.Name ,
                o.Address,
                o.PhoneNumber,
                o.Price,
                Status = o.OrderStatus.ToString(),
                o.CreatedAt
            })
            .ToListAsync();

        return Ok(new {
            stats,
            requestsNeedingApproval,
            technicians,
            currentOrders
        });
    }
    [Authorize]
[HttpPut("profile")]
public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId))
        return Unauthorized();

    var user = await _context.Users.FindAsync(int.Parse(userId));

    if (user == null)
        return NotFound(new
        {
            success = false,
            message = "User not found"
        });

    user.Name = dto.FullName;
    user.Email = dto.Email;
    user.PhoneNumber = dto.PhoneNumber;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        success = true,
        message = "Profile updated successfully",
        data = user
    });
}

    [HttpGet("search")]
    public async Task<IActionResult> GlobalSearch(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest(new { message = "كلمة البحث مطلوبة" });

        var users = await _context.Users
            .Where(u => u.Name.Contains(keyword) || u.Email.Contains(keyword))
            .Select(u => new { u.Id, u.Name, u.Email, Type = "user" })
            .ToListAsync();

        var orders = await _context.Orders
            .Where(o => o.PhoneNumber.Contains(keyword) || o.Address.Contains(keyword))
            .Select(o => new { o.Id, o.PhoneNumber, o.Address, Type = "order" })
            .ToListAsync();

        return Ok(new { users, orders });
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var notifications = await _context.Notifications
            .OrderByDescending(n => n.CreatedAt)
            .Take(10)
            .ToListAsync();
        return Ok(notifications);
    }

   [HttpGet("me")]
public async Task<IActionResult> GetMyAccount()
{
    var emailFromClaim = User.FindFirst(ClaimTypes.Email)?.Value 
                        ?? User.FindFirst(ClaimTypes.Name)?.Value 
                        ?? User.Identity?.Name; 
    var userIdFromClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    User? user = null;

    if (!string.IsNullOrEmpty(userIdFromClaim) && int.TryParse(userIdFromClaim, out int id))
    {
        user = await _context.Users.FindAsync(id);
    }

    if (user == null && !string.IsNullOrEmpty(emailFromClaim))
    {
        user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailFromClaim.ToLower());
    }

    if (user == null)
    {
        return NotFound(new { 
            message = "المستخدم غير موجود",
            details = "التوكن سليم بس البيانات مش مطابقة للداتا بيز",
            extractedEmail = emailFromClaim,
            extractedId = userIdFromClaim
        });
    }

    return Ok(new { 
        user.Id, 
        user.Name, 
        user.Email, 
        user.PhoneNumber,
        user.Role 
    });
}
}