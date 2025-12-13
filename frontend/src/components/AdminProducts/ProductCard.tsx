import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { type Product } from '../../data/mockData';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
      {/* Product Image */}
      <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          alt={product.name} 
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-md"
            title="Edit"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-md"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium shadow-md ${
            product.stock < 10 ? 'bg-red-500' : product.stock < 20 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {product.stock} in stock
        </span>
      </div>

      {/* Product Details */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Sales</p>
            <p className="text-lg font-semibold text-gray-700">{product.sales}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
