using Microsoft.EntityFrameworkCore;
using CarMaintenance.Models;

namespace CarMaintenance.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<TestItem> TestItems { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.Property(o => o.OrderStatus)
                      .HasConversion<string>()
                      .HasMaxLength(20);

                entity.Property(o => o.Address)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(o => o.PhoneNumber)
                      .IsRequired()
                      .HasMaxLength(20);
            });
        }
    }
}