using System.ComponentModel.DataAnnotations;

namespace CarMaintenance.Models.DTOs
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus OrderStatus { get; set; }
    }
}
