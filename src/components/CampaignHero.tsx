import { Sparkles, Flame } from 'lucide-react';
import { Campaign } from '../types/campaign';
import { Countdown } from './Countdown';

interface CampaignHeroProps {
  totalActive: number;
  nearestCampaign?: Campaign | null;
}

export function CampaignHero({ totalActive, nearestCampaign }: CampaignHeroProps) {
  // Determine if the nearest event is running (closing soon) or upcoming (starting soon)
  const isRunning = nearestCampaign?.status === 'running';
  const targetDate = nearestCampaign
    ? isRunning
      ? nearestCampaign.endsAt || nearestCampaign.campaignEnd
      : nearestCampaign.eventDate || nearestCampaign.campaignStart
    : undefined;

  const countdownLabel = isRunning
    ? `«${nearestCampaign?.title}» bitməsinə`
    : nearestCampaign
    ? `«${nearestCampaign.title}» başlamasına`
    : 'Yaxınlaşan fürsətə';

  return (
    <section className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-md border border-emerald-700/40 p-2.5 sm:p-5 lg:p-6 mb-2 sm:mb-4">
      {/* Decorative subtle background accents */}
      <div className="absolute -top-16 -right-16 w-36 sm:w-64 h-36 sm:h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 sm:w-64 h-36 sm:h-64 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-5">
        {/* Left Column: Title, Subtitle, Active Badge */}
        <div className="max-w-2xl space-y-1 sm:space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
              Panshop
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-white/10 text-emerald-100 border border-white/15">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              İndi aktiv: {totalActive} kampaniya
            </span>
          </div>

          <h1 className="text-base sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Kampaniyalar & Fürsətlər
          </h1>

          <p className="text-emerald-100/90 text-[11px] sm:text-xs sm:leading-relaxed max-w-xl line-clamp-1 sm:line-clamp-none">
            Panshop-da ən populyar mağazaların real kuponları, vaxtla məhdud flaş endirimlər və yaxınlaşan bayram alış-verişi günləri bir arada.
          </p>

          <div className="hidden sm:flex items-center gap-3 pt-0.5 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Real endirim faizləri
            </span>
            <span>•</span>
            <span>Rəsmi mağaza zəmanəti</span>
            <span>•</span>
            <span>Sürətli çatdırılma</span>
          </div>
        </div>

        {/* Right Column: Live Countdown */}
        {targetDate && nearestCampaign && (
          <div className="shrink-0 w-full lg:w-auto mt-0.5 sm:mt-0">
            {/* Mobile Compact Bar */}
            <div className="flex sm:hidden items-center justify-between gap-1.5 p-1.5 px-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-xs">
              <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                <span className="text-sm shrink-0">{nearestCampaign.emoji}</span>
                <span className="text-[10px] font-bold text-white truncate">
                  {nearestCampaign.title}
                </span>
              </div>
              <div className="shrink-0">
                <Countdown targetDate={targetDate} variant="card" />
              </div>
            </div>

            {/* Desktop Full Card */}
            <div className="hidden sm:block bg-emerald-950/70 border border-emerald-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-md space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-800/60 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{nearestCampaign.emoji}</span>
                  <div>
                    <span className="text-[9px] font-semibold text-emerald-300 tracking-wide block">
                      {isRunning ? 'ƏN YAXIN BİTƏN FÜRSƏT' : 'NÖVBƏTİ GÖZLƏNİLƏN HADİSƏ'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {nearestCampaign.title}
                    </span>
                  </div>
                </div>
              </div>

              <Countdown
                targetDate={targetDate}
                variant="hero"
                label={countdownLabel}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
