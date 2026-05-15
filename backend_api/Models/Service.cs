using System.Text.Json.Serialization;

namespace CarMaintenance.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        [JsonIgnore]
        public ICollection<Workshop> Workshops { get; set; } = new List<Workshop>();
    }
}