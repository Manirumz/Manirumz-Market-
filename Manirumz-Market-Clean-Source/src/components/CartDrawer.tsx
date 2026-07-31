import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { X, Trash2, Coins, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQty, 
    language, 
    setActiveModal 
  } = useApp();

  if (!isCartOpen) return null;

  const totalPi = cart.reduce((acc, item) => acc + item.product.pricePi * item.quantity, 0);
  const totalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 shadow-2xl border-l border-zinc-800 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF6321]" />
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                {getTranslation(language, 'cart')} ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#FF6321]" />
                <p className="font-black uppercase tracking-wider text-xs">{getTranslation(language, 'emptyCart')}</p>
              </div>
            ) : (
              cart.map((item) => {
                const title = language === 'ha' && item.product.titleHa ? item.product.titleHa : item.product.title;
                return (
                  <div 
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={title}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-xs text-white line-clamp-2 uppercase tracking-tight">
                          {title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 font-black text-xs text-[#FF6321] font-mono">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{(item.product.pricePi * item.quantity).toFixed(2)} π</span>
                        </div>

                        {/* Quantity adjust */}
                        <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                          <button
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="px-2 py-0.5 text-xs font-black text-zinc-300 hover:bg-zinc-800"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-black text-white font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="px-2 py-0.5 text-xs font-black text-zinc-300 hover:bg-zinc-800"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/60 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between items-center text-zinc-400 text-xs font-mono">
                  <span>{getTranslation(language, 'total')} (USD):</span>
                  <span className="font-bold text-white">${totalUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-black text-lg text-[#FF6321]">
                  <span className="flex items-center gap-1 uppercase tracking-wider text-xs font-black text-white">
                    <Coins className="w-5 h-5 text-[#FF6321]" />
                    <span>Total Pi (π):</span>
                  </span>
                  <span className="font-mono text-xl">{totalPi.toFixed(2)} π</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveModal('checkout');
                }}
                className="w-full py-4 px-4 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>{getTranslation(language, 'checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
