using CarMaintenance.Common;
using CarMaintenance.DTOs;
using CarMaintenance.Models;
using CarMaintenance.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/orders")]

    [Authorize(Roles = "admin,technician")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();

            return Ok(ApiResponse<List<Order>>.SuccessResponse(
                orders,
                "Orders fetched successfully"
            ));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _service.GetByIdAsync(id);

            if (order == null)
                return NotFound(ApiResponse<object>.FailResponse("Order not found"));

            return Ok(ApiResponse<Order>.SuccessResponse(order));
        }

    
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var order = await _service.CreateAsync(dto);

            return Ok(ApiResponse<Order>.SuccessResponse(
                order,
                "Order created successfully"
            ));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _service.UpdateStatusAsync(id, dto);

            if (order == null)
                return NotFound(ApiResponse<object>.FailResponse("Order not found"));

            return Ok(ApiResponse<Order>.SuccessResponse(
                order,
                "Order updated successfully"
            ));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var order = await _service.CancelAsync(id);

            if (order == null)
                return NotFound(ApiResponse<object>.FailResponse("Order not found"));

            return Ok(ApiResponse<object>.SuccessResponse(
                order,
                "Order canceled successfully"
            ));
        }
    }
}