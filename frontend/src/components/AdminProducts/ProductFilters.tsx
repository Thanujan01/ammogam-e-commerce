import { FiSearch, FiFilter, FiPackage } from 'react-icons/fi';
import type { ICategory } from '../../types';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
  categories: ICategory[];
  filteredCount: number;
  totalCount: number;
  onReset: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  categories,
  filteredCount,
  totalCount,
  onReset,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filter Products</h2>
          <span className="text-sm text-gray-500">
            Showing {filteredCount} of {totalCount} products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-white appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="relative">
            <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all bg-white appearance-none"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (&lt; 20)</option>
              <option value="medium">Medium Stock (20-49)</option>
              <option value="high">High Stock (≥ 50)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="px-4 py-2.5 border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-600 rounded-lg font-medium transition-all text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
