namespace CarMaintenance.DTOs.Reports
{
    public class DashboardSummaryDto
    {
        public decimal TotalRevenue { get; set; }
        public double RevenueGrowthPercentage { get; set; }

        public int TotalOrders { get; set; }
        public double OrdersGrowthPercentage { get; set; }

        public decimal AverageOrderValue { get; set; }
        public double AverageOrderGrowthPercentage { get; set; }

        public int TotalCustomers { get; set; }
        public double CustomersGrowthPercentage { get; set; }

        public int NewCustomersThisPeriod { get; set; }
        public int OrdersThisPeriod { get; set; }
        public decimal RevenueThisPeriod { get; set; }
    }
}
