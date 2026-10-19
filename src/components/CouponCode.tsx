import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CouponCodeProps {
  code: string;
  minAmount?: string;
  onCopied?: (code: string) => void;
  className?: string;
}

export function CouponCode({ code, minAmount, onCopied, className = '' }: CouponCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopied?.(code);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      onCopied?.(code);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`space-y-0.5 min-w-0 w-full ${className}`}>
      <div className="flex items-center justify-between gap-1 p-1 sm:p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-dashed border-emerald-300 dark:border-emerald-700/60 min-w-0 w-full">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 shrink-0">
            KOD:
          </span>
          <span className="font-mono font-bold text-[10px] sm:text-xs text-slate-900 dark:text-white select-all truncate">
            {code}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Kupon kodunu kopyala: ${code}`}
          className={`shrink-0 flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[9px] sm:text-xs font-semibold transition-all duration-200 min-h-[26px] sm:min-h-[30px] cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span className="truncate">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </>
          ) : (
            <>
              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span className="truncate">Kopyala</span>
            </>
          )}
        </button>
      </div>

      {minAmount && (
        <div className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 truncate pl-0.5">
          Min. səbət: <span className="font-semibold text-slate-700 dark:text-slate-300">{minAmount}</span>
        </div>
      )}
    </div>
  );
}
