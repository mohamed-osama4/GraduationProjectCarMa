using CarMaintenance.DTOs;
using CarMaintenance.Models;

namespace CarMaintenance.Services.Interfaces
{
    public interface IOrderService
    {
        Task<List<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(int id);
        Task<Order> CreateAsync(CreateOrderDto dto);
        Task<Order?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
        Task<Order?> CancelAsync(int id);
    }
}