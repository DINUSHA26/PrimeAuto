import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import authService from "../../services/authService";
import productService from "../../services/productService";
import bookingService from "../../services/bookingService";
import serviceService from "../../services/serviceService";
import userService from "../../services/userService";
import {
  FaBoxOpen,
  FaTools,
  FaCalendarCheck,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaServer,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEllipsisH
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

// --- Custom Chart Components (Visual Placeholders) ---

const LineChart = ({ color = "#3b82f6" }) => (
  <svg viewBox="0 0 500 150" className="w-full h-full text-gray-300 overflow-visible">
    <defs>
      <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Background Grid */}
    <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

    {/* Smooth Curve Mock Data */}
    <path
      d="M0,120 C50,100 100,140 150,90 C200,40 250,80 300,50 C350,20 400,60 450,30 L500,60 L500,150 L0,150 Z"
      fill={`url(#gradient-${color})`}
    />
    <path
      d="M0,120 C50,100 100,140 150,90 C200,40 250,80 300,50 C350,20 400,60 450,30 L500,60"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const PieChart = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e0e7ff" strokeWidth="20" />
    {/* Segment 1: e.g. 40% */}
    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="30 251" strokeDashoffset="0" />
    {/* Segment 2: e.g. 30% */}
    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-40" />
    {/* Segment 3: e.g. 30% */}
    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="90 251" strokeDashoffset="-100" />
  </svg>
);


const Dashboard = () => {
  // --- State & Logic ---
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    totalBookings: 0,
    totalUsers: 0,
    lowStockCount: 0,
    pendingBookings: 0,
    recentBookings: [],
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    const userData = authService.getCurrentUser();
    setUser(userData);
  };

  const hasPermission = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };

  const calculateRevenue = (bookings) => {
    if (!Array.isArray(bookings)) return 0;
    return bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((acc, curr) => {
        const price = curr.service?.price || 0;
        return acc + price;
      }, 0);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, servicesRes, bookingsRes, usersRes, lowStockRes] = await Promise.all([
        productService.getAllSpareParts().catch(() => ({ data: [] })),
        serviceService.getAllServices().catch(() => ({ data: [] })),
        bookingService.getAllBookings().catch(() => ({ data: [] })),
        userService.getAllUsers().catch(() => ({ data: [] })),
        productService.getLowStockAlerts().catch(() => ({ data: [] })),
      ]);

      const products = productsRes.data || productsRes;
      const services = servicesRes.data || servicesRes;
      const bookings = bookingsRes.data || bookingsRes;
      const users = usersRes.data || usersRes;
      const lowStock = lowStockRes.data || lowStockRes;

      const pending = Array.isArray(bookings)
        ? bookings.filter((b) => b.status === "pending" || b.status === "confirmed")
        : [];

      const recent = Array.isArray(bookings)
        ? bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        : [];

      const totalRevenue = calculateRevenue(bookings);

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalServices: Array.isArray(services) ? services.length : 0,
        totalBookings: Array.isArray(bookings) ? bookings.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        lowStockCount: Array.isArray(lowStock) ? lowStock.length : 0,
        pendingBookings: pending.length,
        recentBookings: recent,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // --- Sub-Components ---

  // Stat Card with Growth Indicator
  const StatCard = ({ title, value, icon: Icon, colorClass, trend, trendValue, subtitle, visible }) => {
    if (visible === false) return null;
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
            <Icon className={`text-xl ${colorClass.replace('bg-', 'text-').replace('-100', '-600')}`} />
            {/* Simplified color logic for demo - specific classes usually best */}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
            {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {trendValue}
          </div>
          <span className="text-xs text-gray-400 font-medium">{subtitle || 'vs last month'}</span>
        </div>
      </div>
    );
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const canViewProducts = hasPermission(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF']);
  const canViewServices = hasPermission(['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER']);
  const canViewBookings = hasPermission(['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER']);

  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <MdDashboard className="text-blue-600" /> Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name || 'Admin'}! Performance summary.</p>
        </div>
        <div className="flex gap-3">
          {/* Date Pill */}
          <div className="hidden md:flex bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm items-center text-sm font-medium text-gray-600">
            <FaCalendarCheck className="text-gray-400 mr-2" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
          </div>
          {canViewProducts && (
            <Link to="/admin/products" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-gray-900/20">
              Manage Inventory
            </Link>
          )}
        </div>
      </header>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={FaDollarSign}
          colorClass="text-emerald-600 bg-emerald-50" // Tailwind v4 dynamic classes might need explicit strings
          trend="up"
          trendValue="12.5%"
          visible={canViewBookings}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={FaCalendarCheck}
          colorClass="text-blue-600 bg-blue-50"
          trend="up"
          trendValue="8.2%"
          subtitle={`${stats.pendingBookings} pending`}
          visible={canViewBookings}
        />
        <StatCard
          title="Active Services"
          value={stats.totalServices}
          icon={FaTools}
          colorClass="text-violet-600 bg-violet-50"
          trend="up"
          trendValue="2.1%"
          visible={canViewServices}
        />
        <StatCard
          title="Low Stock Products"
          value={stats.lowStockCount}
          icon={FaExclamationTriangle}
          colorClass="text-rose-600 bg-rose-50"
          trend={stats.lowStockCount > 0 ? "down" : "up"} // logic inverted (low is bad)
          trendValue="5 items"
          subtitle="Requires attention"
          visible={canViewProducts}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Monthly Revenue</h3>
            <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none text-gray-600">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <LineChart color="#3b82f6" />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Service Distribution</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <PieChart />
            <div className="mt-6 flex flex-col gap-2 w-full text-sm">
              <div className="flex justify-between items-center px-4">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Reparation</span>
                <span className="font-bold text-gray-700">40%</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Maintenance</span>
                <span className="font-bold text-gray-700">30%</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Cleaning</span>
                <span className="font-bold text-gray-700">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Activity & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activities */}
        {canViewBookings && (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="font-bold text-gray-800">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Service</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{booking.service?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'}`}>
                          {booking.status === 'completed' && <FaCheckCircle className="mr-1" size={10} />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600"><FaEllipsisH /></button>
                      </td>
                    </tr>
                  ))}
                  {stats.recentBookings.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-8 text-gray-500">No recent activity</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Health Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6">System Health</h3>
          <div className="space-y-6">
            {/* Server Status */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                  <FaServer /> Server Load
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Healthy</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">28% Used</p>
            </div>

            {/* DB Status */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                  <FaDatabase /> Database Storage
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Optimal</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">45% Used</p>
            </div>

            {/* API Status */}
            <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">API Latency</span>
                <span className="text-sm font-bold text-gray-700">24ms</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Uptime</span>
                <span className="text-sm font-bold text-gray-700">99.98%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
