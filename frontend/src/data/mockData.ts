// src/data/mockData.ts

export const stats = {
  users: 1245,
  orders: 532,
  products: 128,
  revenue: 23400,
};

export const monthlyRevenue = {
  labels: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  data: [1200, 1500, 1800, 2100, 2500, 3000, 2800, 3200, 3600, 4200, 4600, 5200],
};

export const salesByCategory = {
  labels: ['CCTV Cameras', 'Dome Cameras', 'Wireless', 'Accessories'],
  data: [4200, 3200, 2500, 1400],
};

export const topProducts = [
  { id: '1', name: 'Pro 4K Dome Camera', sold: 156, revenue: 46794.44 },
  { id: '2', name: 'CCTV Camera Kit', sold: 98, revenue: 48999.02 },
  { id: '3', name: 'Wireless Security Camera', sold: 142, revenue: 28398.58 },
  { id: '4', name: 'Night Vision Camera', sold: 87, revenue: 26100.00 },
  { id: '5', name: 'Smart Doorbell Camera', sold: 76, revenue: 22800.00 },
];

export const lowStockProducts = [
  { id: '1', name: 'CCTV Camera Kit', stock: 8, category: 'CCTV Cameras', threshold: 10 },
  { id: '2', name: 'Wireless Security Camera', stock: 15, category: 'Wireless Cameras', threshold: 20 },
  { id: '3', name: 'Pro HD Monitor', stock: 12, category: 'Accessories', threshold: 25 },
  { id: '4', name: 'PTZ Camera', stock: 5, category: 'CCTV Cameras', threshold: 15 },
  { id: '5', name: 'Camera Mount Bracket', stock: 18, category: 'Accessories', threshold: 30 },
];

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  orders: number;
  totalSpent: number;
  joinedDate: string;
  avatar?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    status: 'active',
    orders: 24,
    totalSpent: 3240.50,
    joinedDate: '2024-01-15',
    phone: '+1 234-567-8901',
    role: 'customer',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    orders: 18,
    totalSpent: 2890.00,
    joinedDate: '2024-02-20',
    phone: '+1 234-567-8902',
    role: 'customer',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    status: 'active',
    orders: 31,
    totalSpent: 4560.75,
    joinedDate: '2024-01-08',
    phone: '+1 234-567-8903',
    role: 'customer',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    status: 'inactive',
    orders: 5,
    totalSpent: 780.25,
    joinedDate: '2024-03-12',
    phone: '+1 234-567-8904',
    role: 'customer',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@example.com',
    status: 'active',
    orders: 42,
    totalSpent: 6125.90,
    joinedDate: '2023-11-22',
    phone: '+1 234-567-8905',
    role: 'customer',
  }

];

export const userStats = {
  totalUsers: 1245,
  activeUsers: 1089,
  inactiveUsers: 156,
  totalRevenue: 234560.75,
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  sales: number;
  subCategory?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  image?: string;
  subCategories?: { name: string }[];
  createdAt: string;
}

// Example categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'CCTV Cameras',
    description: 'Professional surveillance cameras for commercial and residential security',
    productCount: 4,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dome Cameras',
    description: 'Vandal-resistant dome cameras for indoor and outdoor monitoring',
    productCount: 3,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Wireless Cameras',
    description: 'Easy-to-install wireless security cameras with WiFi connectivity',
    productCount: 3,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    createdAt: '2024-02-05'
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Essential accessories including cables, mounts, and power adapters',
    productCount: 2,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    createdAt: '2024-02-10'
  },
];

// Example products
export const products: Product[] = [
  {
    id: '1',
    name: 'Pro 4K Dome Camera',
    description: 'High quality 4K dome camera for indoor use with night vision.',
    price: 299.99,
    stock: 50,
    category: 'Dome Cameras',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=400&fit=crop',
    sales: 120,
  },
  {
    id: '2',
    name: 'Wireless Security Camera',
    description: 'Easy installation wireless camera for outdoor monitoring.',
    price: 199.99,
    stock: 15,
    category: 'Wireless Cameras',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=400&fit=crop',
    sales: 80,
  },
  {
    id: '3',
    name: 'CCTV Camera Kit',
    description: 'Complete kit with 4 cameras and DVR.',
    price: 499.99,
    stock: 8,
    category: 'CCTV Cameras',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&h=400&fit=crop',
    sales: 45,
  },
  {
    id: '4',
    name: 'Camera Power Adapter',
    description: 'Reliable power adapter for your cameras.',
    price: 29.99,
    stock: 100,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=400&fit=crop',
    sales: 300,
  },
  {
    id: '5',
    name: 'HD PTZ Camera',
    description: 'Pan-Tilt-Zoom camera with 360° coverage and 20x optical zoom.',
    price: 449.99,
    stock: 25,
    category: 'CCTV Cameras',
    image: 'https://images.unsplash.com/photo-1557597774-9d546a79c0b6?w=500&h=400&fit=crop',
    sales: 65,
  },
  {
    id: '6',
    name: 'Indoor Dome Camera',
    description: 'Compact dome camera perfect for retail and office spaces.',
    price: 159.99,
    stock: 42,
    category: 'Dome Cameras',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=400&fit=crop&sat=-10',
    sales: 110,
  },
  {
    id: '7',
    name: 'Smart Doorbell Camera',
    description: 'WiFi doorbell camera with two-way audio and motion detection.',
    price: 179.99,
    stock: 18,
    category: 'Wireless Cameras',
    image: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=500&h=400&fit=crop',
    sales: 95,
  },
  {
    id: '8',
    name: 'CCTV Cable 100ft',
    description: 'High quality coaxial cable for CCTV installations.',
    price: 39.99,
    stock: 150,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=400&fit=crop',
    sales: 200,
  },
  {
    id: '9',
    name: 'Night Vision Camera',
    description: 'Advanced infrared camera for complete darkness monitoring.',
    price: 329.99,
    stock: 5,
    category: 'CCTV Cameras',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&h=400&fit=crop&brightness=-10',
    sales: 55,
  },
  {
    id: '10',
    name: 'Vandal-Proof Dome',
    description: 'Heavy-duty dome camera with anti-vandalism protection.',
    price: 389.99,
    stock: 12,
    category: 'Dome Cameras',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=400&fit=crop&contrast=10',
    sales: 42,
  },
  {
    id: '11',
    name: 'WiFi Battery Camera',
    description: 'Rechargeable wireless camera with 6-month battery life.',
    price: 149.99,
    stock: 35,
    category: 'Wireless Cameras',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=400&fit=crop&hue=10',
    sales: 88,
  },
  {
    id: '12',
    name: 'Camera Mount Bracket',
    description: 'Universal mounting bracket for all camera types.',
    price: 19.99,
    stock: 200,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=400&fit=crop',
    sales: 350,
  },
];

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  amount: number;
  // status: 'pending' | 'processing' | 'completed' | 'delivered' | 'cancelled';
  status: 'completed' | 'delivered';
  items: {
    id: string;
    productName: string;
    category: string;
    quantity: number;
    price: number;
  }[];
}

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    orderDate: '2024-12-10',
    amount: 899.97,
    status: 'delivered',
    items: [
      { id: '1', productName: 'Pro 4K Dome Camera', category: 'Dome Cameras', quantity: 2, price: 299.99 },
      { id: '2', productName: 'Pro HD Monitor', category: 'Accessories', quantity: 1, price: 299.99 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    orderDate: '2024-12-11',
    amount: 649.97,
    status: 'completed',
    items: [
      { id: '1', productName: 'Wireless Security Camera', category: 'Wireless Cameras', quantity: 2, price: 199.99 },
      { id: '2', productName: 'Camera Mount Bracket', category: 'Accessories', quantity: 5, price: 19.99 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@example.com',
    orderDate: '2024-12-11',
    amount: 999.98,
    status: 'completed',
    items: [
      { id: '1', productName: 'CCTV Camera Kit', category: 'CCTV Cameras', quantity: 2, price: 499.99 }
    ]
  },
  {
    id: 'ORD-004',
    customerName: 'Emily Brown',
    customerEmail: 'emily.brown@example.com',
    orderDate: '2024-12-12',
    amount: 1349.95,
    status: 'delivered',
    items: [
      { id: '1', productName: 'HD PTZ Camera', category: 'CCTV Cameras', quantity: 3, price: 449.99 }
    ]
  },
  {
    id: 'ORD-005',
    customerName: 'David Wilson',
    customerEmail: 'david.w@example.com',
    orderDate: '2024-12-12',
    amount: 539.97,
    status: 'completed',
    items: [
      { id: '1', productName: 'Smart Doorbell Camera', category: 'Wireless Cameras', quantity: 2, price: 179.99 },
      { id: '2', productName: 'Wireless Security Camera', category: 'Wireless Cameras', quantity: 1, price: 199.99 }
    ]
  },
  {
    id: 'ORD-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@example.com',
    orderDate: '2024-12-13',
    amount: 329.99,
    status: 'completed',
    items: [
      { id: '1', productName: 'Night Vision Camera', category: 'CCTV Cameras', quantity: 1, price: 329.99 }
    ]
  },
  {
    id: 'ORD-007',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@example.com',
    orderDate: '2024-12-13',
    amount: 1169.94,
    status: 'delivered',
    items: [
      { id: '1', productName: 'Vandal-Proof Dome', category: 'Dome Cameras', quantity: 3, price: 389.99 }
    ]
  },
  {
    id: 'ORD-008',
    customerName: 'Jennifer Martinez',
    customerEmail: 'jennifer.m@example.com',
    orderDate: '2024-12-13',
    amount: 899.94,
    status: 'completed',
    items: [
      { id: '1', productName: 'Pro 4K Dome Camera', category: 'Dome Cameras', quantity: 3, price: 299.99 }
    ]
  },
];

export const orderStats = {
  totalOrders: 532,
  pendingOrders: 45,
  completedOrders: 398,
  deliveredOrders: 89,
  totalRevenue: 156789.50,
};

export interface Notification {
  id: string;
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-001 has been placed by John Smith for $899.97',
    time: '2024-12-13T10:30:00',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'product',
    title: 'Low Stock Alert',
    message: 'Night Vision Camera stock is running low (5 units remaining)',
    time: '2024-12-13T09:15:00',
    read: false,
    priority: 'high'
  },

  {
    id: '4',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #ORD-007 has been successfully delivered to Robert Taylor',
    time: '2024-12-12T16:20:00',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Dec 15, 2024 at 2:00 AM',
    time: '2024-12-12T14:00:00',
    read: false,
    priority: 'medium'
  },
  {
    id: '6',
    type: 'product',
    title: 'Product Added',
    message: 'New product "WiFi Battery Camera" has been added to the catalog',
    time: '2024-12-12T11:30:00',
    read: true,
    priority: 'low'
  },
  {
    id: '7',
    type: 'order',
    title: 'Order Cancelled',
    message: 'Order #ORD-009 has been cancelled by customer',
    time: '2024-12-11T17:45:00',
    read: true,
    priority: 'medium'
  },

];

export const notificationStats = {
  total: 8,
  unread: 3,
  high: 2,
  medium: 2,
  low: 4,
};

// Report Data
export const reportData = {
  salesByMonth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [45, 52, 48, 65, 72, 68, 78, 85, 92, 88, 95, 102],
  },
  revenueByMonth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [12500, 14800, 13200, 18500, 21000, 19800, 23400, 26700, 28900, 27500, 31200, 34800],
  },
  topSellingProducts: [
    { name: 'Pro 4K Dome Camera', sales: 156 },
    { name: 'Wireless Security Camera', sales: 142 },
    { name: 'CCTV Camera Kit', sales: 98 },
    { name: 'Indoor Dome Camera', sales: 110 },
    { name: 'Smart Doorbell Camera', sales: 95 },
  ],
  ordersTrendByMonth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [38, 42, 45, 52, 58, 55, 62, 68, 72, 70, 75, 80],
  },
  yearlyStats: {
    totalSales: 1025,
    totalRevenue: 267500,
    totalProducts: 128,
    averageOrderValue: 261.46,
  },
};


