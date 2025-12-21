import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import type { IProduct } from '../types';

export default function ProductCard({ product }: { product: IProduct }) {
  const image = product.images?.[0] || '/placeholder.png';

  const discountedPrice = product.discount
    ? Math.round(product.price * (100 - product.discount) / 100)
    : product.price;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}% OFF
            </div>
          )}

        </div>

        {product.sold && product.sold > 100 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <FaFire className="text-xs" />
            Hot
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amber-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              Rs {discountedPrice.toLocaleString()}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                Rs {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock & Sold */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            {product.sold && (
              <span>{product.sold.toLocaleString()} sold</span>
            )}
          </div>
          <div>
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm"
          >
            View Details
          </Link>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}