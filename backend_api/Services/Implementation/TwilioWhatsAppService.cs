using CarMaintenance.Services.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace CarMaintenance.Services.Implementation
{
    public class TwilioWhatsAppService : ITwilioWhatsAppService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<TwilioWhatsAppService> _logger;

        public TwilioWhatsAppService(IConfiguration config, ILogger<TwilioWhatsAppService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendOrderToWorkshopAsync(
            int orderId,
            string serviceName,
            string customerName,
            string customerPhone,
            string address,
            string details)
        {
            var accountSid = _config["Twilio:AccountSid"];
            var authToken  = _config["Twilio:AuthToken"];
            var from       = _config["Twilio:FromNumber"];       // whatsapp:+14155238886
            var to         = _config["Twilio:WorkshopNumber"];   // whatsapp:+201025105122
            var contentSid = _config["Twilio:ContentSid"];       // HX204e8bba55cb8233582c9e92fdb80a3d

            TwilioClient.Init(accountSid, authToken);

            // Build content variables {{1}} through {{6}}
            var contentVariables = System.Text.Json.JsonSerializer.Serialize(
                new Dictionary<string, string>
                {
                    { "1", orderId.ToString() },
                    { "2", serviceName },
                    { "3", customerName },
                    { "4", customerPhone },
                    { "5", address },
                    { "6", string.IsNullOrWhiteSpace(details) ? "لا توجد ملاحظات" : details }
                });

            try
            {
                var message = await MessageResource.CreateAsync(
                    to: new PhoneNumber(to!),
                    from: new PhoneNumber(from!),
                    contentSid: contentSid,
                    contentVariables: contentVariables
                );

                _logger.LogInformation(
                    "WhatsApp message sent to workshop for order #{OrderId}. SID: {MessageSid}",
                    orderId, message.Sid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Failed to send WhatsApp message for order #{OrderId}", orderId);
                throw;
            }
        }
    }
}
