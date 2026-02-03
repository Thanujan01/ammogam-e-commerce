// pages/CartPage.tsx
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaShoppingCart, FaCreditCard,
  FaLock, FaUser, FaHome, FaChevronRight,
  FaTimes, FaExclamationTriangle,
} from 'react-icons/fa';

export default function CartPage() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  // Use selectedItems from CartContext
  const selectedItems = cart.selectedItems;
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<{
    type: 'selected' | 'item' | 'clear';
    item?: any;
    selectedCount?: number;
  } | null>(null);

  // ✅ FIX: Scroll to top when component mounts or updates
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    // Also handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ✅ FIXED: Get variation image - use selectedImageIndex if available
  const getItemImage = (item: any) => {
    // If we have a selected image index, use it
    if (item.selectedImageIndex !== undefined && item.selectedImageIndex !== null) {
      // If product has variations and we have a variation ID
      if (item.product.variations && item.variationId && item.product.variations.length > 0) {
        const variation = item.product.variations.find((v: any) => v._id === item.variationId);
        if (variation && variation.images && variation.images.length > 0) {
          // Use the selected image index, fallback to 0 if out of bounds
          const index = Math.min(item.selectedImageIndex, variation.images.length - 1);
          return variation.images[index];
        }
        if (variation && variation.image) {
          return variation.image;
        }
      }
    }

    // If no selected image index or variation not found, use the old logic
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation && variation.images && variation.images.length > 0) {
        return variation.images[0];
      }
      if (variation && variation.image) {
        return variation.image;
      }
    }

    // If product has variations but no specific variation selected
    if (item.product.variations && item.product.variations.length > 0) {
      const firstVariation = item.product.variations[0];
      if (firstVariation.images && firstVariation.images.length > 0) {
        return firstVariation.images[0];
      }
      if (firstVariation.image) {
        return firstVariation.image;
      }
    }

    // Fall back to main product image
    return item.product.image;
  };

  // ✅ FIX: Get variation color name
  const getItemColorName = (item: any) => {
    if (item.selectedColor) return item.selectedColor;

    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation) {
        return variation.colorName || variation.color;
      }
    }

    return '';
  };

  // ✅ FIX: Get variation color code
  const getItemColorCode = (item: any) => {
    if (item.selectedColorCode) return item.selectedColorCode;

    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation) {
        return variation.colorCode;
      }
    }

    return '#000000';
  };

  const getAddonPrice = (item: any) => {
    if (!item.variationId || (!item.selectedSize && !item.selectedWeight)) return 0;
    const variation = item.product.variations?.find((v: any) => v._id === item.variationId);
    if (!variation) return 0;

    if (item.selectedSize) {
      return variation.sizes?.find((s: any) => s.size === item.selectedSize)?.price || 0;
    }
    if (item.selectedWeight) {
      return variation.weights?.find((w: any) => w.weight === item.selectedWeight)?.price || 0;
    }
    return 0;
  };

  // Use getItemKey from CartContext
  const getItemKey = cart.getItemKey;
  // Use selectedCartItems from CartContext
  const selectedCartItems = cart.selectedCartItems;

  // Use selected totals from CartContext
  const subtotal = cart.selectedTotalAmount;
  const itemCount = cart.selectedItemsCount;
  const shipping = cart.selectedShippingFee;
  const total = subtotal + shipping;

  // Group items by seller
  const groupedItems = cart.items.reduce((groups: any, item: any) => {
    const sellerId = item.product.seller?._id || 'admin';
    const sellerName = item.product.seller?.businessName || 'Ammogam Official Store';

    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerName,
        items: []
      };
    }
    groups[sellerId].items.push(item);
    return groups;
  }, {});

  const toggleSelectAll = () => {
    cart.toggleSelectAll();
  };

  const toggleSelectSeller = (sellerId: string) => {
    const sellerItems = groupedItems[sellerId].items;
    const sellerItemKeys = sellerItems.map(getItemKey);
    const allSelected = sellerItemKeys.every((key: string) => selectedItems.has(key));

    const newSelected = new Set(selectedItems);
    if (allSelected) {
      sellerItemKeys.forEach((key: string) => newSelected.delete(key));
    } else {
      sellerItemKeys.forEach((key: string) => newSelected.add(key));
    }
    cart.updateSelectedItems(newSelected);
  };

  const toggleSelectItem = (item: any) => {
    cart.toggleSelectItem(item);
  };

  const handleQuantityUpdate = (productId: string, newQty: number, variationId?: string, selectedSize?: string, selectedWeight?: string) => {
    cart.updateQty(productId, newQty, variationId, selectedSize, selectedWeight);
  };

  // Show delete confirmation modal
  const confirmDelete = (type: 'selected' | 'item' | 'clear', item?: any) => {
    if (type === 'selected' && selectedItems.size === 0) return;

    setDeleteAction({
      type,
      item,
      selectedCount: selectedItems.size
    });
    setShowDeleteModal(true);
  };

  // Execute delete after confirmation
  const executeDelete = () => {
    if (!deleteAction) return;

    switch (deleteAction.type) {
      case 'selected':
        selectedItems.forEach((key) => {
          const item = cart.items.find((i: any) => getItemKey(i) === key);
          if (item) {
            cart.removeFromCart(item.product._id, item.variationId, item.selectedSize, item.selectedWeight);
          }
        });
        break;

      case 'item':
        if (deleteAction.item) {
          cart.removeFromCart(deleteAction.item.product._id, deleteAction.item.variationId, deleteAction.item.selectedSize, deleteAction.item.selectedWeight);
        }
        break;

      case 'clear':
        cart.clearCart();
        break;
    }

    setShowDeleteModal(false);
    setDeleteAction(null);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 300);
  };

  // Close modal without action
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteAction(null);
  };

  const handleNavigate = (path: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => navigate(path), 100);
  };

  const handleContinueShopping = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/products'), 100);
  };

  const handleProductNavigation = (productId: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => navigate(`/products/${productId}`), 100);
  };

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d97706]/5 to-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-[#d97706]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[#d97706] to-[#b45309] rounded-lg shadow-md">
                <FaShoppingCart className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500">
                  {cart.items.length === 0
                    ? 'Your cart is currently empty'
                    : `${itemCount} items in your cart`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleContinueShopping}
                className="px-6 py-2.5 border border-[#d97706]/30 text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaArrowLeft className="text-sm" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scaleIn overflow-hidden">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                {deleteAction.type === 'selected' && (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                      <FaTrash className="text-red-500 text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Delete {deleteAction.selectedCount} item{deleteAction.selectedCount !== 1 ? 's' : ''}?
                    </h4>
                    <p className="text-gray-600">
                      Are you sure you want to delete {deleteAction.selectedCount} selected item{deleteAction.selectedCount !== 1 ? 's' : ''} from your cart?
                    </p>
                  </div>
                )}

                {deleteAction.type === 'item' && deleteAction.item && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={getImageUrl(getItemImage(deleteAction.item))}
                        alt={deleteAction.item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      Remove "{deleteAction.item.product.name}"?
                    </h4>
                    <p className="text-gray-600">
                      This item will be removed from your shopping cart.
                    </p>
                    {getItemColorName(deleteAction.item) && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: getItemColorCode(deleteAction.item) }}
                        />
                        <span>Color: {getItemColorName(deleteAction.item)}</span>
                      </div>
                    )}
                  </div>
                )}

                {deleteAction.type === 'clear' && (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="text-red-500 text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Clear Entire Cart?
                    </h4>
                    <p className="text-gray-600">
                      This will remove all items from your shopping cart. This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {cart.items.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d97706]/20">
                <FaShoppingCart className="text-4xl text-[#d97706]/60" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Browse our premium selection and add items to your cart to get started with your order.
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3.5 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center gap-3 mx-auto shadow-md"
              >
                <FaShoppingCart />
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:w-2/3 space-y-8">
              {/* Selection Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cart.items.length && cart.items.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-[#d97706] border-gray-300 rounded focus:ring-[#d97706] cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 uppercase">
                    SELECT ALL ({cart.items.length} ITEM{cart.items.length !== 1 ? 'S' : ''})
                  </span>
                </div>
                <button
                  onClick={() => confirmDelete('selected')}
                  disabled={selectedItems.size === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedItems.size > 0
                    ? 'text-red-600 hover:bg-red-50 border border-red-200 hover:shadow-sm'
                    : 'text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                >
                  <FaTrash className="text-sm" />
                  DELETE {selectedItems.size > 0 ? `(${selectedItems.size})` : ''}
                </button>
              </div>

              {/* Cart Items Grouped by Seller */}
              {Object.entries(groupedItems).map(([sellerId, group]: [string, any]) => (
                <div key={sellerId} className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden mb-8">
                  {/* Seller Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={group.items.every((item: any) => selectedItems.has(getItemKey(item)))}
                      onChange={() => toggleSelectSeller(sellerId)}
                      className="w-5 h-5 text-[#d97706] border-gray-300 rounded focus:ring-[#d97706] cursor-pointer"
                    />
                    <div className="p-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
                      <FaHome className="text-[#d97706] text-sm" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{group.sellerName}</span>
                    <FaChevronRight className="text-gray-400 text-sm" />
                  </div>

                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border-b border-[#d97706]/20">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">
                      <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Product</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Price</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Quantity</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Total</span>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-[#d97706]/10">
                    {group.items.map((it: any) => {
                      const itemImage = getItemImage(it);
                      const itemColorName = getItemColorName(it);
                      const itemColorCode = getItemColorCode(it);

                      return (
                        <div key={getItemKey(it)} className="p-6 hover:bg-[#d97706]/5 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            {/* Checkbox */}
                            <div className="md:col-span-1 flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.has(getItemKey(it))}
                                onChange={() => toggleSelectItem(it)}
                                className="w-5 h-5 text-[#d97706] border-gray-300 rounded focus:ring-[#d97706] cursor-pointer"
                              />
                            </div>
                            {/* Product Info */}
                            <div className="col-span-5 flex items-center gap-6">
                              <div
                                onClick={() => handleProductNavigation(it.product._id)}
                                className="w-24 h-24 bg-[#d97706]/5 rounded-xl border border-[#d97706]/20 overflow-hidden flex items-center justify-center p-3 cursor-pointer hover:shadow-md transition-shadow"
                              >
                                <img
                                  src={getImageUrl(itemImage)}
                                  alt={it.product.name}
                                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3
                                  onClick={() => handleProductNavigation(it.product._id)}
                                  className="font-bold text-gray-900 mb-2 hover:text-[#d97706] cursor-pointer transition-colors"
                                >
                                  {it.product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{it.product.description}</p>
                                {/* Display selected color if available */}
                                {itemColorName && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-gray-500">Color:</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                      <div
                                        className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                        style={{ backgroundColor: itemColorCode }}
                                      />
                                      <span className="text-xs font-medium text-gray-700">{itemColorName}</span>
                                    </div>
                                  </div>
                                )}
                                {/* Display selected size/weight if available */}
                                {(it.selectedSize || it.selectedWeight) && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-gray-500">{it.selectedSize ? 'Size:' : 'Weight:'}</span>
                                    <div className="bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 flex items-center gap-1">
                                      <span className="text-xs font-medium text-indigo-700">{it.selectedSize || it.selectedWeight}</span>
                                      {getAddonPrice(it) > 0 && (
                                        <span className="text-[10px] text-indigo-500 opacity-80">(+${getAddonPrice(it)})</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <button
                                  onClick={() => confirmDelete('item', it)}
                                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                                >
                                  <FaTrash className="text-xs" />
                                  Remove Item
                                </button>
                              </div>
                            </div>

                            {/* Price (Desktop) */}
                            <div className="hidden md:block col-span-2 text-center">
                              <div className="text-lg font-bold text-gray-900">
                                ${((it.product.discount && it.product.discount > 0) ? Math.round((it.price || it.product.price) * (1 - it.product.discount / 100)) : (it.price || it.product.price)).toLocaleString()}
                              </div>
                              {it.product.discount > 0 && (
                                <div className="text-xs text-gray-400 line-through">
                                  ${(it.price || it.product.price).toLocaleString()}
                                </div>
                              )}
                              <div className="text-sm text-[#d97706]">per unit</div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center border border-[#d97706] rounded-lg">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityUpdate(it.product._id, Math.max(1, it.quantity - 1), it.variationId, it.selectedSize, it.selectedWeight);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-[#d97706] hover:bg-[#d97706]/10 rounded-l-lg transition-colors"
                                  >
                                    <FaMinus className="text-sm" />
                                  </button>
                                  <div className="w-12 h-10 flex items-center justify-center border-x border-[#d97706] bg-white font-medium text-[#d97706]">
                                    {it.quantity}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityUpdate(it.product._id, it.quantity + 1, it.variationId, it.selectedSize, it.selectedWeight);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-[#d97706] hover:bg-[#d97706]/10 rounded-r-lg transition-colors"
                                  >
                                    <FaPlus className="text-sm" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="col-span-2 text-right">
                              <div className="text-xl font-bold text-gray-900 mb-1">
                                ${(((it.product.discount && it.product.discount > 0) ? Math.round((it.price || it.product.price) * (1 - it.product.discount / 100)) : (it.price || it.product.price)) * it.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-[#d97706]">
                                ${((it.product.discount && it.product.discount > 0) ? Math.round((it.price || it.product.price) * (1 - it.product.discount / 100)) : (it.price || it.product.price)).toLocaleString()} × {it.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 sticky top-6">
                {/* Order Summary Header */}
                <div className="px-6 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <FaShoppingCart className="text-[#d97706]" />
                    Order Summary
                  </h3>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-6">
                  {/* Items List Preview */}
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {selectedCartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No items selected</p>
                        <p className="text-gray-400 text-xs mt-1">Select items to see order summary</p>
                      </div>
                    ) : (
                      selectedCartItems.map((it: any) => {
                        const itemImage = getItemImage(it);
                        const itemColorName = getItemColorName(it);
                        const itemColorCode = getItemColorCode(it);

                        return (
                          <div key={getItemKey(it)} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#d97706]/5 rounded-lg border border-[#d97706]/20 overflow-hidden flex-shrink-0">
                              <img
                                src={getImageUrl(itemImage)}
                                alt={it.product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{it.product.name}</p>
                              {itemColorName && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: itemColorCode }}
                                  />
                                  <span className="text-xs text-gray-500">{itemColorName}</span>
                                </div>
                              )}
                              {(it.selectedSize || it.selectedWeight) && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-xs text-indigo-500 font-medium">
                                    {it.selectedSize ? `Size: ${it.selectedSize}` : `Weight: ${it.selectedWeight}`}
                                  </span>
                                </div>
                              )}
                              <p className="text-xs text-[#d97706]">Qty: {it.quantity}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${(((it.product.discount && it.product.discount > 0) ? Math.round((it.price || it.product.price) * (1 - it.product.discount / 100)) : (it.price || it.product.price)) * it.quantity).toLocaleString()}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between relative group">
                      <span className="text-gray-600 border-b border-dotted border-gray-400 cursor-help">Shipping</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {shipping === 0 ? '$0' : `$${shipping.toLocaleString()}`}
                      </span>

                      {/* Shipping Calculation Breakdown Tooltip/Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#d97706]/20 p-4 z-20 hidden group-hover:block transition-all">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-[#d97706]/10 pb-2">
                          Shipping Breakdown
                        </h4>
                        <div className="space-y-2">
                          {Array.from(new Set(cart.items.map((it: any) => it.product._id))).map((productId: any) => {
                            const item = cart.items.find((it: any) => it.product._id === productId)!;
                            const fee = (item.product.shippingFee || 0);
                            return (
                              <div key={productId} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 truncate max-w-[140px]">{item.product.name}</span>
                                <span className={'text-gray-900 font-medium'}>
                                  ${fee.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                          <div className="pt-2 mt-2 border-t border-[#d97706]/10">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                              <span>Total Shipping</span>
                              <span>${shipping.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#d97706]/10 text-[10px] text-gray-400 text-center">
                          * Charged once per unique product
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-[#d97706]/20 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-4">
                    {auth.loading ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-lg font-medium bg-gray-100 text-gray-400 flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                        Checking Auth...
                      </button>
                    ) : !auth.user ? (
                      <button
                        onClick={() => handleNavigate('/login?redirect=/cart')}
                        disabled={selectedCartItems.length === 0}
                        className={`w-full py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md ${selectedCartItems.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white hover:shadow-lg hover:shadow-[#d97706]/20'
                          }`}
                      >
                        <FaUser />
                        Sign In to Checkout
                      </button>
                    ) : (
                      <button
                        onClick={handleCheckout}
                        disabled={selectedCartItems.length === 0}
                        className={`w-full py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md ${selectedCartItems.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white hover:shadow-lg hover:shadow-[#d97706]/20'
                          }`}
                      >
                        <FaCreditCard />
                        Proceed to Checkout {selectedCartItems.length > 0 && `(${selectedCartItems.length})`}
                      </button>
                    )}
                    <button
                      onClick={handleContinueShopping}
                      className="w-full border border-[#d97706] text-[#d97706] py-3.5 rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-6 border-t border-[#d97706]/20">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 bg-[#d97706]/10 rounded-lg">
                        <FaLock className="text-[#d97706]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                        <p className="text-xs text-[#d97706]">Your payment information is protected</p>
                      </div>
                    </div>
                  </div>

                  {/* Clear Cart Button */}
                  <div className="text-center pt-4">
                    <button
                      onClick={() => confirmDelete('clear')}
                      className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FaTrash />
                      Clear Shopping Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}