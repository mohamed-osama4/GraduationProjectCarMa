using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Models;
using Swashbuckle.AspNetCore.Annotations;
    


[ApiController]
[Route("api/admin")]
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
                },
                new {
                    orderNumber="#12848",
                    customerName = "احمد محمود حسن ",
                    service = "تغيير البطارية",
                    customerRate=4.5,
                    price = 500,
                    address="الجيزة , المهندسين  , شارع  السودان 23",
                    status = "pending",
                    date = "2026-03-31",
                    phoneNumber=01098765432
                },
                new {
                    orderNumber="#12847",
                    customerName = "خالد عبدالله",
                    service = "خدمة الاطارات ",
                    customerRate=4.9,
                    price = 250,
                    address="الفاهرة , التجمع الخانس  , جنوب الاكاديمية",
                    status = "pending",
                    date = "2026-03-31",
                    phoneNumber=01123456789
                },
                new {
                    orderNumber="#12846",
                    customerName = "يوسف ابراهيم",
                    service = "خدمة طوارئ",
                    customerRate=4.2,
                    price = 300,
                    address="الفاهرة , مصر الجديدة   ,  الحي العاشر",
                    status = "pending",
                    date = "2026-03-31",
                    phoneNumber=01234567890
                }
            },

        
            technicians = new List<object>
            {
                
                new {
                    
                    name = "محمد أحمد",
                    rating = 4.8,
                    completedJobs = 145,
                    status = "available"
                },
                new {
                    name = "حسن محمود",
                    rating = 4.6,
                    completedJobs = 120,
                    status = "busy"
                },
                new {
                    name = "علي يوسف",
                    rating = 4.5,
                    completedJobs = 98,
                    status = "available"
                }
            },

         notifications = new List<object>
    {
        new {
            id = 1,
            title = "طلب طوارئ جديد",
            description = "طلب طوارئ في الجيزة - الهرم، يحتاج موافقة فورية",
            time = "منذ دقيقتين",
            type = "urgent",
            color = "red",
            icon = "alert"
        },
        new {
            id = 2,
            title = "فني غير متاح",
            description = "الفني عمر سعيد أبلغ عن عطل في السيارة",
            time = "منذ 15 دقيقة",
            type = "warning",
            color = "yellow",
            icon = "user"
        },
        new {
            id = 3,
            title = "دفعة جديدة",
            description = "تم استلام دفعة بقيمة 500 جنيه من العميل محمد أحمد",
            time = "منذ 30 دقيقة",
            type = "success",
            color = "green",
            icon = "money"
        }
    },
    
    currentOrders = new List<object>
{
    new {
        id = 12845,
        customerName = "عمر سعيد",
        technicianName = "محمد أحمد",
        service = "غسيل السيارة",
        location = "القاهرة - النزهة",
        price = 200,
        time = "02:30 PM",
        status = "inProgress"
    },
    new {
        id = 12844,
        customerName = "حسن علي",
        technicianName = "أحمد علي",
        service = "تغيير الزيت",
        location = "الجيزة - الدقي",
        price = 350,
        time = "01:15 PM",
        status = "inProgress"
    },
    new {
        id = 12843,
        customerName = "فاطمة محمد",
        technicianName = "حسام الدين",
        service = "خدمة ونش",
        location = "القاهرة - مدينة نصر",
        price = 600,
        time = "12:00 PM",
        status = "completed"
    },
    new {
        id = 12842,
        customerName = "سارة أحمد",
        technicianName = "خالد محمود",
        service = "تغيير البطارية",
        location = "الجيزة - المهندسين",
        price = 500,
        time = "11:30 AM",
        status = "completed"
    },
    new {
        id = 12841,
        customerName = "محمود حسن",
        technicianName = "يوسف حسن",
        service = "خدمة الإطارات",
        location = "القاهرة - التجمع الخامس",
        price = 250,
        time = "10:45 AM",
        status = "completed"
    }
}
        };
        

        return Ok(new ApiResponse<object>(
            true,
            "Dashboard loaded successfully",
            data
        ));
    }

    /// <summary>
    /// Get all admin notifications.
    /// </summary>
    [HttpGet("notifications")]
    [ProducesResponseType(typeof(ApiResponse<List<string>>), 200)]
    [SwaggerOperation(
        Summary = "Get Notifications",
        Description = "Returns a list of admin notifications such as new orders, technician assignments, and completed orders."
    )]
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

    /// <summary>
    /// Search orders by customer name or service name.
    /// </summary>
    /// <param name="query">Optional search query to filter orders by customer name or service.</param>
    [HttpGet("/searchOrders")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [SwaggerOperation(
        Summary = "Search Orders",
        Description = "Searches orders by customer name or service name. Returns all orders if no query is provided."
    )]
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
