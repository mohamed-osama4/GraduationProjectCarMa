using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        public class Order
        {
            public string OrderNumber { get; set; }
            public string Service { get; set; }
            public string Icon { get; set; }
            public string CustomerName { get; set; }
            public double Rating { get; set; }
            public string Location { get; set; }
            public string DateTime { get; set; }
            public string Status { get; set; }
            public string PaymentStatus { get; set; }
            public int Price { get; set; }
            public string Action { get; set; }
        }

        private static List<Order> orders = new List<Order>
        {
            new Order { 
                OrderNumber = "#12849", Service = "تغيير الزيت", Icon = "oil", CustomerName = "محمد أحمد علي", 
                Rating = 4.8, Location = "القاهرة، مدينة نصر، شارع عباس العقاد 45", DateTime = "31 مارس 2026 - 02:30 م", 
                Status = "قيد المراجعة", PaymentStatus = "لم يدفع", Price = 350, Action = "عرض" 
            },
            new Order { 
                OrderNumber = "#12848", Service = "تغيير البطارية", Icon = "battery", CustomerName = "أحمد محمود حسن", 
                Rating = 4.5, Location = "الجيزة، المهندسين، شارع السودان 23", DateTime = "31 مارس 2026 - 03:00 م", 
                Status = "تمت الموافقة", PaymentStatus = "مدفوع", Price = 500, Action = "عرض" 
            },
            new Order { 
                OrderNumber = "#12847", Service = "خدمة الإطارات", Icon = "tire", CustomerName = "خالد عبد الله", 
                Rating = 4.9, Location = "القاهرة، التجمع الخامس، شارع جنوب الأكاديمية", DateTime = "31 مارس 2026 - 04:00 م", 
                Status = "جاري التنفيذ", PaymentStatus = "مدفوع", Price = 250, Action = "عرض" 
            },
            new Order { 
                OrderNumber = "#12846", Service = "غسيل السيارة", Icon = "wash", CustomerName = "عمر سعيد", 
                Rating = 4.3, Location = "القاهرة، النزهة، شارع الطيران", DateTime = "31 مارس 2026 - 01:15 م", 
                Status = "مكتمل", PaymentStatus = "مدفوع", Price = 200, Action = "عرض" 
            },
            new Order { 
                OrderNumber = "#12845", Service = "صيانة فرامل", Icon = "brakes", CustomerName = "ياسين محمد", 
                Rating = 4.7, Location = "الإسكندرية، سموحة، طريق الحرية", DateTime = "31 مارس 2026 - 10:00 ص", 
                Status = "مرفوض", PaymentStatus = "لم يدفع", Price = 400, Action = "عرض" 
            }
        };

        [HttpGet]
        public IActionResult GetAll(string? search, string? status)
        {
            var result = orders.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                result = result.Where(o => 
                    o.CustomerName.Contains(search) || 
                    o.Service.Contains(search) || 
                    o.OrderNumber.Contains(search));
            }

            if (!string.IsNullOrEmpty(status) && status != "الكل")
            {
                result = result.Where(o => o.Status == status);
            }

            return Ok(result.ToList());
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            return Ok(new
            {
                total = orders.Count,
                reviewing = orders.Count(x => x.Status == "قيد المراجعة"),
                approved = orders.Count(x => x.Status == "تمت الموافقة"),
                inProgress = orders.Count(x => x.Status == "جاري التنفيذ"),
                completed = orders.Count(x => x.Status == "مكتمل"),
                rejected = orders.Count(x => x.Status == "مرفوض")
            });
        }

        [HttpGet("{orderNumber}")]
        public IActionResult GetByNumber(string orderNumber)
        {
            var order = orders.FirstOrDefault(x => x.OrderNumber == orderNumber);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public IActionResult CreateOrder([FromBody] Order newOrder)
        {
            orders.Add(newOrder);
            return CreatedAtAction(nameof(GetByNumber), new { orderNumber = newOrder.OrderNumber }, newOrder);
        }

        [HttpPut("{orderNumber}/status")]
        public IActionResult UpdateStatus(string orderNumber, [FromBody] string newStatus)
        {
            var order = orders.FirstOrDefault(x => x.OrderNumber == orderNumber);
            if (order == null) return NotFound();
            order.Status = newStatus;
            return NoContent();
        }

        [HttpDelete("{orderNumber}")]
        public IActionResult DeleteOrder(string orderNumber)
        {
            var order = orders.FirstOrDefault(x => x.OrderNumber == orderNumber);
            if (order == null) return NotFound();
            orders.Remove(order);
            return NoContent();
        }
    }
}