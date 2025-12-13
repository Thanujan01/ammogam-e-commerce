import { FiPackage, FiFilter } from 'react-icons/fi';

interface ProductStatsProps {
  totalProducts: number;
  lowStockCount: number;
  categoriesCount: number;
  totalValue: number;
}

export default function ProductStats({ totalProducts, lowStockCount, categoriesCount, totalValue }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Low Stock Alert</p>
            <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FiFilter className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <p className="text-2xl font-bold text-gray-900">{categoriesCount}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FiFilter className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Inventory Value</p>
            <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(0)}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-green-600">$</span>
          </div>
        </div>
      </div>
    </div>
  );
}
