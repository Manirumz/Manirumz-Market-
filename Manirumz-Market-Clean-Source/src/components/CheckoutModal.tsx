import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { X, Coins, CreditCard, CheckCircle2, ShieldCheck, MapPin, Truck, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    cart, 
    user, 
    language, 
    createOrder, 
    setIsAuthModalOpen,
    setSelectedOrder
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'pi_network' | 'card' | 'bank_transfer'>('pi_network');
  const [shippingAddress, setShippingAddress] = useState(user?.address || 'No. 45 Zoo Road, Kano State, Nigeria');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (activeModal !== 'checkout') return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center relative shadow-2xl">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <Coins className="w-12 h-12 text-[#FF6321] mx-auto mb-3" />
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Sign In Required</h3>
          <p className="text-xs text-zinc-400 mt-2 mb-6 font-medium">
            Please sign in with your Pi Account or Google profile to complete this purchase.
          </p>
          <button
            onClick={() => {
              setActiveModal(null);
              setIsAuthModalOpen(true);
            }}
            className="w-full py-3.5 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest transition-colors"
          >
            {getTranslation(language, 'login')}
          </button>
        </div>
      </div>
    );
  }

  const totalPi = cart.reduce((acc, item) => acc + item.product.pricePi * item.quantity, 0);
  const totalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return;

    setIsProcessing(true);

    try {
      const created = await createOrder(paymentMethod, shippingAddress);
      if (created) {
        setOrderSuccess(created);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={() => {
            setActiveModal(null);
            setOrderSuccess(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          /* Order Success State */
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              {getTranslation(language, 'paymentSuccess')}
            </h3>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              Order <strong className="text-[#FF6321] font-mono">#{orderSuccess.id}</strong> has been received by seller!
            </p>

            <div className="my-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono uppercase">{getTranslation(language, 'piTxId')}:</span>
                <span className="font-mono font-bold text-[#FF6321] truncate max-w-[200px]">
                  {orderSuccess.piPaymentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase font-black text-[10px] tracking-wider">Total Paid:</span>
                <span className="font-mono font-bold text-white">{orderSuccess.totalPi} π (${orderSuccess.totalUsd})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase font-black text-[10px] tracking-wider">Shipping Address:</span>
                <span className="font-medium text-zinc-300">{orderSuccess.shippingAddress}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedOrder(orderSuccess);
                  setActiveModal('order_tracking');
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-colors"
              >
                {getTranslation(language, 'trackOrder')}
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setOrderSuccess(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleConfirmCheckout} className="space-y-5">
            <div className="flex items-center gap-2 text-[#FF6321]">
              <Coins className="w-6 h-6" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                {getTranslation(language, 'checkout')}
              </h2>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Order Total</p>
                <div className="flex items-center gap-1.5 text-2xl font-black text-[#FF6321] font-mono">
                  <Coins className="w-5 h-5" />
                  <span>{totalPi.toFixed(2)} π</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Fiat Equivalent</p>
                <p className="text-sm font-bold font-mono text-white">
                  ${totalUsd.toLocaleString()} USD
                </p>
              </div>
            </div>

            {/* Shipping Address Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>{getTranslation(language, 'shippingAddress')}</span>
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Full Street Name, City, State/Region, Phone number..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pi_network')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    paymentMethod === 'pi_network'
                      ? 'border-[#FF6321] bg-[#FF6321]/10 text-[#FF6321] font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-[#FF6321]" />
                    <span className="text-xs font-black uppercase tracking-tight">Pi Network Wallet</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-medium">1-Click Pi SDK Approval</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    paymentMethod === 'card'
                      ? 'border-[#FF6321] bg-[#FF6321]/10 text-[#FF6321] font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#FF6321]" />
                    <span className="text-xs font-black uppercase tracking-tight">Card / Bank Transfer</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-medium">Interswitch / Master</span>
                </button>
              </div>
            </div>

            {/* Escrow note */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Escrow Protected: Pi is safely locked in smart escrow until order delivery is confirmed.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Pi Wallet Tx...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>{getTranslation(language, 'confirmOrder')} ({totalPi.toFixed(2)} π)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
