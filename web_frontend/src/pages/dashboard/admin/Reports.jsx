import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Activity,
  Star
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import { 
  getReportSummary,
  getRevenueChart,
  getOrdersChart,
  getServicesDistribution,
  getTechniciansPerformance,
  getTopTechnicians,
  getTopServices,
  exportReport
} from '../../../services/adminService';

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState('شهر');
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    revenueGrowthPercentage: 0,
    totalOrders: 0,
    ordersGrowthPercentage: 0,
    averageOrderValue: 0,
    averageOrderGrowthPercentage: 0,
    totalCustomers: 0,
    customersGrowthPercentage: 0,
    newCustomersThisPeriod: 0,
    ordersThisPeriod: 0,
    revenueThisPeriod: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [techPerformanceData, setTechPerformanceData] = useState([]);
  const [topTechnicians, setTopTechnicians] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filterToPeriodMap = {
    'أسبوع': 1,
    'شهر': 2,
    'ربع سنوي': 3,
    'سنة': 4
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const period = filterToPeriodMap[timeFilter] || 2;
        
        const [
          summaryRes,
          revenueRes,
          ordersRes,
          servicesDistRes,
          techPerfRes,
          topTechsRes,
          topServicesRes
        ] = await Promise.all([
          getReportSummary(period),
          getRevenueChart(period),
          getOrdersChart(period),
          getServicesDistribution(period),
          getTechniciansPerformance(period),
          getTopTechnicians(period, 5),
          getTopServices(period, 6)
        ]);

        if (summaryRes.data) setSummaryData(summaryRes.data);
        
        if (revenueRes.data && revenueRes.data.labels) {
          setRevenueData(revenueRes.data.labels.map((label, i) => ({
            name: label,
            value: revenueRes.data.values[i]
          })));
        }

        if (ordersRes.data && ordersRes.data.labels) {
          setOrdersData(ordersRes.data.labels.map((label, i) => ({
            name: label,
            value: ordersRes.data.values[i]
          })));
        }

        if (servicesDistRes.data) {
          const colors = ['#D9B07C', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];
          setServicesData(servicesDistRes.data.map((item, i) => ({
            name: item.serviceName,
            value: item.ordersCount,
            percentage: item.percentage,
            color: colors[i % colors.length]
          })));
        }

        if (techPerfRes.data) {
          setTechPerformanceData(techPerfRes.data.map(item => ({
            name: item.technicianName,
            value: item.completedOrders
          })));
        }

        if (topTechsRes.data) {
          setTopTechnicians(topTechsRes.data.map((item, i) => ({
            id: i,
            name: item.name,
            rating: item.rating,
            orders: item.completedOrders
          })));
        }

        if (topServicesRes.data) {
          const colors = ['bg-[#D9B07C]', 'bg-blue-500', 'bg-slate-400', 'bg-cyan-500', 'bg-red-500', 'bg-purple-500'];
          const maxOrders = Math.max(...topServicesRes.data.map(s => s.ordersCount), 1);
          setTopServices(topServicesRes.data.map((item, i) => ({
            id: item.serviceId || i,
            name: item.serviceName,
            orders: item.ordersCount,
            color: colors[i % colors.length],
            percent: (item.ordersCount / maxOrders) * 100
          })));
        }

      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [timeFilter]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const period = filterToPeriodMap[timeFilter] || 2;
      const response = await exportReport(period, 'excel');
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${timeFilter}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: `${summaryData.totalRevenue.toLocaleString()} جنيه`,
      trend: `${summaryData.revenueGrowthPercentage > 0 ? '+' : ''}${summaryData.revenueGrowthPercentage}%`,
      trendUp: summaryData.revenueGrowthPercentage >= 0,
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'إجمالي الطلبات',
      value: `${summaryData.totalOrders.toLocaleString()}`,
      trend: `${summaryData.ordersGrowthPercentage > 0 ? '+' : ''}${summaryData.ordersGrowthPercentage}%`,
      trendUp: summaryData.ordersGrowthPercentage >= 0,
      icon: ShoppingBag,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'متوسط قيمة الطلب',
      value: `${summaryData.averageOrderValue.toLocaleString()} جنيه`,
      trend: `${summaryData.averageOrderGrowthPercentage > 0 ? '+' : ''}${summaryData.averageOrderGrowthPercentage}%`,
      trendUp: summaryData.averageOrderGrowthPercentage >= 0,
      icon: Activity,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      title: 'عدد العملاء',
      value: `${summaryData.totalCustomers.toLocaleString()}`,
      trend: `${summaryData.customersGrowthPercentage > 0 ? '+' : ''}${summaryData.customersGrowthPercentage}%`,
      trendUp: summaryData.customersGrowthPercentage >= 0,
      icon: Users,
      iconBg: 'bg-[#D9B07C]/10',
      iconColor: 'text-[#D9B07C]',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121212] border border-white/10 p-3 rounded-xl shadow-xl text-right" dir="rtl">
          <p className="text-slate-300 font-bold mb-1">{label}</p>
          <p className="text-[#D9B07C] font-black">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="font-tajawal min-h-screen pb-10">
      <DashboardHeader
        title="التقارير"
        subtitle="متابعة أداء النظام وإحصائياته"
      />

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        
        {/* Actions (Left) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#121212] hover:bg-white/5 border border-white/5 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl">
            <Filter size={18} className="text-slate-400" />
            تصفية
          </button>
          <button onClick={handleExport} disabled={exporting} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1a4b8c] hover:bg-[#153b70] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50">
            <Download size={18} />
            {exporting ? 'جاري التصدير...' : 'تصدير التقرير'}
          </button>
        </div>

        {/* Time Filters (Right) */}
        <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-2xl border border-white/5 shadow-xl w-full md:w-auto overflow-x-auto">
          {['سنة', 'ربع سنوي', 'شهر', 'أسبوع'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                timeFilter === filter 
                  ? 'bg-[#1a4b8c] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Technician Performance Bar Chart */}
        <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-white">أداء الفنيين</h3>
            <button className="text-[#3b82f6] text-sm font-bold hover:underline">عرض التفاصيل</button>
          </div>
          {techPerformanceData.length > 0 ? (
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Tajawal' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 font-bold">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

        {/* Daily Orders Chart */}
        <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-white">الطلبات اليومية</h3>
            <button className="text-[#10b981] text-sm font-bold hover:underline">عرض التفاصيل</button>
          </div>
          {ordersData.length > 0 ? (
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Tajawal' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#121212', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 font-bold">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Services Distribution Pie Chart */}
        <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-white">توزيع الخدمات</h3>
            <button className="text-[#8b5cf6] text-sm font-bold hover:underline">عرض التفاصيل</button>
          </div>
          {servicesData.length > 0 ? (
            <div className="flex-1 flex items-center justify-center relative">
              <div className="h-[250px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={servicesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="rgba(0,0,0,0)"
                    >
                      {servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'Tajawal' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 pl-4" dir="rtl">
                {servicesData.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
                    <span className="text-sm font-bold text-slate-300">{service.name}</span>
                    <span className="text-xs text-slate-500 mr-2">{service.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-500 font-bold flex-1">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-white">الإيرادات الشهرية</h3>
            <button className="text-[#3b82f6] text-sm font-bold hover:underline">عرض التفاصيل</button>
          </div>
          {revenueData.length > 0 ? (
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Tajawal' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 8, fill: '#3b82f6', stroke: '#121212', strokeWidth: 2 }} fill="url(#colorRevenue)" />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 font-bold">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

      </div>

      {/* Row 3: Top Techs & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Requested Services */}
        <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black text-white mb-8">أكثر الخدمات طلباً</h3>
          {topServices.length > 0 ? (
            <div className="space-y-6">
              {topServices.map((service, idx) => (
                <div key={service.id} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">{service.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">{service.orders} طلب</span>
                      <span className="text-xs font-black text-slate-500 w-6 text-center">#{idx + 1}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex justify-end">
                    <div 
                      className={`h-full ${service.color} rounded-full`}
                      style={{ width: `${service.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-slate-500 font-bold">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

        {/* Top Technicians List */}
        <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black text-white mb-8">أفضل الفنيين</h3>
          {topTechnicians.length > 0 ? (
            <div className="space-y-4">
              {topTechnicians.map((tech, idx) => (
                <div key={tech.id} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/5 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0 ? 'bg-amber-500 text-white' :
                    idx === 1 ? 'bg-slate-300 text-slate-800' :
                    idx === 2 ? 'bg-[#D9B07C] text-white' :
                    'bg-white/10 text-slate-400'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <span className="text-sm font-black">{tech.rating}</span>
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{tech.orders} طلب</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-slate-500 font-bold">لا توجد بيانات متاحة لهذه الفترة</div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Reports;
