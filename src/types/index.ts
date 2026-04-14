export interface GameItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

export interface Game {
  id: string;
  name: string;
  category: 'mobile' | 'pc' | 'console';
  image: string;
  description: string;
  tags: string[];
  isPopular: boolean;
  items: GameItem[];
}

export interface TopupOrder {
  orderId: string;
  gameId: string;
  gameName: string;
  itemId: string;
  itemName: string;
  userId: string;
  serverId?: string;
  quantity: number;
  paymentMethod: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  estimatedDelivery: string;
  createdAt: string;
}

export interface PaymentResult {
  paymentUrl: string;
  qrCode: string;
  expiryTime: string;
  status: string;
  orderId: string;
  totalPrice: number;
  paymentMethod: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  gradient: string;
  emoji: string;
}

export type Category = 'all' | 'mobile' | 'pc' | 'console';

export type PaymentMethod = 'gopay' | 'ovo' | 'dana' | 'bank_transfer' | 'qris';
