import { FiEdit, FiTrash2 } from 'react-icons/fi';
import type { IProduct } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
      {/* Product Image */}
      <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl(product.image || '')}
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
            onClick={() => onDelete(product.id || product._id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-md"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium shadow-md ${product.stock < 10 ? 'bg-red-500' : product.stock < 20 ? 'bg-yellow-500' : 'bg-green-500'
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
            {product.seller?.businessName && (
              <p className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1">
                <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 italic">
                  Sold by: {product.seller.businessName}
                </span>
              </p>
            )}
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

        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
            {product.category}
          </span>
          {product.mainSubcategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
              {product.mainSubcategory}
            </span>
          )}
          {product.subCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700">
              {product.subCategory}
            </span>
          )}
        </div>

        {/* Color Variants Display */}
        {product.colorVariants && product.colorVariants.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Available Colors ({product.colorVariants.length})</p>
            <div className="flex flex-wrap gap-2">
              {product.colorVariants.slice(0, 5).map((variant: any, idx: number) => (
                <div
                  key={idx}
                  className="group/color relative"
                  title={`${variant.colorName} - ${variant.stock} in stock`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary1 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    style={{ backgroundColor: variant.colorCode }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {variant.colorName} ({variant.stock})
                  </div>
                </div>
              ))}
              {product.colorVariants.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{product.colorVariants.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
