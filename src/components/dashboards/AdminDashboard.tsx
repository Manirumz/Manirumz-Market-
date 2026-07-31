import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../i18n/translations';
import { ShieldCheck, Users, Store, Coins, Package, Check, X, TrendingUp, Layers } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, stores, orders, approveStore, deleteProduct, language } = useApp();

  const totalRevenuePi = orders.reduce((acc, o) => acc + o.totalPi, 0);
  const totalRevenueUsd = orders.reduce((acc, o) => acc + o.totalUsd, 0);

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#FF6321] text-xs font-black uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{getTranslation(language, 'adminDashboard')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Manirumz Global Admin Command</h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">Platform analytics, seller verifications and Pi Network mainnet logs.</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 border border-[#FF6321]/40 text-[#FF6321] text-xs font-black uppercase tracking-wider">
          <Coins className="w-4 h-4" />
          <span>Pi Network Escrow Active</span>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">{getTranslation(language, 'totalRevenue')}</span>
            <Coins className="w-4 h-4 text-[#FF6321]" />
          </div>
          <p className="text-2xl font-black text-[#FF6321] font-mono">{totalRevenuePi.toFixed(2)} π</p>
          <p className="text-[11px] font-mono font-bold text-zinc-400 mt-1">${totalRevenueUsd.toLocaleString()} USD</p>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">{getTranslation(language, 'totalOrders')}</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{orders.length}</p>
          <p className="text-[11px] font-mono font-bold text-emerald-400 mt-1">+100% Growth</p>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">{getTranslation(language, 'totalSellers')}</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{stores.length}</p>
          <p className="text-[11px] font-mono font-bold text-zinc-400 mt-1">Verified Stores</p>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">{getTranslation(language, 'totalUsers')}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">1,482</p>
          <p className="text-[11px] font-mono font-bold text-zinc-400 mt-1">Pioneers Registered</p>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF6321]" />
            <h3 className="font-black text-base uppercase tracking-tight text-white">Pi Transaction Volume</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono font-black uppercase tracking-wider">2026 Live Mainnet Data</span>
        </div>

        {/* Custom Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-zinc-900">
          {[
            { month: 'Jan', val: 40 },
            { month: 'Feb', val: 65 },
            { month: 'Mar', val: 80 },
            { month: 'Apr', val: 55 },
            { month: 'May', val: 95 },
            { month: 'Jun', val: 120 },
            { month: 'Jul', val: 160 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div
                style={{ height: `${bar.val}%` }}
                className="w-full max-w-[40px] bg-[#FF6321] rounded-t-lg group-hover:bg-white transition-all relative"
              >
                <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-[#FF6321] text-[10px] px-2 py-0.5 rounded font-mono font-black border border-zinc-800 transition">
                  {bar.val}π
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Approval Queue */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800">
        <h3 className="font-black text-base uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#FF6321]" />
          <span>Seller Store Approval Requests ({stores.length})</span>
        </h3>

        <div className="space-y-3">
          {stores.map((st) => (
            <div key={st.id} className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-extrabold text-sm text-white uppercase tracking-tight">{st.storeName}</p>
                <p className="text-xs text-zinc-400 mt-1">Seller: {st.sellerName} • Status: <strong className="text-[#FF6321] uppercase font-mono">{st.status}</strong></p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">{st.description}</p>
              </div>

              {st.status !== 'approved' && (
                <button
                  onClick={() => approveStore(st.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Store</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
