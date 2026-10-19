import { Zap, TicketPercent, Percent, Calendar, Sparkles, LayoutGrid } from 'lucide-react';
import { CampaignCategory } from '../types/campaign';

interface CategoryTabsProps {
  categories: CampaignCategory[];
  activeSlug: string;
  counts: Record<string, number>;
  totalCount: number;
  onSelectCategory: (slug: string) => void;
}

export function CategoryTabs({
  categories,
  activeSlug,
  counts,
  totalCount,
  onSelectCategory
}: CategoryTabsProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'flash-sale':
        return Zap;
      case 'coupons':
        return TicketPercent;
      case 'category-discounts':
        return Percent;
      case 'holidays':
        return Calendar;
      case 'special':
        return Sparkles;
      default:
        return LayoutGrid;
    }
  };

  const allTabs = [
    {
      id: 'all',
      name: 'Hamısı',
      slug: 'all',
      count: totalCount,
      icon: LayoutGrid
    },
    ...categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: counts[c.slug] ?? 0,
      icon: getIcon(c.slug)
    }))
  ];

  return (
    <div className="relative mb-2.5 sm:mb-4">
      {/* Scroll container with no visible scrollbar */}
      <div 
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 scroll-smooth"
        role="tablist"
        aria-label="Kampaniya kateqoriyaları"
      >
        {allTabs.map(tab => {
          const isActive = activeSlug === tab.slug;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.slug}`}
              id={`tab-${tab.slug}`}
              onClick={() => onSelectCategory(tab.slug)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 min-h-[38px] sm:min-h-[44px] cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'text-white scale-110' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{tab.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
