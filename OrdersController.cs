using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CarServiceAPI.Controllers
{
    /// <summary>
    /// Manage orders data
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private static List<Order> orders = new List<Order>
        {
            new Order { Id = 1, Title = "تغيير الزيت", Price = 350, Status = "pending" },
            new Order { Id = 2, Title = "تغيير البطارية", Price = 500, Status = "completed" },
            new Order { Id = 3, Title = " غسيل السياره", Price = 200, Status = "pending" },
            new Order { Id = 4, Title = " خدمة الاطارات", Price = 250, Status = "completed" },
            new Order { Id = 5, Title = "خدمة الطوارئ", Price = 300, Status = "pending" }
        };

        /// <summary>
        /// Get all orders
        /// </summary>
        /// <response code="200">Returns all orders</response>
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(orders);
        }

        /// <summary>
        /// Get order by id
        /// </summary>
        /// <response code="200">Returns order details</response>
        /// <response code="404">Order not found</response>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = orders.FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        /// <summary>
        /// Get pending orders
        /// </summary>
        /// <response code="200">Returns pending orders</response>
        /// <response code="404">No pending orders found</response>
        [HttpGet("pending")]
        public IActionResult GetPending()
        {
            var pending = orders.Where(o => o.Status == "pending").ToList();

            if (!pending.Any())
                return NotFound();

            return Ok(pending);
        }

        /// <summary>
        /// Get completed orders
        /// </summary>
        /// <response code="200">Returns completed orders</response>
        /// <response code="404">No completed orders found</response>
        [HttpGet("completed")]
        public IActionResult GetCompleted()
        {
            var completed = orders.Where(o => o.Status == "completed").ToList();

            if (!completed.Any())
                return NotFound();

            return Ok(completed);
        }

        /// <summary>
        /// Add new order
        /// </summary>
        /// <response code="200">Order added successfully</response>
        /// <response code="400">Invalid input data</response>
        [HttpPost]
        public IActionResult AddOrder([FromBody] Order newOrder)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            newOrder.Id = orders.Max(o => o.Id) + 1;
            newOrder.Status = "pending";

            orders.Add(newOrder);

            return Ok(newOrder);
        }
    }

    public class Order
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Range(1, 10000, ErrorMessage = "Price must be greater than 0")]
        public int Price { get; set; }

        public string Status { get; set; }
    }
}