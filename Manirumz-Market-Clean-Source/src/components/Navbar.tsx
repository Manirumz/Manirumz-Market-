import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  User as UserIcon, 
  Coins, 
  ShieldCheck, 
  Store as StoreIcon, 
  Smartphone,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    role, 
    language, 
    theme, 
    cart, 
    wishlist, 
    isPiBrowser, 
    searchQuery, 
    setSearchQuery, 
    setLanguage, 
    toggleTheme, 
    setIsCartOpen, 
    setIsAuthModalOpen, 
    setActiveModal,
    switchRole,
    logout
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 transition-colors">
      {/* Top Banner Bar */}
      <div className="bg-black text-zinc-400 text-xs py-2 px-4 flex flex-wrap justify-between items-center gap-2 border-b border-zinc-900">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6321] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6321]"></span>
          </span>
          <span className="text-[#FF6321]">Pi Network Mainnet Live</span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="hidden sm:inline text-zinc-400 font-mono">
            {getTranslation(language, 'piPriceReference')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isPiBrowser ? (
            <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-[#FF6321] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#FF6321]/30">
              <Coins className="w-3 h-3" />
              {getTranslation(language, 'piBrowserDetected')}
            </span>
          ) : (
            <a 
              href="https://minepi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FF6321] hover:underline flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
            >
              <Smartphone className="w-3 h-3" />
              {getTranslation(language, 'openInPiBrowser')}
            </a>
          )}

          {/* Language Switcher */}
          <div className="flex bg-zinc-900 rounded-lg p-0.5 text-[10px] font-black uppercase tracking-wider border border-zinc-800">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded transition ${language === 'en' ? 'bg-[#FF6321] text-black font-black' : 'text-zinc-500 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ha')}
              className={`px-2.5 py-1 rounded transition ${language === 'ha' ? 'bg-[#FF6321] text-black font-black' : 'text-zinc-500 hover:text-white'}`}
            >
              HA
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title={getTranslation(language, 'theme')}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FF6321]" /> : <Moon className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModal(null)}>
          <div className="bg-[#FF6321] text-black font-black text-2xl px-3 py-1 tracking-tighter shadow-lg">
            MANIRUMZ
          </div>
          <div className="hidden sm:block h-7 w-[1px] bg-zinc-800"></div>
          <span className="hidden sm:inline text-xs tracking-widest text-zinc-400 uppercase font-black">
            Marketplace & Pi Node
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-11 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321] transition-colors"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Pi Balance Widget */}
          <div className="hidden lg:flex items-center gap-2.5 bg-zinc-900 px-3.5 py-1.5 rounded-full border border-zinc-800">
            <div className="w-5 h-5 bg-[#FF6321] rounded-full flex items-center justify-center text-black font-black text-xs">π</div>
            <span className="text-xs font-mono font-bold text-white">1,245.80 π</span>
          </div>

          {/* Dashboard Quick Nav Button */}
          <button
            onClick={() => setActiveModal('dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition"
          >
            {role === 'admin' ? (
              <>
                <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                <span>Admin</span>
              </>
            ) : role === 'seller' ? (
              <>
                <StoreIcon className="w-4 h-4 text-[#FF6321]" />
                <span>Seller</span>
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4 text-[#FF6321]" />
                <span>Customer</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setActiveModal('dashboard')}
            className="relative p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition"
            title={getTranslation(language, 'wishlist')}
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6321] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#FF6321] hover:bg-white text-black transition-colors font-black text-xs uppercase tracking-wider flex items-center gap-2 px-4 shadow-lg shadow-[#FF6321]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation(language, 'cart')}</span>
            {totalCartCount > 0 && (
              <span className="bg-black text-[#FF6321] text-xs font-black px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile & Role Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FF6321] text-black font-black text-xs flex items-center justify-center">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white leading-none">{user.displayName}</p>
                  <p className="text-[10px] font-extrabold text-[#FF6321] uppercase tracking-wider">{role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-zinc-800">
                    <p className="font-bold text-white">{user.displayName}</p>
                    <p className="text-zinc-500 text-[11px] truncate">{user.email}</p>
                    {user.piUsername && (
                      <p className="text-[#FF6321] font-mono text-[10px] mt-0.5">@{user.piUsername}</p>
                    )}
                  </div>

                  <div className="py-1">
                    <p className="px-3.5 py-1 text-[10px] uppercase font-black tracking-widest text-zinc-500">Switch Role</p>
                    <button
                      onClick={() => { switchRole('customer'); setIsRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-zinc-800 ${role === 'customer' ? 'text-[#FF6321] font-bold' : 'text-zinc-300'}`}
                    >
                      <span>Customer Mode</span>
                      {role === 'customer' && <span className="text-[10px] font-black uppercase text-[#FF6321]">Active</span>}
                    </button>
                    <button
                      onClick={() => { switchRole('seller'); setIsRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-zinc-800 ${role === 'seller' ? 'text-[#FF6321] font-bold' : 'text-zinc-300'}`}
                    >
                      <span>Seller Dashboard</span>
                      {role === 'seller' && <span className="text-[10px] font-black uppercase text-[#FF6321]">Active</span>}
                    </button>
                    <button
                      onClick={() => { switchRole('admin'); setIsRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-zinc-800 ${role === 'admin' ? 'text-[#FF6321] font-bold' : 'text-zinc-300'}`}
                    >
                      <span>Admin Command</span>
                      {role === 'admin' && <span className="text-[10px] font-black uppercase text-[#FF6321]">Active</span>}
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-1">
                    <button
                      onClick={() => { logout(); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-bold uppercase text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{getTranslation(language, 'logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-[#FF6321] transition-colors"
            >
              {getTranslation(language, 'login')}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(language, 'searchPlaceholder')}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>
      </div>
    </header>
  );
};
