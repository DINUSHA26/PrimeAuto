import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
    FaChartPie,
    FaBox,
    FaCalendarAlt,
    FaUsers,
    FaTools,
    FaSignOutAlt,
    FaCog,
    FaTruck,
    FaUserCircle,
    FaTags,
} from 'react-icons/fa';


const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Define menu items
    const allNavItems = [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: FaChartPie,
            roles: ['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER', 'INVENTORY_STAFF', 'VIEW_ONLY']
        },
        {
            path: '/admin/products',
            label: 'Products',
            icon: FaBox,
            roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF']
        },
        {
            path: '/admin/categories',
            label: 'Categories',
            icon: FaTags,
            roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF']
        },
        {
            path: '/admin/orders',
            label: 'Product Orders',
            icon: FaTruck,
            roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF']
        },
        {
            path: '/admin/services',
            label: 'Services',
            icon: FaTools,
            roles: ['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER']
        },

        {
            path: '/admin/customers',
            label: 'Customers',
            icon: FaUserCircle,
            roles: ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER_MANAGER']
        },
        {
            path: '/admin/bookings',
            label: 'Bookings',
            icon: FaCalendarAlt,
            roles: ['SUPER_ADMIN', 'ADMIN', 'SERVICE_MANAGER']
        },
        {
            path: '/admin/users',
            label: 'Admins & Staff',
            icon: FaUsers,
            roles: ['SUPER_ADMIN']
        },
    ];

    // Filter items based on user role
    const navItems = useMemo(() => {
        if (!user || !user.role) return [];
        return allNavItems.filter(item => item.roles.includes(user.role));
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0 flex flex-col shadow-2xl z-20 font-sans">
            {/* Brand Header */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="font-bold text-lg">P</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">PrimeAuto</h2>
                </div>
                <p className="text-slate-400 text-xs ml-11 font-medium tracking-wider uppercase">Admin Portal</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative mb-5 border ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-500/50 scale-[1.02]'
                                    : 'bg-slate-800/30 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white hover:border-slate-700'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`text-xl transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                    <span className="font-semibold text-base tracking-wide">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute right-3 w-2 h-2 rounded-full bg-white shadow-sm" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-slate-700">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm text-white truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-blue-400 truncate">{user?.role?.replace('_', ' ').toLowerCase()}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/settings')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-all duration-200"
                    >
                        <FaCog /> Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-medium transition-all duration-200 border border-red-500/20"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
