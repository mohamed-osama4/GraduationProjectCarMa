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

        // Tables
        public DbSet<TestItem> TestItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NewNotification> NewNotifications { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ================= ORDER CONFIG =================
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.Property(o => o.Address)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(o => o.PhoneNumber)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.Property(o => o.Price)
                      .HasColumnType("decimal(18,2)");

                entity.Property(o => o.OrderStatus)
                      .HasConversion<string>()
                      .HasMaxLength(20);

                // Relation: Order -> Notifications (1 to many)
                entity.HasMany(o => o.Notifications)
                      .WithOne(n => n.Order)
                      .HasForeignKey(n => n.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
                      //Service
            });
            modelBuilder.Entity<Service>().HasData(
    new Service { Id = 1, Name = "Oil Change", Price = 300 },
    new Service { Id = 2, Name = "Battery Change", Price = 500 },
    new Service { Id = 3, Name = "Tire Service", Price = 250 }
);

            // ================= USER CONFIG =================
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ================= NOTIFICATION CONFIG =================
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.Id);

                entity.Property(n => n.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(n => n.Description)
                      .HasMaxLength(1000);

                entity.Property(n => n.Type)
                      .HasMaxLength(50);
            });

            // ================= NEW NOTIFICATION CONFIG =================
            modelBuilder.Entity<NewNotification>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Title)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Message)
                    .HasMaxLength(1000)
                    .IsRequired();

                entity.Property(x => x.Type)
                    .HasConversion<int>()
                    .IsRequired();

                entity.Property(x => x.Severity)
                    .HasConversion<int>()
                    .IsRequired();

                entity.Property(x => x.ActionUrl)
                    .HasMaxLength(500);

                entity.Property(x => x.PrimaryActionLabel)
                    .HasMaxLength(100);

                entity.Property(x => x.PrimaryActionUrl)
                    .HasMaxLength(500);

                entity.Property(x => x.SecondaryActionLabel)
                    .HasMaxLength(100);

                entity.Property(x => x.SecondaryActionUrl)
                    .HasMaxLength(500);

                entity.Property(x => x.TargetType)
                    .HasMaxLength(100);

                entity.Property(x => x.MetadataJson)
                    .HasColumnType("jsonb");

                entity.Property(x => x.CreatedAt)
                    .IsRequired();

                entity.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => new { x.UserId, x.IsDeleted, x.CreatedAt });
                entity.HasIndex(x => new { x.UserId, x.IsRead });
                entity.HasIndex(x => x.Type);
            });
        }
    }
}