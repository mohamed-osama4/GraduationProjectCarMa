namespace CarMaintenance.Services.Interfaces
{
    public interface ITwilioWhatsAppService
    {
        /// <summary>
        /// Sends a WhatsApp template message to the workshop with order details.
        /// </summary>
        Task SendOrderToWorkshopAsync(
            int orderId,
            string serviceName,
            string customerName,
            string customerPhone,
            string address,
            string details);
    }
}
