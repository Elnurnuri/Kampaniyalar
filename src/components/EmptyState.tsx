import { SearchX, AlertTriangle, RefreshCw, Mail } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-campaigns' | 'category-empty' | 'error';
  errorMessage?: string;
  onResetCategory?: () => void;
  onRetry?: () => void;
  onScrollToNewsletter?: () => void;
}

export function EmptyState({
  type,
  errorMessage,
  onResetCategory,
  onRetry,
  onScrollToNewsletter
}: EmptyStateProps) {
  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs my-8">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
          Məlumatlar yüklənərkən xəta baş verdi
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {errorMessage || 'Serverlə əlaqə qurularkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors min-h-[44px] cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yenidən yoxla</span>
          </button>
        )}
      </div>
    );
  }

  if (type === 'category-empty') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs my-8">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
          Bu kateqoriyada aktiv kampaniya tapılmadı
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          Hazırda bu bölmə üzrə aktiv kampaniya yoxdur. Digər maraqlı təkliflərə baxmaq üçün bütün kampaniyalara qayıda bilərsiniz.
        </p>
        {onResetCategory && (
          <button
            type="button"
            onClick={onResetCategory}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors min-h-[44px] cursor-pointer shadow-sm"
          >
            <span>Hamısına qayıt</span>
          </button>
        )}
      </div>
    );
  }

  // Entire page empty: «Hazırda aktiv kampaniya yoxdur» + abunə təklifi
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs my-8">
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4">
        <Mail className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
        Hazırda aktiv kampaniya yoxdur
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        Yeni endirimlər və xüsusi fürsətlər tezliklə əlavə olunacaq. İlk xəbərdar olmaq üçün bülletenimizə abunə olun.
      </p>
      {onScrollToNewsletter && (
        <button
          type="button"
          onClick={onScrollToNewsletter}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors min-h-[44px] cursor-pointer shadow-sm"
        >
          <Mail className="w-4 h-4" />
          <span>Abunə ol və xəbərdar qal</span>
        </button>
      )}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-3 lg:gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-4 shadow-xs animate-pulse space-y-2.5"
        >
          <div className="h-16 sm:h-24 bg-slate-200 dark:bg-slate-800 rounded-lg sm:rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="h-8 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-lg sm:rounded-xl w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
