import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BannerPi } from './components/BannerPi';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { SellerDashboard } from './components/dashboards/SellerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ApkPwaBanner } from './components/ApkPwaBanner';
import { Footer } from './components/Footer';
import { getTranslation } from './i18n/translations';
import { initPiSdk } from './lib/piSdk';
import { Flame, Layers, Search, Bell } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    searchQuery, 
    language, 
    activeModal, 
    role,
    notifications
  } = useApp();

  useEffect(() => {
    initPiSdk(true);
  }, []);

  // Filter products by search & category
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const titleToSearch = (language === 'ha' && p.titleHa ? p.titleHa : p.title).toLowerCase();
    const descToSearch = (language === 'ha' && p.descriptionHa ? p.descriptionHa : p.description).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || titleToSearch.includes(query) || descToSearch.includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white transition-colors">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ApkPwaBanner />

          {/* Active Toast Notification */}
          {notifications.length > 0 && (
            <div className="my-3 p-3.5 rounded-2xl bg-zinc-900 border border-[#FF6321]/40 text-[#FF6321] text-xs font-black uppercase tracking-wider flex items-center gap-3 shadow-lg">
              <Bell className="w-4 h-4 shrink-0 animate-bounce text-[#FF6321]" />
              <span className="truncate">{notifications[0]}</span>
            </div>
          )}

          {/* Render Dashboard if activeModal === 'dashboard', else Main Marketplace View */}
          {activeModal === 'dashboard' ? (
            <div className="my-6">
              {role === 'admin' && <AdminDashboard />}
              {role === 'seller' && <SellerDashboard />}
              {role === 'customer' && <CustomerDashboard />}
            </div>
          ) : (
            <>
              <BannerPi />
              <CategoryBar />

              {/* Products Section Header */}
              <div className="flex items-center justify-between my-8 border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-[#FF6321]" />
                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                    {selectedCategory === 'all' 
                      ? <>FEATURED <span className="text-[#FF6321]">DROPS</span></>
                      : `${selectedCategory.toUpperCase()} DROPS`}
                  </h2>
                </div>

                <span className="text-xs font-black text-[#FF6321] font-mono bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full uppercase tracking-wider">
                  {filteredProducts.length} LISTINGS
                </span>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-zinc-950 rounded-3xl border border-zinc-900 my-8">
                  <Search className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">No products match your search</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">Try selecting another category or clear search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {/* Global Modals */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
