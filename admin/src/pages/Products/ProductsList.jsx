import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const { products, loading, error, deleteProduct, fetchProducts } = useProducts();

  useEffect(() => {
    // If specific filter is present, use it. Otherwise fetch all (handled by hook initially, but we need to handle updates/navigation)
    // Actually hook fetches on mount. If we have params, we should probably refetch.
    // To avoid double fetch on mount, we might need to adjust hook, but let's just refetch for now.
    if (categoryFilter) {
      fetchProducts({ category: categoryFilter });
    } else {
      fetchProducts();
    }
  }, [categoryFilter]);

  const clearFilter = () => {
    setSearchParams({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success('Product deleted successfully');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Products / Spare Parts
            {categoryFilter && (
              <span className="ml-4 text-base font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-flex items-center">
                Category: <span className="font-bold text-gray-800 ml-1 capitalize">{categoryFilter}</span>
                <button onClick={clearFilter} className="ml-2 text-gray-400 hover:text-red-500">
                  <FaTimes />
                </button>
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Total Products: <span className="font-bold text-blue-600">{products ? products.length : 0}</span></p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.partNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.quantity <= product.minStockLevel ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.quantity} {product.quantity <= product.minStockLevel && '(Low)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;