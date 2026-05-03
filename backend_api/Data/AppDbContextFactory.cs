using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CarMaintenance.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            optionsBuilder.UseNpgsql(
                "Host=ep-late-tooth-alwxtxke-pooler.c-3.eu-central-1.aws.neon.tech;" +
                "Database=CarMa-DB;" +
                "Username=neondb_owner;" +
                "Password=npg_9kDOBGRdHb6C;" +
                "SSL Mode=Require;Trust Server Certificate=true"
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}