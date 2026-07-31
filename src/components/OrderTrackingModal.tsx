import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { X, Truck, CheckCircle2, Clock, PackageCheck, MapPin, Coins } from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, activeModal, setActiveModal, language } = useApp();

  if (activeModal !== 'order_tracking' || !selectedOrder) return null;

  const steps = [
    { key: 'pending', label: getTranslation(language, 'orderPending'), icon: Clock },
    { key: 'processing', label: getTranslation(language, 'orderProcessing'), icon: Truck },
    { key: 'shipped', label: getTranslation(language, 'orderShipped'), icon: MapPin },
    { key: 'delivered', label: getTranslation(language, 'orderDelivered'), icon: PackageCheck }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === selectedOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 p-6 sm:p-8">
        <button
          onClick={() => {
            setActiveModal(null);
            setSelectedOrder(null);
          }}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#FF6321]">
          <Truck className="w-6 h-6" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {getTranslation(language, 'trackOrder')}
          </h2>
        </div>

        <p className="text-xs text-zinc-400 mb-6 font-mono font-medium">
          Order ID: <strong className="text-[#FF6321]">#{selectedOrder.id}</strong> • Placed {new Date(selectedOrder.createdAt).toLocaleDateString()}
        </p>

        {/* Tracking Timeline */}
        <div className="py-6 px-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6">
          <div className="flex items-center justify-between relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= (currentStepIndex === -1 ? 1 : currentStepIndex);
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center flex-1 z-10 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-[#FF6321] text-black font-black shadow-lg shadow-[#FF6321]/20'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider mt-2 ${isCurrent ? 'text-[#FF6321]' : 'text-zinc-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs mb-4">
          <p className="font-black uppercase tracking-wider text-[#FF6321] mb-1">{getTranslation(language, 'shippingAddress')}:</p>
          <p className="text-zinc-300 font-medium">{selectedOrder.shippingAddress}</p>
        </div>

        {/* Items List */}
        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
          {selectedOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-extrabold text-white truncate max-w-[200px] uppercase tracking-tight">
                {item.quantity}x {item.product.title}
              </span>
              <span className="font-black text-[#FF6321] font-mono flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {(item.product.pricePi * item.quantity).toFixed(2)} π
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setActiveModal(null);
            setSelectedOrder(null);
          }}
          className="w-full py-3.5 rounded-xl bg-white hover:bg-[#FF6321] text-black font-black text-xs uppercase tracking-widest transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
