using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CarServiceAPI.Controllers
{
    /// <summary>
    /// Manage orders data
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        public class Order
        {
            public int Id { get; set; }
            public string Service { get; set; }
            public string CustomerName { get; set; }
            public double Rating { get; set; }
            public string Location { get; set; }
            public DateTime DateTime { get; set; }
            public string Technician { get; set; }
            public string PaymentStatus { get; set; }
            public int Price { get; set; }
            public string Status { get; set; }
        }

        private static List<Order> orders = new List<Order>
        {
            new Order { Id = 12849, Service = "تغيير زيت", CustomerName = "محمد علي", Rating = 4.8, Location = "القاهرة، مدينة نصر", DateTime = DateTime.Now.AddMinutes(-30), Technician = "لم يتم", PaymentStatus = "لم يدفع", Price = 350, Status = "قيد المراجعة" },
            new Order { Id = 12848, Service = "تغيير بطارية", CustomerName = "أحمد محمود", Rating = 4.5, Location = "الجيزة، المهندسين", DateTime = DateTime.Now.AddHours(-1), Technician = "أحمد علي", PaymentStatus = "مدفوع", Price = 500, Status = "تمت الموافقة" },
            new Order { Id = 12847, Service = "خدمة الإطارات", CustomerName = "خالد عبد الله", Rating = 4.9, Location = "القاهرة، التجمع", DateTime = DateTime.Now.AddHours(-2), Technician = "يوسف حسن", PaymentStatus = "مدفوع", Price = 250, Status = "جاري التنفيذ" },
            new Order { Id = 12846, Service = "غسيل سيارة", CustomerName = "عمر سعيد", Rating = 4.3, Location = "القاهرة، الزمالك", DateTime = DateTime.Now.AddHours(-3), Technician = "محمد أحمد", PaymentStatus = "مدفوع", Price = 200, Status = "مكتمل" },
            new Order { Id = 12845, Service = "خدمة الطوارئ", CustomerName = "علي حسن", Rating = 4.6, Location = "الإسكندرية", DateTime = DateTime.Now.AddHours(-4), Technician = "غير محدد", PaymentStatus = "لم يدفع", Price = 300, Status = "مرفوض" },

            new Order { Id = 12844, Service = "تغيير زيت", CustomerName = "حسن محمد", Rating = 4.2, Location = "القاهرة", DateTime = DateTime.Now.AddHours(-5), Technician = "أحمد علي", PaymentStatus = "مدفوع", Price = 350, Status = "مكتمل" },
            new Order { Id = 12843, Service = "غسيل سيارة", CustomerName = "سعيد علي", Rating = 4.0, Location = "الجيزة", DateTime = DateTime.Now.AddHours(-6), Technician = "محمد أحمد", PaymentStatus = "مدفوع", Price = 200, Status = "مكتمل" },
            new Order { Id = 12842, Service = "خدمة الطوارئ", CustomerName = "محمود أحمد", Rating = 4.7, Location = "القاهرة", DateTime = DateTime.Now.AddHours(-7), Technician = "غير محدد", PaymentStatus = "لم يدفع", Price = 300, Status = "مرفوض" },
            new Order { Id = 12841, Service = "خدمة الإطارات", CustomerName = "يوسف علي", Rating = 4.6, Location = "الإسكندرية", DateTime = DateTime.Now.AddHours(-8), Technician = "يوسف حسن", PaymentStatus = "مدفوع", Price = 250, Status = "جاري التنفيذ" },
            new Order { Id = 12840, Service = "تغيير بطارية", CustomerName = "أحمد حسن", Rating = 4.5, Location = "القاهرة", DateTime = DateTime.Now.AddHours(-9), Technician = "أحمد علي", PaymentStatus = "مدفوع", Price = 500, Status = "تمت الموافقة" }
        };

        /// <summary>
        /// Get all orders
        /// </summary>
        /// <returns>List of orders</returns>
        /// <response code="200">Success</response>
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(orders);
        }

        /// <summary>
        /// Get orders summary (counts)
        /// </summary>
        /// <returns>Orders statistics</returns>
        /// <response code="200">Success</response>
        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var result = new
            {
                total = orders.
Count,
                completed = orders.Count(x => x.Status == "مكتمل"),
                inProgress = orders.Count(x => x.Status == "جاري التنفيذ"),
                approved = orders.Count(x => x.Status == "تمت الموافقة"),
                reviewing = orders.Count(x => x.Status == "قيد المراجعة"),
                rejected = orders.Count(x => x.Status == "مرفوض")
            };

            return Ok(result);
        }

        /// <summary>
        /// Filter orders by status
        /// </summary>
        /// <param name="status">Order status</param>
        /// <returns>Filtered orders</returns>
        /// <response code="200">Success</response>
        [HttpGet("status")]
        public IActionResult FilterByStatus(string status)
        {
            var result = orders.Where(x => x.Status == status).ToList();
            return Ok(result);
        }

        /// <summary>
        /// Search orders by customer name or service
        /// </summary>
        /// <param name="value">Search text</param>
        /// <returns>Matching orders</returns>
        /// <response code="200">Success</response>
        [HttpGet("search")]
        public IActionResult Search(string value)
        {
            var result = orders.Where(x =>
                x.CustomerName.Contains(value ?? "", StringComparison.OrdinalIgnoreCase) ||
                x.Service.Contains(value ?? "", StringComparison.OrdinalIgnoreCase)
            ).ToList();

            return Ok(result);
        }
    }
}