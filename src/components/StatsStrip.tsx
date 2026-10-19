import { Tag, TrendingDown, Layers, Zap } from 'lucide-react';
import { CampaignStats } from '../types/campaign';

interface StatsStripProps {
  stats: CampaignStats;
}

export function StatsStrip({ stats }: StatsStripProps) {
  // If max discount is 0% or empty, show «—»
  const formattedMaxDiscount =
    !stats.maxDiscount || stats.maxDiscount === '0%' || stats.maxDiscount === '0'
      ? '—'
      : stats.maxDiscount;

  const items = [
    {
      id: 'stat-total',
      label: 'Kampaniya sayı',
      value: stats.totalCampaigns,
      unit: 'ədəd',
      icon: Tag,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200/80 dark:border-emerald-800/60'
    },
    {
      id: 'stat-discount',
      label: 'Maks. endirim',
      value: formattedMaxDiscount,
      unit: '',
      icon: TrendingDown,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      borderColor: 'border-amber-200/80 dark:border-amber-800/60'
    },
    {
      id: 'stat-categories',
      label: 'Kateqoriya sayı',
      value: stats.totalCategories,
      unit: 'kateqoriya',
      icon: Layers,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      borderColor: 'border-indigo-200/80 dark:border-indigo-800/60'
    },
    {
      id: 'stat-active',
      label: 'Aktiv fürsət',
      value: stats.activeDealsCount,
      unit: 'aktiv',
      icon: Zap,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/60',
      borderColor: 'border-rose-200/80 dark:border-rose-800/60'
    }
  ];

  return (
    <section aria-label="Kampaniya statistikası" className="mb-2 sm:mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-2 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border ${item.borderColor} shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1.5">
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {item.label}
                </span>
                <div className={`p-1 rounded-lg ${item.bgColor} ${item.color} shrink-0`}>
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {item.value}
                </span>
                {item.unit && (
                  <span className="text-[8px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
