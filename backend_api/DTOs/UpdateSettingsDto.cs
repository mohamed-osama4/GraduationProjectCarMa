namespace CarMaintenance.DTOs
{
    public class UpdateSettingsDto
    {
        public bool EmailNotifications { get; set; }

        public bool SmsNotifications { get; set; }

        public bool PromotionalOffers { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public bool BiometricsEnabled { get; set; }
    }
}