import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Category } from '../types';
import { 
  Grid, 
  Tv, 
  Shirt, 
  Smartphone, 
  Car, 
  ShoppingBag, 
  Wrench, 
  Palette 
} from 'lucide-react';

interface CategoryItem {
  id: string;
  key: keyof typeof import('../i18n/translations').translations.en;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', key: 'allCategories', icon: Grid },
  { id: 'electronics', key: 'electronics', icon: Tv },
  { id: 'fashion', key: 'fashion', icon: Shirt },
  { id: 'phones', key: 'phones', icon: Smartphone },
  { id: 'automotive', key: 'automotive', icon: Car },
  { id: 'groceries', key: 'groceries', icon: ShoppingBag },
  { id: 'services', key: 'services', icon: Wrench },
  { id: 'art', key: 'art', icon: Palette },
];

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory, language } = useApp();

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
                isSelected
                  ? 'bg-[#FF6321] border-[#FF6321] text-black shadow-lg shadow-[#FF6321]/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-[#FF6321]/40 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-[#FF6321]'}`} />
              <span>{getTranslation(language, cat.key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
