import { useEffect, useState } from 'react';
import { calculateTimeRemaining, TimeRemaining } from '../utils/formatters.ts';

interface CountdownProps {
  targetDate: string;
  variant?: 'hero' | 'card' | 'inline';
  label?: string;
  className?: string;
}

export function Countdown({ targetDate, variant = 'card', label, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeRemaining(targetDate));

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className={`text-xs font-semibold text-rose-600 dark:text-rose-400 ${className}`}>
        Müddət bitmişdir
      </div>
    );
  }

  // Format with leading zeroes
  const pad = (num: number) => String(num).padStart(2, '0');

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-start sm:items-end ${className}`}>
        {label && (
          <span className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300/80 mb-1.5 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {label}
          </span>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2" aria-label={`Qalan vaxt: ${timeLeft.days} gün, ${timeLeft.hours} saat, ${timeLeft.minutes} dəqiqə, ${timeLeft.seconds} saniyə`}>
          <div className="flex flex-col items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {pad(timeLeft.days)}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">gün</span>
          </div>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mb-3">:</span>
          <div className="flex flex-col items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">saat</span>
          </div>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mb-3">:</span>
          <div className="flex flex-col items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">dəq</span>
          </div>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mb-3 hidden sm:inline">:</span>
          <div className="hidden sm:flex flex-col items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl px-2.5 py-1.5 min-w-[50px] shadow-sm">
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums text-emerald-600 dark:text-emerald-400">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">san</span>
          </div>
        </div>
      </div>
    );
  }

  // Card or compact variant
  return (
    <div className={`flex items-center justify-between gap-1 text-[9px] sm:text-xs min-w-0 w-full ${className}`}>
      {label && <span className="text-slate-500 dark:text-slate-400 font-medium truncate shrink-0">{label}:</span>}
      <div className="flex items-center gap-0.5 sm:gap-1 font-mono font-bold text-[9px] sm:text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60 shrink-0 tabular-nums">
        <span>{timeLeft.days > 0 ? `${timeLeft.days}g ` : ''}</span>
        <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
