# Color Variants Feature

## Overview
Added the ability for admins and sellers to add multiple color variants to a single product (e.g., a dress in Red, Blue, Black).

## Features

### 1. **Color Variant Management**
Each color variant includes:
- **Color Name** (e.g., "Red", "Blue", "Black")
- **Color Code** (Hex color picker: #FF0000)
- **Stock Quantity** (Separate stock for each color)
- **Variant Image** (Optional - different image for each color)

### 2. **User Interface**

#### Adding Color Variants
1. When adding/editing a product, click **"Add Color Variants"** button
2. Fill in details for each color:
   - Enter color name
   - Pick color code using color picker or enter hex code
   - Set stock quantity for that color
   - Optionally upload an image specific to that color variant
3. Click **"Add Another Color"** to add more colors
4. Remove any color using the trash icon

#### Viewing Color Variants
- Product cards now display color circles at the bottom
- Hover over color circles to see:
  - Color name
  - Stock quantity for that color
- First 5 colors are shown, with "+N" indicator for additional colors

### 3. **Data Structure**

```typescript
interface ColorVariant {
  colorName: string;      // "Red"
  colorCode: string;      // "#FF0000"
  stock: number;          // 25
  image?: string;         // Optional image URL
}
```

Products include:
```typescript
{
  name: "Summer Dress",
  price: 49.99,
  stock: 100,  // Total stock (can be sum of all variants)
  colorVariants: [
    { colorName: "Red", colorCode: "#FF0000", stock: 25, image: "..." },
    { colorName: "Blue", colorCode: "#0000FF", stock: 35, image: "..." },
    { colorName: "Black", colorCode: "#000000", stock: 40, image: "..." }
  ]
}
```

## Updated Components

### Frontend Files Modified:
1. **ProductDialog.tsx** - Main form with color variants section
2. **AdminProducts.tsx** - Admin product management with color support
3. **SellerProducts.tsx** - Seller product management with color support
4. **ProductCard.tsx** - Display color variants visually
5. **types/index.d.ts** - Added `ColorVariant` interface

## Usage Examples

### Example 1: Adding a Dress with 3 Colors
```
Product: Summer Floral Dress
Price: $49.99
Base Stock: 100

Color Variants:
1. Red (#FF0000) - 30 units - image: red-dress.jpg
2. Blue (#0066CC) - 40 units - image: blue-dress.jpg  
3. White (#FFFFFF) - 30 units - image: white-dress.jpg
```

### Example 2: Adding a T-Shirt with 5 Colors
```
Product: Classic Cotton T-Shirt
Price: $19.99
Base Stock: 200

Color Variants:
1. Black (#000000) - 50 units
2. White (#FFFFFF) - 50 units
3. Navy (#001F3F) - 40 units
4. Gray (#808080) - 35 units
5. Red (#FF4136) - 25 units
```

## Benefits

✅ Better inventory management per color
✅ Visual representation of available colors
✅ Individual stock tracking for each variant
✅ Optional color-specific images
✅ Enhanced user experience
✅ Professional e-commerce functionality

## Next Steps (Backend Integration Needed)

To fully integrate this feature, you'll need to:

1. **Update Product Model** (backend/src/models/Product.js):
```javascript
colorVariants: [{
  colorName: String,
  colorCode: String,
  stock: Number,
  image: String
}]
```

2. **Update Product Controller** to save/retrieve color variants

3. **Update Order Processing** to:
   - Deduct stock from specific color variant
   - Track which color was ordered

4. **Frontend Display** (optional future enhancement):
   - Show color selector on product detail pages
   - Update cart to show selected color
   - Filter products by available colors

## Notes

- Color variants are **optional** - products without colors work as before
- Stock can be managed at product level OR variant level
- Images for variants are optional (falls back to main product image)
- Color picker provides visual selection, manual hex entry also available
