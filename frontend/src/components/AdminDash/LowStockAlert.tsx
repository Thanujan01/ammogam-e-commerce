import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  category: string;
  threshold: number;
}

interface Props {
  products: LowStockItem[];
}

export default function LowStockAlert({ products }: Props) {
  const criticalCount = products.filter(p => p.stock < 10).length;
  const warningCount = products.filter(p => p.stock >= 10 && p.stock < 20).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
            <p className="text-xs text-gray-500">{products.length} products need attention</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-600 font-medium mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
          <p className="text-xs text-red-500 mt-1">&lt; 10 units</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <p className="text-xs text-yellow-600 font-medium mb-1">Warning</p>
          <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
          <p className="text-xs text-yellow-500 mt-1">&lt; 20 units</p>
        </div>
      </div> */}

      {/* Product List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <Package className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Stock</p>
                <p
                  className={`text-sm font-bold ${
                    product.stock < 10
                      ? 'text-red-600'
                      : product.stock < 20
                      ? 'text-yellow-600'
                      : 'text-gray-900'
                  }`}
                >
                  {product.stock}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock < 10
                    ? 'bg-red-500'
                    : product.stock < 20
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

     
      
    </div>
  );
}
