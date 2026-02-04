import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import dashboardService from "../../services/dashboardService";
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
  FaEllipsisH,
  FaShoppingBag,
  FaCar,
  FaChartPie
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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: { today: 0, month: 0, total: 0 },
    bookings: { total: 0, vehiclesServicedToday: 0 },
    customers: { active: 0 },
    inventory: { lowStock: 0 },
    revenue: { total: 0, products: 0, services: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const hasPermission = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role.toUpperCase());
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // --- Sub-Components ---

  // Stat Card - Redesigned
  const StatCard = ({ title, value, icon: Icon, colorClass, trend, trendValue, subtitle, visible }) => {
    if (visible === false) return null;
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full">
        {/* Header Container */}
        <div className="bg-slate-50/80 border-b border-gray-100 px-4 py-4 relative flex items-center justify-center">
          <h3 className="font-bold text-gray-600 text-sm uppercase tracking-wider text-center">{title}</h3>
          <div className={`absolute right-4 p-2 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon className={`text-lg ${colorClass?.replace('bg-', 'text-').replace('-100', '-600')}`} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[120px]">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight mb-4">{value}</h2>

          {/* Subtitle / Footer */}
          <div className="flex flex-col items-center gap-2 w-full">
            {trend && (
              <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium text-center max-w-full truncate">
                {subtitle}
              </span>
            )}
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">

        {/* Total Orders */}
        <StatCard
          title="Total Orders"
          value={stats.orders.total}
          icon={FaShoppingBag}
          colorClass="text-blue-600 bg-blue-50"
          subtitle={`${stats.orders.today} today / ${stats.orders.month} this month`}
          visible={hasPermission(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'])}
        />

        {/* Total Bookings */}
        <StatCard
          title="Total Service Bookings"
          value={stats.bookings.total}
          icon={FaCalendarCheck}
          colorClass="text-indigo-600 bg-indigo-50"
          subtitle="Lifetime appointments"
          visible={hasPermission(['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER'])}
        />

        {/* Active Customers */}
        <StatCard
          title="Active Customers"
          value={stats.customers.active}
          icon={FaUsers}
          colorClass="text-violet-600 bg-violet-50"
          subtitle="Registered & Active"
          visible={hasPermission(['SUPER_ADMIN', 'ADMIN'])}
        />

        {/* Service Revenue */}
        <StatCard
          title="Service Revenue"
          value={`$${stats.revenue.services.toLocaleString()}`}
          icon={FaDollarSign}
          colorClass="text-emerald-600 bg-emerald-50"
          trend="up"
          trendValue="Bookings"
          subtitle="Generated from Services"
          visible={hasPermission(['SUPER_ADMIN'])}
        />

        {/* Vehicles Serviced Today */}
        <StatCard
          title="Vehicles Serviced Today"
          value={stats.bookings.vehiclesServicedToday}
          icon={FaCar} // Using FaCar or FaTools
          colorClass="text-cyan-600 bg-cyan-50"
          subtitle="Completed or In Progress"
          visible={hasPermission(['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER'])}
        />

        {/* Low Stock */}
        <StatCard
          title="Low Stock Products"
          value={stats.inventory.lowStock}
          icon={FaExclamationTriangle}
          colorClass="text-rose-600 bg-rose-50"
          subtitle="Requires attention"
          visible={hasPermission(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'])}
        />

      </div>


    </div>
  );
};

export default Dashboard;
