import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { FaBoxes, FaTags, FaExclamationTriangle, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoriesList = () => {
    const [stats, setStats] = useState(null);
    const [createdCategories, setCreatedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, categoriesRes] = await Promise.all([
                productService.getInventoryStats(),
                productService.getCategories()
            ]);
            setStats(statsRes.data);
            setCreatedCategories(categoriesRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setSubmitting(true);
        try {
            await productService.createCategory({ name: newCategoryName });
            toast.success('Category created successfully');
            setNewCategoryName('');
            setShowModal(false);
            fetchData(); // Refresh list
        } catch (error) {
            toast.error(error.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold">Loading categories...</p>
            </div>
        );
    }

    if (!stats) return null;

    // Merge categories from products (stats) and manually created ones
    // stats.categoryCounts = [{ _id: 'engine', count: 5 }]
    // createdCategories = [{ name: 'engine', ... }, { name: 'brandnew', ... }]

    const categoryMap = new Map();

    // Add stats first
    stats.categoryCounts.forEach(cat => {
        categoryMap.set(cat._id.toLowerCase(), {
            name: cat._id.toLowerCase(),
            count: cat.count,
            source: 'product'
        });
    });

    // Add/Merge created categories
    createdCategories.forEach(cat => {
        const key = cat.name.toLowerCase();
        if (categoryMap.has(key)) {
            // Already exists from products, just mark it as also existing in DB if needed (not strictly needed for display)
        } else {
            categoryMap.set(key, {
                name: key,
                count: 0,
                source: 'manual'
            });
        }
    });

    const allCategories = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="p-6 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Product Categories</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of inventory distribution</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                    <span>+</span> Add Category
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                        <FaBoxes />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Products</p>
                        <p className="text-2xl font-black text-slate-800">{stats.totalParts}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                        <FaTags />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active Categories</p>
                        <p className="text-2xl font-black text-slate-800">{allCategories.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 text-xl">
                        <FaExclamationTriangle />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
                        <p className="text-2xl font-black text-slate-800">{stats.lowStockCount}</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">Inventory by Category</h2>
            {allCategories.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center">
                    <FaBoxOpen className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No categories found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allCategories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                            className="bg-white p-6 rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 hover:shadow-lg transition-all group cursor-pointer block"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${cat.count === 0 ? 'bg-gray-100 text-gray-400' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                 `}>
                                    <FaTags />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${cat.count === 0 ? 'bg-gray-100 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
                                    {cat.count} items
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 capitalize mb-1">{cat.name}</h3>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{ width: `${stats.totalParts > 0 ? Math.min((cat.count / stats.totalParts) * 100, 100) : 0}%` }}
                                ></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Add Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                        <form onSubmit={handleCreateCategory}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. Tires"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesList;
