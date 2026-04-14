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

// ============ STORAGE HELPERS ============

// Registered users stored in localStorage: { id, email, password, name, role }[]
interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
}

function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('bygame_registered_users');
  return data ? JSON.parse(data) : [];
}

function saveRegisteredUsers(users: RegisteredUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bygame_registered_users', JSON.stringify(users));
}

// Global data persistence (all users combined)
function loadGlobalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function saveGlobalData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Per-user data persistence
function loadUserData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function saveUserData(key: string, data: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============ SEED DATA ============

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

// Load initial data from localStorage
const initialPurchases = loadGlobalData<Purchase[]>('bygame_purchases', seedPurchases);
const initialReviews = loadGlobalData<Review[]>('bygame_reviews', seedReviews);
const initialMessages = loadGlobalData<Message[]>('bygame_messages', []);
const initialRedeemRequests = loadGlobalData<RedeemRequest[]>('bygame_redeem_requests', []);

// Try to restore last session
let initialUser: User | null = null;
let initialLoggedIn = false;
if (typeof window !== 'undefined') {
  const lastSession = localStorage.getItem('bygame_last_session');
  if (lastSession) {
    try {
      const session = JSON.parse(lastSession);
      const users = getRegisteredUsers();
      const matched = users.find((u) => u.id === session.userId);
      if (matched) {
        const balance = loadUserData<number>(`bygame_balance_${matched.email}`, 0);
        initialUser = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          avatar: matched.role === 'admin' ? '👑' : '🎮',
          balance,
          role: matched.role,
        };
        initialLoggedIn = true;
      }
    } catch {
      localStorage.removeItem('bygame_last_session');
    }
  }
}

export const useStore = create<AppState>((set, get) => ({
  // ---- USER ----
  user: initialUser,
  isLoggedIn: initialLoggedIn,

  login: (email: string, password: string) => {
    if (!email || !password || password.length < 3) return false;
    if (typeof window === 'undefined') return false;

    // Check admin special access
    const isAdmin = email.toLowerCase().includes('admin');
    if (isAdmin && password === 'admin123') {
      const users = getRegisteredUsers();
      let adminUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      let adminId: string;

      if (!adminUser) {
        // Auto-register admin if not exists
        adminId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        adminUser = { id: adminId, email, password, name: 'Admin BYgame', role: 'admin' };
        users.push(adminUser);
        saveRegisteredUsers(users);
      } else {
        adminId = adminUser.id;
      }

      const user: User = {
        id: adminId,
        name: adminUser!.name,
        email,
        avatar: '👑',
        balance: loadUserData<number>(`bygame_balance_${email}`, 0),
        role: 'admin',
      };

      localStorage.setItem('bygame_last_session', JSON.stringify({ userId: user.id }));
      set({
        user,
        isLoggedIn: true,
        purchases: initialPurchases,
        reviews: initialReviews,
        messages: initialMessages,
        redeemRequests: initialRedeemRequests,
      });
      return true;
    }

    // Find matching registered user
    const users = getRegisteredUsers();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      return false; // Wrong email or password
    }

    // Use the STABLE ID from registration
    const user: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      avatar: '🎮',
      balance: loadUserData<number>(`bygame_balance_${matchedUser.email}`, 0),
      role: matchedUser.role,
    };

    // Restore all global data + balance
    const savedPurchases = loadGlobalData<Purchase[]>('bygame_purchases', seedPurchases);
    const savedReviews = loadGlobalData<Review[]>('bygame_reviews', seedReviews);
    const savedMessages = loadGlobalData<Message[]>('bygame_messages', []);
    const savedRedeemRequests = loadGlobalData<RedeemRequest[]>('bygame_redeem_requests', []);

    // Save session so we can restore on page refresh
    localStorage.setItem('bygame_last_session', JSON.stringify({ userId: user.id }));

    set({
      user,
      isLoggedIn: true,
      purchases: savedPurchases,
      reviews: savedReviews,
      messages: savedMessages,
      redeemRequests: savedRedeemRequests,
    });
    return true;
  },

  register: (name: string, email: string, password: string) => {
    if (!name || !email || !password || password.length < 3) return false;
    if (typeof window === 'undefined') return false;

    const users = getRegisteredUsers();

    // Check if email already registered
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      return false; // Email already taken
    }

    // Generate a STABLE user ID — saved permanently, never changes
    const stableId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Save new user credentials with stable ID
    users.push({ id: stableId, email, password, name, role: 'user' });
    saveRegisteredUsers(users);

    const user: User = {
      id: stableId,
      name,
      email,
      avatar: '🎮',
      balance: 0,
      role: 'user',
    };

    // Save session
    localStorage.setItem('bygame_last_session', JSON.stringify({ userId: user.id }));

    // Restore all global data
    const savedPurchases = loadGlobalData<Purchase[]>('bygame_purchases', seedPurchases);
    const savedReviews = loadGlobalData<Review[]>('bygame_reviews', seedReviews);
    const savedMessages = loadGlobalData<Message[]>('bygame_messages', []);
    const savedRedeemRequests = loadGlobalData<RedeemRequest[]>('bygame_redeem_requests', []);

    set({
      user,
      isLoggedIn: true,
      purchases: savedPurchases,
      reviews: savedReviews,
      messages: savedMessages,
      redeemRequests: savedRedeemRequests,
    });
    return true;
  },

  logout: () => {
    const { user, purchases, reviews, messages, redeemRequests } = get();

    if (user && typeof window !== 'undefined') {
      // Save all data to localStorage before clearing
      saveGlobalData('bygame_purchases', purchases);
      saveGlobalData('bygame_reviews', reviews);
      saveGlobalData('bygame_messages', messages);
      saveGlobalData('bygame_redeem_requests', redeemRequests);
      saveUserData(`bygame_balance_${user.email}`, user.balance);
      localStorage.removeItem('bygame_last_session');
    }

    set({
      user: null,
      isLoggedIn: false,
      currentPage: 'home',
      // Reset in-memory state to seed data
      purchases: [...seedPurchases],
      reviews: [...seedReviews],
      messages: [],
      redeemRequests: [],
    });
  },

  // ---- NAVIGATION ----
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // ---- PURCHASES ----
  purchases: initialLoggedIn ? initialPurchases : [...seedPurchases],

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
      saveGlobalData('bygame_purchases', purchases);
      return { purchases };
    });

    // Simulate status changes
    setTimeout(() => {
      const state = get();
      const updated = state.purchases.map((p) =>
        p.id === newPurchase.id ? { ...p, status: 'processing' as const } : p
      );
      saveGlobalData('bygame_purchases', updated);
      set({ purchases: updated });
    }, 3000);

    setTimeout(() => {
      const state = get();
      const updated = state.purchases.map((p) =>
        p.id === newPurchase.id ? { ...p, status: 'success' as const } : p
      );
      saveGlobalData('bygame_purchases', updated);
      set({ purchases: updated });
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
    set((state) => {
      const purchases = state.purchases.map((p) =>
        p.id === purchaseId ? { ...p, status } : p
      );
      saveGlobalData('bygame_purchases', purchases);
      return { purchases };
    });
  },

  getUserPurchases: () => {
    const { purchases, user } = get();
    if (!user) return [];
    return purchases.filter((p) => p.userId === user.id);
  },

  // ---- REVIEWS ----
  reviews: initialLoggedIn ? initialReviews : [...seedReviews],

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

    const updatedReviews = [...reviews, newReview];
    const updatedPurchases = purchases.map((p) =>
      p.id === purchaseId ? { ...p, reviewed: true } : p
    );

    saveGlobalData('bygame_reviews', updatedReviews);
    saveGlobalData('bygame_purchases', updatedPurchases);

    set({
      reviews: updatedReviews,
      purchases: updatedPurchases,
    });

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
  messages: initialLoggedIn ? initialMessages : [],

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const messages = [...state.messages, newMessage];
      saveGlobalData('bygame_messages', messages);
      return { messages };
    });
  },

  markMessageRead: (messageId) => {
    set((state) => {
      const messages = state.messages.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      );
      saveGlobalData('bygame_messages', messages);
      return { messages };
    });
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
  redeemRequests: initialLoggedIn ? initialRedeemRequests : [],

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

    set((state) => {
      const redeemRequests = [...state.redeemRequests, newRequest];
      const updatedUser = { ...state.user!, balance: state.user!.balance - request.itemPrice };
      saveGlobalData('bygame_redeem_requests', redeemRequests);
      saveUserData(`bygame_balance_${state.user!.email}`, updatedUser.balance);
      return { redeemRequests, user: updatedUser };
    });

    return true;
  },

  adminApproveRedeem: (requestId, approved, note) => {
    const { redeemRequests } = get();
    const request = redeemRequests.find((r) => r.id === requestId);
    if (!request) return;

    set((state) => {
      const redeemRequests = state.redeemRequests.map((r) =>
        r.id === requestId
          ? { ...r, status: approved ? 'approved' as const : 'rejected' as const, adminNote: note }
          : r
      );
      saveGlobalData('bygame_redeem_requests', redeemRequests);
      return { redeemRequests };
    });

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
      set((state) => {
        if (!state.user || state.user.id !== request.userId) return state;
        const updatedUser = { ...state.user, balance: state.user.balance + request.itemPrice };
        saveUserData(`bygame_balance_${state.user.email}`, updatedUser.balance);
        return { user: updatedUser };
      });
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
      saveUserData(`bygame_balance_${state.user.email}`, newBalance);
      return { user: updatedUser };
    });
  },
}));
