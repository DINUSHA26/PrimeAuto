// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    // Optional: add a small animation or toast here
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 h-full flex flex-col">
      {/* Product Image */}
      <div className="h-56 bg-gray-50 flex items-center justify-center overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="text-gray-300 text-5xl">
            <FaShoppingCart />
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/products/${product._id}`}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="View Details"
          >
            <FaEye />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 disabled:bg-gray-400 disabled:translate-y-0"
            title="Add to Cart"
          >
            <FaPlus />
          </button>
        </div>

        {/* Badge */}
        {product.quantity <= product.minStockLevel && product.quantity > 0 && (
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            Low Stock
          </span>
        )}
        {product.quantity <= 0 && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] bg-blue-50 text-blue-600 font-black px-2 py-1 rounded-md uppercase tracking-widest">
            {product.category || 'Spare Part'}
          </span>
          <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex gap-2 border-t border-gray-50">
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="flex-grow bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:active:scale-100 flex items-center justify-center gap-2 text-sm"
          >
            <FaShoppingCart size={14} />
            {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProductCard;