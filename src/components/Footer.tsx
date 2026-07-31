import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Coins, Globe, Heart, ShieldCheck, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage } = useApp();

  return (
    <footer className="mt-20 bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF6321] text-black font-black text-xl px-2.5 py-0.5 tracking-tighter">
              MANIRUMZ
            </div>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed font-medium">
            {getTranslation(language, 'appTagline')}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#FF6321] font-black uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Pi Network Mainnet Ecosystem</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-black text-[#FF6321] uppercase text-xs tracking-widest mb-4">Categories</h4>
          <ul className="space-y-2 text-zinc-400 font-medium">
            <li>Electronics & Solar Power</li>
            <li>Smartphones & Accessories</li>
            <li>Hausa Royal Attire & Fashion</li>
            <li>Automotive & Spare Parts</li>
            <li>Arewa Agro Produce & Groceries</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-black text-[#FF6321] uppercase text-xs tracking-widest mb-4">Pi Ecosystem</h4>
          <ul className="space-y-2 text-zinc-400 font-medium">
            <li>Pi Browser Compatibility</li>
            <li>Pi Wallet Escrow Protection</li>
            <li>Pi GCV Reference Pricing</li>
            <li>PWA & Android APK Installation</li>
            <li>Pi Node Verified Hardware</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-black text-[#FF6321] uppercase text-xs tracking-widest mb-4">Language Switcher</h4>
          <p className="text-zinc-400 mb-4 font-medium">Native English and Hausa translation support for all Pioneers.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('ha')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                language === 'ha' ? 'bg-[#FF6321] text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              🇳🇬 Hausa
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                language === 'en' ? 'bg-[#FF6321] text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
        <p>© 2026 MANIRUMZ MARKET. Built for Pi Network Pioneers Worldwide.</p>
        <p className="flex items-center gap-1.5 font-sans font-medium text-zinc-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF6321] fill-current" />
          <span>for West Africa & Global Pi Pioneers</span>
        </p>
      </div>
    </footer>
  );
};
