import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-emerald-950 dark:text-emerald-100 dark:border dark:border-emerald-700/60 shadow-xl max-w-sm animate-bounce-subtle"
    >
      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      <span className="text-xs sm:text-sm font-semibold">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Bildirişi bağla"
        className="p-1 rounded-lg text-slate-400 hover:text-white dark:hover:text-emerald-200 transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
