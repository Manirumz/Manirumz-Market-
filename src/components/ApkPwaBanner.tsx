import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Smartphone, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ApkPwaBanner: React.FC = () => {
  const { language } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install Manirumz Market on Android/iOS:\n1. Tap your browser menu (⋮ or Share)\n2. Select 'Add to Home Screen' or 'Install App'");
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-3xl shadow-2xl my-4 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-zinc-800">
      <div className="flex items-center gap-3.5">
        <div className="p-3 bg-[#FF6321] text-black rounded-2xl shrink-0 font-black">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight text-white leading-tight">
            {getTranslation(language, 'installPwa')}
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Fast speed, offline browsing, push notifications & Pi Wallet integration.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={handleInstallClick}
          className="px-5 py-2.5 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{getTranslation(language, 'downloadApk')}</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-2 text-zinc-500 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
