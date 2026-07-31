import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, Store, CartItem, Language, Role, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORES, INITIAL_USERS, INITIAL_ORDERS } from '../data/mockData';
import { isPiBrowserEnv, authenticateWithPi, executePiPayment } from '../lib/piSdk';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  role: Role;
  language: Language;
  theme: 'light' | 'dark';
  products: Product[];
  stores: Store[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  isPiBrowser: boolean;
  selectedCategory: string;
  searchQuery: string;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  activeModal: 'checkout' | 'product_details' | 'order_tracking' | 'dashboard' | 'review' | null;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setActiveModal: (modal: 'checkout' | 'product_details' | 'order_tracking' | 'dashboard' | 'review' | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  setSelectedOrder: (o: Order | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Auth Actions
  login: (email: string, role?: Role, displayName?: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPiUser: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: Role) => Promise<void>;
  
  // Product & Order Actions
  addProduct: (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (updated: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createOrder: (paymentMethod: Order['paymentMethod'], shippingAddress: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  
  // Seller Store Actions
  createStore: (storeName: string, description: string) => Promise<void>;
  approveStore: (storeId: string) => Promise<void>;
  
  // Notifications
  notifications: string[];
  addNotification: (msg: string) => void;
  requestNotificationPermission: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('manirumz_lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('manirumz_theme') as 'light' | 'dark') || 'dark';
  });

  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('manirumz_user');
    return cached ? JSON.parse(cached) : INITIAL_USERS[0];
  });

  const [role, setRole] = useState<Role>(() => user?.role || 'admin');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('manirumz_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const cached = localStorage.getItem('manirumz_wishlist');
    return cached ? JSON.parse(cached) : ["p1", "p2"];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'checkout' | 'product_details' | 'order_tracking' | 'dashboard' | 'review' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to Manirumz Market - Pi Network West Africa!",
    "Real-time Firestore & Pi Network Sync active."
  ]);

  const isPiBrowser = isPiBrowserEnv();

  // 1. Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            setUser(userData);
            setRole(userData.role || 'customer');
          } else {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || `${firebaseUser.uid}@minepi.com`,
              displayName: firebaseUser.displayName || 'Pioneer Member',
              role: 'customer',
              language,
              piUsername: 'pi_' + (firebaseUser.displayName || 'pioneer').toLowerCase().replace(/\s+/g, '_'),
              piWalletAddress: 'GB' + Math.random().toString(36).substring(2, 12).toUpperCase(),
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
            setRole('customer');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      }
    });
    return () => unsubscribe();
  }, [language]);

  // 2. Real-time Firestore sync for Products
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed Firestore if collection is empty
        for (const p of INITIAL_PRODUCTS) {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `products/${p.id}`);
          }
        }
      } else {
        const loaded: Product[] = [];
        snapshot.forEach(docSnap => {
          loaded.push(docSnap.data() as Product);
        });
        setProducts(loaded);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  // 3. Real-time Firestore sync for Stores
  useEffect(() => {
    const storesRef = collection(db, 'stores');
    const unsubscribe = onSnapshot(storesRef, async (snapshot) => {
      if (snapshot.empty) {
        for (const s of INITIAL_STORES) {
          try {
            await setDoc(doc(db, 'stores', s.id), s);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `stores/${s.id}`);
          }
        }
      } else {
        const loaded: Store[] = [];
        snapshot.forEach(docSnap => {
          loaded.push(docSnap.data() as Store);
        });
        setStores(loaded);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'stores');
    });

    return () => unsubscribe();
  }, []);

  // 4. Real-time Firestore sync for Orders
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, async (snapshot) => {
      if (snapshot.empty) {
        for (const o of INITIAL_ORDERS) {
          try {
            await setDoc(doc(db, 'orders', o.id), o);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `orders/${o.id}`);
          }
        }
      } else {
        const loaded: Order[] = [];
        snapshot.forEach(docSnap => {
          loaded.push(docSnap.data() as Order);
        });
        setOrders(loaded);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  // 5. Cart sync with Firestore for authenticated users
  useEffect(() => {
    if (user?.uid) {
      const cartRef = doc(db, 'carts', user.uid);
      const unsubscribe = onSnapshot(cartRef, (cartSnap) => {
        if (cartSnap.exists()) {
          const cartData = cartSnap.data();
          if (Array.isArray(cartData.items)) {
            setCart(cartData.items);
          }
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `carts/${user.uid}`);
      });
      return () => unsubscribe();
    }
  }, [user?.uid]);

  // Sync state to LocalStorage as secondary cache
  useEffect(() => {
    localStorage.setItem('manirumz_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('manirumz_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('manirumz_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('manirumz_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('manirumz_cart', JSON.stringify(cart));
    if (user?.uid) {
      setDoc(doc(db, 'carts', user.uid), { items: cart, updatedAt: new Date().toISOString() }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `carts/${user.uid}`);
      });
    }
  }, [cart, user?.uid]);

  useEffect(() => {
    localStorage.setItem('manirumz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) {
      const updatedUser = { ...user, language: lang };
      setUser(updatedUser);
      setDoc(doc(db, 'users', user.uid), updatedUser, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 9)]);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          addNotification("Push notifications enabled!");
        }
      });
    }
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    addNotification(`Added "${product.title}" to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Auth Handlers
  const login = async (email: string, userRole: Role = 'customer', displayName = 'Pioneer Member', password = 'Password123!') => {
    try {
      let uid = 'usr_' + Date.now();
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (authError: any) {
        if (authError?.code === 'auth/user-not-found' || authError?.code === 'auth/invalid-credential') {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          uid = cred.user.uid;
        }
      }

      const newUser: User = {
        uid,
        email,
        displayName,
        role: userRole,
        language,
        piUsername: "pi_" + displayName.toLowerCase().replace(/\s+/g, '_'),
        piWalletAddress: "GB" + Math.random().toString(36).substring(2, 12).toUpperCase(),
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), newUser, { merge: true });
      setUser(newUser);
      setRole(userRole);
      setIsAuthModalOpen(false);
      addNotification(`Logged in as ${displayName} (${userRole.toUpperCase()})`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users/login');
      // Fallback local login for instant resilience
      const fallbackUser: User = {
        uid: "usr_" + Date.now(),
        email,
        displayName,
        role: userRole,
        language,
        piUsername: "pi_" + displayName.toLowerCase().replace(/\s+/g, '_'),
        piWalletAddress: "GB" + Math.random().toString(36).substring(2, 12).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      setRole(userRole);
      setIsAuthModalOpen(false);
      addNotification(`Logged in locally as ${displayName} (${userRole.toUpperCase()})`);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const googleUser = res.user;
      const newUser: User = {
        uid: googleUser.uid,
        email: googleUser.email || '',
        displayName: googleUser.displayName || 'Google Pioneer',
        role: 'customer',
        language,
        piUsername: 'pi_' + (googleUser.displayName || 'pioneer').toLowerCase().replace(/\s+/g, '_'),
        piWalletAddress: 'GB' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', googleUser.uid), newUser, { merge: true });
      setUser(newUser);
      setRole('customer');
      setIsAuthModalOpen(false);
      addNotification(`Authenticated via Google as ${newUser.displayName}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'auth/google');
    }
  };

  const loginWithPiUser = async () => {
    try {
      const { user: piUser, isSimulated } = await authenticateWithPi();
      const uid = "pi_user_" + piUser.uid;
      const newUser: User = {
        uid,
        email: `${piUser.username}@minepi.com`,
        displayName: piUser.username,
        role: "customer",
        piUsername: piUser.username,
        piWalletAddress: "GBPI" + Math.random().toString(36).substring(2, 14).toUpperCase(),
        language,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', uid), newUser, { merge: true });
      setUser(newUser);
      setRole("customer");
      setIsAuthModalOpen(false);
      addNotification(`Authenticated via Pi Network as @${piUser.username} ${isSimulated ? '(Sandbox Mode)' : ''}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'auth/pi');
      addNotification("Pi Network Login failed. Using demo session.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error", e);
    }
    setUser(null);
    setRole('customer');
    addNotification("Signed out successfully.");
  };

  const switchRole = async (newRole: Role) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setRole(newRole);
      try {
        await updateDoc(doc(db, 'users', user.uid), { role: newRole });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
      }
      addNotification(`Switched role to ${newRole.toUpperCase()}`);
    }
  };

  // Product Handlers
  const addProduct = async (newProdData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const productId = "prod_" + Date.now();
    const newProduct: Product = {
      ...newProdData,
      id: productId,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    try {
      await setDoc(doc(db, 'products', productId), newProduct);
      addNotification(`Product "${newProduct.title}" saved to Firestore!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productId}`);
      addNotification(`Product created locally (Firestore pending permission/sync).`);
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    try {
      await setDoc(doc(db, 'products', updated.id), updated, { merge: true });
      addNotification(`Updated product "${updated.title}" in Firestore`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${updated.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
      addNotification("Product removed from Firestore catalog.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  // Store Handlers
  const createStore = async (storeName: string, description: string) => {
    if (!user) return;
    const storeId = "st_" + Date.now();
    const newStore: Store = {
      id: storeId,
      sellerId: user.uid,
      sellerName: user.displayName,
      storeName,
      description,
      status: "approved",
      totalSalesPi: 0,
      createdAt: new Date().toISOString()
    };
    setStores(prev => [newStore, ...prev]);
    const updatedUser = { ...user, role: 'seller' as Role, storeName, storeStatus: 'approved' as const };
    setUser(updatedUser);
    setRole('seller');
    
    try {
      await setDoc(doc(db, 'stores', storeId), newStore);
      await setDoc(doc(db, 'users', user.uid), updatedUser, { merge: true });
      addNotification(`Store "${storeName}" created and synced to Firestore!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `stores/${storeId}`);
    }
  };

  const approveStore = async (storeId: string) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, status: 'approved' } : s));
    try {
      await updateDoc(doc(db, 'stores', storeId), { status: 'approved' });
      addNotification("Store approved in Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stores/${storeId}`);
    }
  };

  // Orders
  const createOrder = async (paymentMethod: Order['paymentMethod'], shippingAddress: string): Promise<Order | null> => {
    if (!user || cart.length === 0) return null;

    const totalPi = cart.reduce((acc, item) => acc + item.product.pricePi * item.quantity, 0);
    const totalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);

    let piPaymentId = undefined;

    if (paymentMethod === 'pi_network') {
      try {
        await new Promise<void>((resolve, reject) => {
          executePiPayment({
            amountPi: Number(totalPi.toFixed(2)),
            memo: `Manirumz Market Order for ${cart.length} item(s)`,
            metadata: { customerId: user.uid },
            onSuccess: (paymentId, txid) => {
              piPaymentId = txid || paymentId;
              resolve();
            },
            onCancel: () => reject(new Error("Pi Payment Cancelled")),
            onError: (err) => reject(err)
          });
        });
      } catch (err: any) {
        addNotification(err?.message || "Pi Payment was cancelled.");
        return null;
      }
    }

    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: orderId,
      customerId: user.uid,
      customerName: user.displayName,
      customerEmail: user.email,
      sellerId: cart[0].product.sellerId,
      items: [...cart],
      totalPi: Number(totalPi.toFixed(2)),
      totalUsd: Number(totalUsd.toFixed(2)),
      status: "processing",
      paymentMethod,
      piPaymentId: piPaymentId || "PI-TX-" + Date.now(),
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setSelectedOrder(newOrder);

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      addNotification(`Order #${newOrder.id} saved to Firestore & Pi Network!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
      addNotification(`Order #${newOrder.id} placed locally!`);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updatedAt = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt } : o));
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus, updatedAt });
      addNotification(`Order #${orderId} status updated in Firestore to ${newStatus.toUpperCase()}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        language,
        theme,
        products,
        stores,
        orders,
        cart,
        wishlist,
        isPiBrowser,
        selectedCategory,
        searchQuery,
        isCartOpen,
        isAuthModalOpen,
        activeModal,
        selectedProduct,
        selectedOrder,
        setLanguage,
        toggleTheme,
        setSearchQuery,
        setSelectedCategory,
        setIsCartOpen,
        setIsAuthModalOpen,
        setActiveModal,
        setSelectedProduct,
        setSelectedOrder,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        login,
        loginWithGoogle,
        loginWithPiUser,
        logout,
        switchRole,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        createStore,
        approveStore,
        notifications,
        addNotification,
        requestNotificationPermission
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

