import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Heart, Star, ShoppingBag, Coins, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    language, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    setSelectedProduct, 
    setActiveModal,
    setIsCartOpen 
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const displayTitle = language === 'ha' && product.titleHa ? product.titleHa : product.title;

  return (
    <div className="group bg-zinc-900 border border-zinc-800 p-2 rounded-3xl hover:border-[#FF6321] transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950 rounded-2xl">
        <img
          src={product.imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Heart Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition ${
            isWishlisted 
              ? 'bg-[#FF6321] text-black' 
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
          title={getTranslation(language, 'wishlist')}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Featured Tag */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-[#FF6321] text-black text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
            Pi Verified
          </span>
        )}

        {/* Price Overlay Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/90 backdrop-blur-md text-[#FF6321] border border-[#FF6321]/30 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#FF6321]" />
            <span className="font-mono text-sm">{product.pricePi.toFixed(2)} π</span>
          </div>

          <span className="bg-zinc-900/90 backdrop-blur-md text-zinc-400 text-[11px] font-bold px-2 py-1 rounded-lg border border-zinc-800 font-mono">
            ${product.priceUsd.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3 pt-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6321]">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-zinc-500 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => {
              setSelectedProduct(product);
              setActiveModal('product_details');
            }}
            className="font-black text-sm text-white group-hover:text-[#FF6321] transition line-clamp-2 cursor-pointer uppercase tracking-tight leading-snug"
          >
            {displayTitle}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
            {language === 'ha' && product.descriptionHa ? product.descriptionHa : product.description}
          </p>
        </div>

        {/* Stock & Seller Info */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="truncate max-w-[130px]">
            {getTranslation(language, 'seller')}: <strong className="text-zinc-300">{product.sellerName}</strong>
          </span>

          {product.stock > 0 ? (
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] uppercase">
              {product.stock} {getTranslation(language, 'unitsLeft')}
            </span>
          ) : (
            <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-[10px] uppercase">
              {getTranslation(language, 'outOfStock')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="w-full py-2.5 px-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#FF6321] transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'addToCart')}</span>
          </button>

          <button
            onClick={() => {
              addToCart(product, 1);
              setIsCartOpen(true);
            }}
            disabled={product.stock <= 0}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FF6321] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'buyNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
