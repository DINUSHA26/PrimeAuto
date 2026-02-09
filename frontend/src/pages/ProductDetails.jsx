// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { getImageUrl } from '../services/api';
import PageHeader from '../components/PageHeader';
import Button from '../components/primary/Button';
import { FaArrowLeft, FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        console.log('Product details:', data);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <PageHeader title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-600">{error || 'Product not found.'}</p>
          <div className="text-center mt-4">
            <Link to="/products" className="text-blue-600 hover:underline">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={product.name} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <FaShoppingCart className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Part Number */}
            {product.partNumber && (
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                  Part #: {product.partNumber}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-4xl font-bold text-blue-600 mb-4 text-gradient">
              ${product.price ? product.price.toFixed(2) : '0.00'}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.quantity > 0 ? (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  <FaCheck />
                  In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                  <FaTimes />
                  Out of Stock
                </span>
              )}

              {/* Low Stock Warning */}
              {product.quantity > 0 && product.quantity <= product.minStockLevel && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Low Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Specifications</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Part Number:</span>
                  <span className="font-semibold">{product.partNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="font-semibold">{product.warranty || 'Standard'}</span>
                </div>
                {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
                  <div>
                    <span className="text-gray-600">Compatible Vehicles:</span>
                    <div className="mt-2 text-gradient font-bold overflow-hidden">
                      {product.compatibleVehicles.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="primary"
                disabled={product.quantity === 0}
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link to="/booking" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Book Installation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProductDetails;
