using CarMaintenance.Models.Enums;

namespace CarMaintenance.Common
{
    public class DateRange
    {
        public DateTime StartDateUtc { get; set; }
        public DateTime EndDateUtc { get; set; }
    }

    public static class DateRangeHelper
    {
        public static DateRange GetRange(ReportPeriod period)
        {
            var now = DateTime.UtcNow;
            var start = now;
            var end = now;

            switch (period)
            {
                case ReportPeriod.Week:
                    // Start of current week (Monday)
                    int diff = (7 + (now.DayOfWeek - DayOfWeek.Monday)) % 7;
                    start = now.AddDays(-1 * diff).Date;
                    end = now;
                    break;

                case ReportPeriod.Month:
                    start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                    end = now;
                    break;

                case ReportPeriod.Quarter:
                    int quarter = (now.Month - 1) / 3 + 1;
                    start = new DateTime(now.Year, (quarter - 1) * 3 + 1, 1, 0, 0, 0, DateTimeKind.Utc);
                    end = now;
                    break;

                case ReportPeriod.Year:
                    start = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                    end = now;
                    break;
            }

            return new DateRange { StartDateUtc = start, EndDateUtc = end };
        }

        public static DateRange GetPreviousRange(ReportPeriod period)
        {
            var currentRange = GetRange(period);
            var start = currentRange.StartDateUtc;
            var end = currentRange.EndDateUtc;

            switch (period)
            {
                case ReportPeriod.Week:
                    start = start.AddDays(-7);
                    end = currentRange.StartDateUtc.AddSeconds(-1);
                    break;

                case ReportPeriod.Month:
                    start = start.AddMonths(-1);
                    end = currentRange.StartDateUtc.AddSeconds(-1);
                    break;

                case ReportPeriod.Quarter:
                    start = start.AddMonths(-3);
                    end = currentRange.StartDateUtc.AddSeconds(-1);
                    break;

                case ReportPeriod.Year:
                    start = start.AddYears(-1);
                    end = currentRange.StartDateUtc.AddSeconds(-1);
                    break;
            }

            return new DateRange { StartDateUtc = start, EndDateUtc = end };
        }
    }
}
