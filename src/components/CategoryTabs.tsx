'use client';

import { Category } from '@/types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'Semua', icon: '🔥' },
  { id: 'mobile', label: 'Mobile', icon: '📱' },
  { id: 'pc', label: 'PC', icon: '💻' },
  { id: 'console', label: 'Console', icon: '🎮' },
];

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300/40 scale-105'
              : 'bg-white text-pink-600 hover:bg-pink-50 shadow-sm border border-pink-100'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
