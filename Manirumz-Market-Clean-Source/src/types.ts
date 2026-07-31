export type Role = 'admin' | 'seller' | 'customer';

export type Language = 'en' | 'ha';

export type Category = 
  | 'electronics' 
  | 'fashion' 
  | 'phones' 
  | 'automotive' 
  | 'groceries' 
  | 'services' 
  | 'art';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  piUsername?: string;
  piWalletAddress?: string;
  language: Language;
  storeName?: string;
  storeStatus?: 'approved' | 'pending' | 'rejected';
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  titleHa: string;
  description: string;
  descriptionHa: string;
  pricePi: number;
  priceUsd: number;
  category: Category;
  stock: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'pi_network' | 'card' | 'crypto' | 'bank_transfer';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  items: CartItem[];
  totalPi: number;
  totalUsd: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  piPaymentId?: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  sellerId: string;
  sellerName: string;
  storeName: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  logoUrl?: string;
  totalSalesPi: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PiUser {
  accessToken: string;
  uid: string;
  username: string;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval?: (paymentId: string) => void;
  onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
  onCancel?: (paymentId: string) => void;
  onError?: (error: Error, payment?: any) => void;
}
