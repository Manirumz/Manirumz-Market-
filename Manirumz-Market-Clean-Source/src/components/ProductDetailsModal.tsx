import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { X, Star, Coins, ShoppingBag, Zap, ShieldCheck, Heart, User, Send } from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    activeModal, 
    setActiveModal, 
    language, 
    addToCart, 
    setIsCartOpen,
    wishlist,
    toggleWishlist,
    addNotification
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 'rev1',
      name: 'Malam Ibrahim Kano',
      rating: 5,
      comment: 'Na saya da Pi Coin, an isar min har Kano a cikin kwanaki biyu. Nagari kwarai!',
      date: '2 days ago'
    },
    {
      id: 'rev2',
      name: 'Dr. Chinedu Pi Pioneer',
      rating: 5,
      comment: 'Instant Pi Network payment approval! Item was 100% genuine as described.',
      date: '1 week ago'
    }
  ]);

  if (activeModal !== 'product_details' || !selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const title = language === 'ha' && selectedProduct.titleHa ? selectedProduct.titleHa : selectedProduct.title;
  const description = language === 'ha' && selectedProduct.descriptionHa ? selectedProduct.descriptionHa : selectedProduct.description;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: 'rev_' + Date.now(),
      name: 'Pioneer Member',
      rating: reviewRating,
      comment: reviewComment,
      date: 'Just now'
    };

    setReviews([newRev, ...reviews]);
    setReviewComment('');
    addNotification("Review submitted successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-zinc-900 hover:bg-[#FF6321] text-zinc-400 hover:text-black transition-colors border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square bg-zinc-900 overflow-hidden">
            <img
              src={selectedProduct.imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition ${
                isWishlisted ? 'bg-[#FF6321] text-black' : 'bg-black/60 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-[#FF6321] uppercase tracking-widest mb-2">
                <span>{selectedProduct.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {selectedProduct.rating} ({selectedProduct.reviewCount} {getTranslation(language, 'reviews')})
                </span>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {title}
              </h2>

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {description}
              </p>

              {/* Price Callout */}
              <div className="my-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Pi Coin Price</p>
                  <div className="flex items-center gap-1.5 text-2xl font-black text-[#FF6321]">
                    <Coins className="w-6 h-6" />
                    <span className="font-mono">{selectedProduct.pricePi.toFixed(2)} π</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Fiat Equivalent</p>
                  <p className="text-base font-bold text-white font-mono">
                    ${selectedProduct.priceUsd.toLocaleString()} USD
                  </p>
                </div>
              </div>

              {/* Seller & Protection */}
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Seller: <strong className="text-white">{selectedProduct.sellerName}</strong></span>
                </div>
                <p className="text-[11px] text-zinc-500">100% Pi Escrow Protection - Payment released only upon order delivery.</p>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-3 my-6">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Quantity:</span>
                <div className="flex items-center border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 font-black text-zinc-300 hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-black text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 font-black text-zinc-300 hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  addToCart(selectedProduct, quantity);
                }}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-[#FF6321] text-black font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{getTranslation(language, 'addToCart')}</span>
              </button>

              <button
                onClick={() => {
                  addToCart(selectedProduct, quantity);
                  setActiveModal('checkout');
                }}
                className="py-3.5 px-4 rounded-xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{getTranslation(language, 'buyWithPi')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 sm:p-8 bg-zinc-950 border-t border-zinc-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span>{getTranslation(language, 'reviews')} ({reviews.length})</span>
          </h3>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="mb-6 flex gap-2">
            <input
              type="text"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={getTranslation(language, 'leaveReview')}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF6321] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'submit')}</span>
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>{rev.name}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">{rev.date}</span>
                </div>
                <p className="text-zinc-400">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
