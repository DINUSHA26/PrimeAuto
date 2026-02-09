
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { getImageUrl } from '../../services/api';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">
            <FaShoppingCart />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Part Number Badge */}
        {product.partNumber && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            {product.partNumber}
          </span>
        )}

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Category */}
        {product.category && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mb-3 capitalize">
            {product.category}
          </span>
        )}

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.quantity > 0 ? (
            <span className="text-green-600 text-sm font-semibold">
              {product.quantity} in Stock
            </span>
          ) : (
            <span className="text-red-600 text-sm font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Low Stock Warning */}
        {product.quantity > 0 && product.quantity <= product.minStockLevel && (
          <div className="mb-3">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Low Stock
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <FaEye />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;