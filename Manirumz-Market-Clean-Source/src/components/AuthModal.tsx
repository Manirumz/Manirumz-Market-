import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { X, Coins, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { Role } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginWithGoogle, loginWithPiUser, language } = useApp();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('customer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, selectedRole, displayName || email.split('@')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6321] text-black font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF6321]/20">
            π
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {getTranslation(language, 'login')} to Manirumz
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Access Pi Payments, Order Tracking & Seller Store
          </p>
        </div>

        {/* Pi Network & Google Auth Logins */}
        <div className="space-y-2 mb-4">
          <button
            onClick={loginWithPiUser}
            className="w-full py-3.5 px-4 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2"
          >
            <Coins className="w-4 h-4" />
            <span>{getTranslation(language, 'loginWithPi')}</span>
          </button>

          <button
            onClick={loginWithGoogle}
            className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4 text-[#FF6321]" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <span className="relative bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
            Or Sign in with Email / Role
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">Full Name / Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alhaji Usman Kano"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pioneer@minepi.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">{getTranslation(language, 'role')}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                  selectedRole === 'customer'
                    ? 'border-[#FF6321] bg-[#FF6321]/10 text-[#FF6321]'
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                  selectedRole === 'seller'
                    ? 'border-[#FF6321] bg-[#FF6321]/10 text-[#FF6321]'
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                  selectedRole === 'admin'
                    ? 'border-[#FF6321] bg-[#FF6321]/10 text-[#FF6321]'
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-white hover:bg-[#FF6321] text-black font-black text-xs uppercase tracking-widest transition-colors"
          >
            {getTranslation(language, 'register')}
          </button>
        </form>
      </div>
    </div>
  );
};
