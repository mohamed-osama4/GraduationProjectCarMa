using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Models;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

[ApiController]
[Route("api/admin")]


[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    /// <summary>
    /// Get the admin dashboard data including stats, latest requests, technicians, and notifications.
    /// </summary>
    [HttpGet("/admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [SwaggerOperation(
        Summary = "Get Admin Dashboard",
        Description = "Returns the full admin dashboard data including revenue stats, latest service requests, technician info, and notifications."
    )]
    public IActionResult GetDashboard()
    {
        var data = new
        {
            stats = new
            {
                totalRevenue = 45320,
                totalOrders = 34,
                todayOrders = 89,
                activeOrders = 47,
                pendingOrders = 23,
                totalRequests = 1247
            },

            latestRequests = new List<object>
            {
                new {
                    orderNumber="#12849",
                    customerName = " محمد أحمد علي",
                    service = "تغيير الزيت ",
                    customerRate=4.8,
                    price = 350,
                    address="القاهرة , مدينة نصر , شارع عباس العقاد 45",
                    status = "pending",
                    date = "2026-03-31",
                    phoneNumber=01012345678
                }
            },

            technicians = new List<object>
            {
                new {
                    name = "محمد أحمد",
                    rating = 4.8,
                    completedJobs = 145,
                    status = "available"
                }
            },

            notifications = new List<object>
            {
                new {
                    id = 1,
                    title = "طلب طوارئ جديد",
                    description = "طلب طوارئ في الجيزة",
                    time = "منذ دقيقتين",
                    type = "urgent",
                    color = "red",
                    icon = "alert"
                }
            }
        };

        return Ok(new ApiResponse<object>(
            true,
            "Dashboard loaded successfully",
            data
        ));
    }

    [HttpGet("notifications")]
    public IActionResult GetNotifications()
    {
        var notifications = new List<string>
        {
            "New order received",
            "Technician assigned",
            "Order completed"
        };

        return Ok(new ApiResponse<List<string>>(
            true,
            "Notifications fetched",
            notifications
        ));
    }

    [HttpGet("/searchOrders")]
    public IActionResult Search([FromQuery] string? query)
    {
        var orders = new List<object>
        {
            new { Id = 1, CustomerName = "Ahmed", Service = "Oil Change", Price = 350, Status = "pending" },
            new { Id = 2, CustomerName = "Ali", Service = "Battery Change", Price = 500, Status = "completed" }
        };

        if (string.IsNullOrWhiteSpace(query))
            return Ok(orders);

        var result = orders
            .Where(o =>
            {
                var name = o.GetType().GetProperty("CustomerName")?.GetValue(o)?.ToString() ?? "";
                var service = o.GetType().GetProperty("Service")?.GetValue(o)?.ToString() ?? "";
                return name.ToLower().Contains(query.ToLower())
                    || service.ToLower().Contains(query.ToLower());
            })
            .ToList();

        return Ok(new ApiResponse<object>(
            true,
            "Search completed",
            result
        ));
    }
}