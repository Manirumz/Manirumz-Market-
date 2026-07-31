import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Coins, Zap, ShieldCheck, ArrowRight, Wallet, Sparkles } from 'lucide-react';

export const BannerPi: React.FC = () => {
  const { language, loginWithPiUser, user, setActiveModal, setIsAuthModalOpen } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-10 my-6">
      {/* Decorative Vibrant Orange Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#FF6321]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-[#FF6321]/30 text-[#FF6321] text-xs font-black uppercase tracking-wider mb-4">
            <Coins className="w-3.5 h-3.5" />
            <span>Pi Network Mainnet Ecosystem</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FF6321] animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {language === 'ha' ? (
              <>Saye da Sayarwa da <span className="text-[#FF6321]">Pi Coin (π)</span> a Najeriya</>
            ) : (
              <>Trade Anything Instantly with <span className="text-[#FF6321]">Pi Coin (π)</span></>
            )}
          </h2>

          <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed font-medium">
            {getTranslation(language, 'appTagline')}
          </p>

          {/* Quick Stats Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="p-2 bg-[#FF6321] text-black rounded-xl font-black">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Instant Payment</p>
                <p className="text-xs font-bold text-white font-mono">0.0001 π Fee</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="p-2 bg-white text-black rounded-xl font-black">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Pi Wallet SDK</p>
                <p className="text-xs font-bold text-white">Mainnet Auth</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2 bg-[#FF6321]/20 text-[#FF6321] rounded-xl font-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Escrow Vault</p>
                <p className="text-xs font-bold text-white">100% Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={loginWithPiUser}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2"
          >
            <Coins className="w-4 h-4" />
            <span>{getTranslation(language, 'loginWithPi')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (user) {
                setActiveModal('dashboard');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
          >
            <span>{getTranslation(language, 'createStore')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
