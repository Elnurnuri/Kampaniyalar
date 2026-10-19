import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function NewsletterBlock() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Zəhmət olmasa e-poçt ünvanınızı daxil edin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Düzgün bir e-poçt ünvanı daxil edin (məs: ad@example.com).');
      return;
    }

    setStatus('loading');

    // Simulate API request
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Abunəlik zamanı xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.');
    }
  };

  return (
    <section
      id="newsletter-section"
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl my-10"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-1">
          <Mail className="w-6 h-6" />
        </div>

        <h2 id="newsletter-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Yeni kampaniyalardan xəbərdar olun
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Qara Cümə, flaş satışlar və mağazaların xüsusi kupon kodlarını qaçırmamaq üçün həftəlik xülasəmizə abunə olun. Spam göndərmirik.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-center">
              Təşəkkür edirik! E-poçt ünvanınız uğurla qeydiyyata alındı.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="E-poçt ünvanınız..."
                  disabled={status === 'loading'}
                  aria-label="E-poçt ünvanı"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md transition-all duration-200 min-h-[44px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Göndərilir...</span>
                  </>
                ) : (
                  <span>Abunə ol</span>
                )}
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-medium pt-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              İstənilən vaxt abunəliyi bir kliklə ləğv edə bilərsiniz.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
