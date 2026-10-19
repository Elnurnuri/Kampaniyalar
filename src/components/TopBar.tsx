import { ShoppingBag, Moon, Sun, ArrowLeft, RefreshCw } from 'lucide-react';

interface TopBarProps {
  isDark: boolean;
  onToggleDark: () => void;
  apiMode: 'normal' | 'empty' | 'error';
  onSetApiMode: (mode: 'normal' | 'empty' | 'error') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TopBar({
  isDark,
  onToggleDark,
  apiMode,
  onSetApiMode,
  searchQuery,
  onSearchChange
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="https://panshop.az"
              onClick={e => e.preventDefault()}
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg sm:text-xl tracking-tight group"
            >
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="truncate">panshop<span className="text-slate-900 dark:text-white">.az</span></span>
            </a>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Ana səhifə</span>
              <span>/</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Kampaniyalar</span>
            </div>
          </div>

          {/* Search in Campaigns */}
          <div className="hidden sm:block flex-1 max-w-xs mx-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Kampaniya və ya mağaza axtar..."
              aria-label="Kampaniyalarda axtarış"
              className="w-full px-3.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors min-h-[38px]"
            />
          </div>

          {/* Right actions: State switcher for QA & Dark mode toggle */}
          <div className="flex items-center gap-2">
            {/* API Mode toggle for testing all requirements */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => onSetApiMode('normal')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  apiMode === 'normal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Aktiv
              </button>
              <button
                type="button"
                onClick={() => onSetApiMode('empty')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  apiMode === 'empty'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Boş
              </button>
              <button
                type="button"
                onClick={() => onSetApiMode('error')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  apiMode === 'error'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Xəta
              </button>
            </div>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'Gündüz rejiminə keç' : 'Gecə rejiminə keç'}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
