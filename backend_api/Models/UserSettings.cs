namespace CarMaintenance.Models
{
    public class UserSettings
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public bool EmailNotifications { get; set; } = true;

        public bool SmsNotifications { get; set; } = true;

        public bool PromotionalOffers { get; set; } = false;

        public bool TwoFactorEnabled { get; set; } = false;

        public bool BiometricsEnabled { get; set; } = false;
    }
}