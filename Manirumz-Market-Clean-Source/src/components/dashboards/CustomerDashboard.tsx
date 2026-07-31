import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../i18n/translations';
import { User, Package, Heart, Coins, Store, MapPin, Clock, Truck } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, orders, wishlist, products, language, setSelectedOrder, setActiveModal, createStore } = useApp();
  const [storeNameInput, setStoreNameInput] = React.useState('');
  const [storeDescInput, setStoreDescInput] = React.useState('');
  const [showStoreForm, setShowStoreForm] = React.useState(false);

  const myOrders = orders.filter(o => o.customerId === user?.uid || true); // Show demo orders
  const myWishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameInput.trim()) return;
    createStore(storeNameInput, storeDescInput);
    setShowStoreForm(false);
  };

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6321] text-black font-black text-xl flex items-center justify-center">
            {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'PI'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">{user?.displayName || 'Pioneer User'}</h2>
            <p className="text-xs text-zinc-400 font-medium">{user?.email}</p>
            {user?.piUsername && (
              <p className="text-xs font-mono text-[#FF6321] font-bold mt-0.5">@{user.piUsername}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 px-4 py-2.5 rounded-2xl text-xs border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Pi Wallet</p>
            <p className="font-mono text-[#FF6321] font-black mt-0.5">{user?.piWalletAddress || 'GBA7...MANIRUMZ'}</p>
          </div>

          <button
            onClick={() => setShowStoreForm(!showStoreForm)}
            className="px-5 py-3 rounded-2xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xl"
          >
            <Store className="w-4 h-4" />
            <span>{getTranslation(language, 'createStore')}</span>
          </button>
        </div>
      </div>

      {/* Seller Registration Modal Form */}
      {showStoreForm && (
        <form onSubmit={handleStoreSubmit} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-[#FF6321]/40 space-y-4 shadow-2xl">
          <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FF6321]" />
            <span>{getTranslation(language, 'createStore')}</span>
          </h3>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Store Name</label>
            <input
              type="text"
              required
              value={storeNameInput}
              onChange={(e) => setStoreNameInput(e.target.value)}
              placeholder="e.g. Arewa Pi Electronics"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Store Description</label>
            <textarea
              rows={2}
              value={storeDescInput}
              onChange={(e) => setStoreDescInput(e.target.value)}
              placeholder="What products or services will you sell?"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <button type="submit" className="px-6 py-3 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-colors">
            Submit Store Approval
          </button>
        </form>
      )}

      {/* Orders Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#FF6321]" />
          <span>{getTranslation(language, 'myOrders')} ({myOrders.length})</span>
        </h3>

        {myOrders.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-12 font-medium">No orders placed yet.</p>
        ) : (
          <div className="space-y-3">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-white">#{order.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-[#FF6321]/20 text-[#FF6321] border border-[#FF6321]/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-2 font-medium">
                    {order.items.length} item(s) • Total: <strong className="text-[#FF6321] font-mono">{order.totalPi} π (${order.totalUsd})</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setActiveModal('order_tracking');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-[#FF6321] text-zinc-300 hover:text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'trackOrder')}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#FF6321]" />
          <span>{getTranslation(language, 'wishlist')} ({myWishlistProducts.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myWishlistProducts.map((p) => (
            <div key={p.id} className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex gap-3">
              <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
              <div>
                <h4 className="font-extrabold text-xs text-white line-clamp-1 uppercase tracking-tight">{p.title}</h4>
                <p className="font-black text-xs text-[#FF6321] font-mono mt-1">{p.pricePi} π</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
