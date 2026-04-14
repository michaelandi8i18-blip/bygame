import { create } from 'zustand';

// ============ TYPES ============

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  role: 'user' | 'admin';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  gameId: string;
  gameName: string;
  gameImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  gameImage: string;
  itemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  userGameId: string;
  serverId: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  reviewed: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  from: 'admin' | 'system';
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface RedeemRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  gameId: string;
  gameName: string;
  gameImage: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  userGameId: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote: string;
  createdAt: string;
}

export type AppPage = 'home' | 'history' | 'redeem' | 'messages' | 'admin';

// ============ STORE ============

interface AppState {
  // User
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Purchases
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt' | 'reviewed' | 'status'>) => Purchase;
  updatePurchaseStatus: (purchaseId: string, status: Purchase['status']) => void;
  getUserPurchases: () => Purchase[];

  // Reviews
  reviews: Review[];
  addReview: (purchaseId: string, rating: number, comment: string) => boolean;
  getGameReviews: (gameId: string) => Review[];
  getPublicReviews: () => Review[];

  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageRead: (messageId: string) => void;
  getUserMessages: () => Message[];
  getUnreadCount: () => number;

  // Redeem
  redeemRequests: RedeemRequest[];
  addRedeemRequest: (request: Omit<RedeemRequest, 'id' | 'createdAt' | 'status' | 'adminNote'>) => boolean;
  adminApproveRedeem: (requestId: string, approved: boolean, note: string) => void;
  getRedeemRequests: () => RedeemRequest[];
  getUserRedeemRequests: () => RedeemRequest[];

  // Balance
  addBalance: (amount: number) => void;
}

// Seed data
const seedReviews: Review[] = [
  {
    id: 'rev-seed-1',
    userId: 'user-seed-1',
    userName: 'GamerKu',
    userAvatar: '🎮',
    gameId: 'mlbb',
    gameName: 'Mobile Legends: Bang Bang',
    gameImage: '⚔️',
    rating: 5,
    comment: 'Top up cepat banget! Diamond langsung masuk kurang dari 1 menit. Pelayanan terbaik!',
    createdAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'rev-seed-2',
    userId: 'user-seed-2',
    userName: 'ProPlayer',
    userAvatar: '🎯',
    gameId: 'pubgm',
    gameName: 'PUBG Mobile',
    gameImage: '🎯',
    rating: 5,
    comment: 'Harga termurah dibanding toko lain. Udah langganan dari dulu, ga pernah mengecewakan!',
    createdAt: '2026-04-09T14:30:00Z',
  },
  {
    id: 'rev-seed-3',
    userId: 'user-seed-3',
    userName: 'WaifuHunter',
    userAvatar: '🌟',
    gameId: 'genshin-mobile',
    gameName: 'Genshin Impact',
    gameImage: '🌟',
    rating: 4,
    comment: 'Genesis Crystal cepat masuk, tinggal nunggu gacha lucknya hehe. Recommended!',
    createdAt: '2026-04-08T19:15:00Z',
  },
  {
    id: 'rev-seed-4',
    userId: 'user-seed-4',
    userName: 'FPSLegend',
    userAvatar: '🔫',
    gameId: 'valorant',
    gameName: 'Valorant',
    gameImage: '🎯',
    rating: 5,
    comment: 'VP Valorant langsung masuk ke akun. Skins baru langsung bisa dibeli. Top!',
    createdAt: '2026-04-07T11:00:00Z',
  },
  {
    id: 'rev-seed-5',
    userId: 'user-seed-5',
    userName: 'CasualGamer',
    userAvatar: '💎',
    gameId: 'freefire',
    gameName: 'Free Fire',
    gameImage: '🔥',
    rating: 4,
    comment: 'Diamond masuk cepat, kadang ada promo menarik. Mantap BYgame!',
    createdAt: '2026-04-06T16:45:00Z',
  },
];

const seedPurchases: Purchase[] = [
  {
    id: 'BY-10001-ABC',
    userId: 'user-seed-1',
    gameId: 'mlbb',
    gameName: 'Mobile Legends: Bang Bang',
    gameImage: '⚔️',
    itemId: 'mlbb-86',
    itemName: '86 Diamond',
    quantity: 1,
    totalPrice: 25000,
    userGameId: '123456789',
    serverId: '1234',
    paymentMethod: 'gopay',
    status: 'success',
    reviewed: true,
    createdAt: '2026-04-10T08:00:00Z',
  },
];

export const useStore = create<AppState>((set, get) => ({
  // ---- USER ----
  user: null,
  isLoggedIn: false,

  login: (email: string, password: string) => {
    // Simulated login
    if (!email || !password || password.length < 3) return false;

    const isAdmin = email.includes('admin');
    const user: User = {
      id: `user-${Date.now()}`,
      name: isAdmin ? 'Admin BYgame' : email.split('@')[0],
      email,
      avatar: isAdmin ? '👑' : '🎮',
      balance: 0,
      role: isAdmin ? 'admin' : 'user',
    };

    // Check if user has existing data in localStorage
    if (typeof window !== 'undefined') {
      const savedPurchases = localStorage.getItem(`bygame_purchases_${email}`);
      const savedBalance = localStorage.getItem(`bygame_balance_${email}`);

      set({
        user,
        isLoggedIn: true,
        purchases: savedPurchases ? JSON.parse(savedPurchases) : [...seedPurchases],
        ...(savedBalance ? { user: { ...user, balance: parseFloat(savedBalance) } } : {}),
      });
    } else {
      set({ user, isLoggedIn: true, purchases: [...seedPurchases] });
    }

    return true;
  },

  register: (name: string, email: string, password: string) => {
    if (!name || !email || !password || password.length < 3) return false;

    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: '🎮',
      balance: 0,
      role: 'user',
    };

    set({ user, isLoggedIn: true });
    return true;
  },

  logout: () => {
    const { user } = get();
    if (user && typeof window !== 'undefined') {
      localStorage.setItem(`bygame_purchases_${user.email}`, JSON.stringify(get().purchases));
      localStorage.setItem(`bygame_balance_${user.email}`, String(user.balance));
    }
    set({
      user: null,
      isLoggedIn: false,
      currentPage: 'home',
    });
  },

  // ---- NAVIGATION ----
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // ---- PURCHASES ----
  purchases: [...seedPurchases],

  addPurchase: (purchase) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: `BY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'pending',
      reviewed: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const purchases = [...state.purchases, newPurchase];
      if (state.user && typeof window !== 'undefined') {
        localStorage.setItem(`bygame_purchases_${state.user.email}`, JSON.stringify(purchases));
      }
      return { purchases };
    });

    // Simulate status changes
    setTimeout(() => {
      set((state) => ({
        purchases: state.purchases.map((p) =>
          p.id === newPurchase.id ? { ...p, status: 'processing' } : p
        ),
      }));
    }, 3000);

    setTimeout(() => {
      set((state) => ({
        purchases: state.purchases.map((p) =>
          p.id === newPurchase.id ? { ...p, status: 'success' } : p
        ),
      }));
      get().addMessage({
        userId: purchase.userId,
        from: 'system',
        title: 'Top Up Berhasil!',
        content: `Top up ${purchase.itemName} untuk ${purchase.gameName} telah berhasil dikirim ke akun kamu! Terima kasih telah menggunakan BYgame.`,
        type: 'success',
      });
    }, 8000);

    return newPurchase;
  },

  updatePurchaseStatus: (purchaseId, status) => {
    set((state) => ({
      purchases: state.purchases.map((p) =>
        p.id === purchaseId ? { ...p, status } : p
      ),
    }));
  },

  getUserPurchases: () => {
    const { purchases, user } = get();
    if (!user) return [];
    return purchases.filter((p) => p.userId === user.id);
  },

  // ---- REVIEWS ----
  reviews: [...seedReviews],

  addReview: (purchaseId, rating, comment) => {
    const { user, purchases, reviews } = get();
    if (!user) return false;

    const purchase = purchases.find((p) => p.id === purchaseId);
    if (!purchase || purchase.reviewed) return false;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      gameId: purchase.gameId,
      gameName: purchase.gameName,
      gameImage: purchase.gameImage,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      reviews: [...state.reviews, newReview],
      purchases: state.purchases.map((p) =>
        p.id === purchaseId ? { ...p, reviewed: true } : p
      ),
    }));

    // Add 100 IDR bonus balance
    get().addBalance(100);

    get().addMessage({
      userId: user.id,
      from: 'system',
      title: 'Review Berhasil! +Rp 100 Saldo Bonus',
      content: `Terima kasih atas review kamu! Kamu mendapatkan saldo bonus Rp 100. Gunakan saldo untuk redeem item di menu Redeem.`,
      type: 'info',
    });

    return true;
  },

  getGameReviews: (gameId) => {
    return get().reviews.filter((r) => r.gameId === gameId);
  },

  getPublicReviews: () => {
    return get().reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // ---- MESSAGES ----
  messages: [],

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  markMessageRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      ),
    }));
  },

  getUserMessages: () => {
    const { messages, user } = get();
    if (!user) return [];
    return messages
      .filter((m) => m.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: () => {
    const { messages, user } = get();
    if (!user) return 0;
    return messages.filter((m) => m.userId === user.id && !m.isRead).length;
  },

  // ---- REDEEM ----
  redeemRequests: [],

  addRedeemRequest: (request) => {
    const { user } = get();
    if (!user) return false;
    if (user.balance < request.itemPrice) return false;

    const newRequest: RedeemRequest = {
      ...request,
      id: `rdm-${Date.now()}`,
      status: 'pending',
      adminNote: '',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      redeemRequests: [...state.redeemRequests, newRequest],
      user: { ...state.user!, balance: state.user!.balance - request.itemPrice },
    }));

    return true;
  },

  adminApproveRedeem: (requestId, approved, note) => {
    const { redeemRequests } = get();
    const request = redeemRequests.find((r) => r.id === requestId);
    if (!request) return;

    set((state) => ({
      redeemRequests: state.redeemRequests.map((r) =>
        r.id === requestId
          ? { ...r, status: approved ? 'approved' : 'rejected', adminNote: note }
          : r
      ),
    }));

    get().addMessage({
      userId: request.userId,
      from: 'admin',
      title: approved ? 'Permintaan Redeem Disetujui!' : 'Permintaan Redeem Ditolak',
      content: approved
        ? `Permintaan redeem ${request.itemName} untuk game ${request.gameName} telah disetujui! Item akan segera dikirim ke akun game kamu. Catatan admin: ${note || '-'}`
        : `Maaf, permintaan redeem ${request.itemName} untuk game ${request.gameName} ditolak. Alasan: ${note || 'Tidak memenuhi syarat.'}. Saldo telah dikembalikan.`,
      type: approved ? 'success' : 'error',
    });

    // If rejected, refund balance
    if (!approved) {
      set((state) => ({
        user: state.user && state.user.id === request.userId
          ? { ...state.user, balance: state.user.balance + request.itemPrice }
          : state.user,
      }));
    }
  },

  getRedeemRequests: () => {
    return get().redeemRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUserRedeemRequests: () => {
    const { redeemRequests, user } = get();
    if (!user) return [];
    return redeemRequests.filter((r) => r.userId === user.id);
  },

  // ---- BALANCE ----
  addBalance: (amount) => {
    set((state) => {
      if (!state.user) return state;
      const newBalance = state.user.balance + amount;
      const updatedUser = { ...state.user, balance: newBalance };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bygame_balance_${state.user.email}`, String(newBalance));
      }
      return { user: updatedUser };
    });
  },
}));
