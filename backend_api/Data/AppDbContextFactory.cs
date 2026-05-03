using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CarMaintenance.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            
            // التعديل هنا: نغير السيرفر لـ Sqlite
            optionsBuilder.UseSqlite("Data Source=CarMaintenance.db");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}