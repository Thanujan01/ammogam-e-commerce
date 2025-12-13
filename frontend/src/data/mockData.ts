// src/data/mockData.ts

export const stats = {
  users: 1245,
  orders: 532,
  products: 128,
  revenue: 23400,
};

export const monthlyRevenue = {
  labels: [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ],
  data: [1200, 1500, 1800, 2100, 2500, 3000, 2800, 3200, 3600, 4200, 4600, 5200],
};

export const salesByCategory = {
  labels: ['CCTV Cameras','Dome Cameras','Wireless','Accessories'],
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
}

export interface Category {
  id: string;
  name: string;
}

// Example categories
export const categories: Category[] = [
  { id: '1', name: 'CCTV Cameras' },
  { id: '2', name: 'Dome Cameras' },
  { id: '3', name: 'Wireless Cameras' },
  { id: '4', name: 'Accessories' },
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
    image: '/placeholder.svg', 
    sales: 120,
  },
  {
    id: '2',
    name: 'Wireless Security Camera',
    description: 'Easy installation wireless camera for outdoor monitoring.',
    price: 199.99,
    stock: 15,
    category: 'Wireless Cameras',
    image: '/placeholder.svg',
    sales: 80,
  },
  {
    id: '3',
    name: 'CCTV Camera Kit',
    description: 'Complete kit with 4 cameras and DVR.',
    price: 499.99,
    stock: 8,
    category: 'CCTV Cameras',
    image: '/placeholder.svg',
    sales: 45,
  },
  {
    id: '4',
    name: 'Camera Power Adapter',
    description: 'Reliable power adapter for your cameras.',
    price: 29.99,
    stock: 100,
    category: 'Accessories',
    image: '/placeholder.svg',
    sales: 300,
  },
  {
    id: '5',
    name: 'HD PTZ Camera',
    description: 'Pan-Tilt-Zoom camera with 360° coverage and 20x optical zoom.',
    price: 449.99,
    stock: 25,
    category: 'CCTV Cameras',
    image: '/placeholder.svg',
    sales: 65,
  },
  {
    id: '6',
    name: 'Indoor Dome Camera',
    description: 'Compact dome camera perfect for retail and office spaces.',
    price: 159.99,
    stock: 42,
    category: 'Dome Cameras',
    image: '/placeholder.svg',
    sales: 110,
  },
  {
    id: '7',
    name: 'Smart Doorbell Camera',
    description: 'WiFi doorbell camera with two-way audio and motion detection.',
    price: 179.99,
    stock: 18,
    category: 'Wireless Cameras',
    image: '/placeholder.svg',
    sales: 95,
  },
  {
    id: '8',
    name: 'CCTV Cable 100ft',
    description: 'High quality coaxial cable for CCTV installations.',
    price: 39.99,
    stock: 150,
    category: 'Accessories',
    image: '/placeholder.svg',
    sales: 200,
  },
  {
    id: '9',
    name: 'Night Vision Camera',
    description: 'Advanced infrared camera for complete darkness monitoring.',
    price: 329.99,
    stock: 5,
    category: 'CCTV Cameras',
    image: '/placeholder.svg',
    sales: 55,
  },
  {
    id: '10',
    name: 'Vandal-Proof Dome',
    description: 'Heavy-duty dome camera with anti-vandalism protection.',
    price: 389.99,
    stock: 12,
    category: 'Dome Cameras',
    image: '/placeholder.svg',
    sales: 42,
  },
  {
    id: '11',
    name: 'WiFi Battery Camera',
    description: 'Rechargeable wireless camera with 6-month battery life.',
    price: 149.99,
    stock: 35,
    category: 'Wireless Cameras',
    image: '/placeholder.svg',
    sales: 88,
  },
  {
    id: '12',
    name: 'Camera Mount Bracket',
    description: 'Universal mounting bracket for all camera types.',
    price: 19.99,
    stock: 200,
    category: 'Accessories',
    image: '/placeholder.svg',
    sales: 350,
  },
];





