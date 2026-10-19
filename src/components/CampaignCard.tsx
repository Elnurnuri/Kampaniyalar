import { useState } from 'react';
import { Store, Calendar, ArrowRight, Clock, PackageCheck, AlertCircle, Sparkles, Bell, Share2 } from 'lucide-react';
import { Campaign } from '../types/campaign';
import { formatDateAz, formatDateRangeAz, formatDiscountLabel, getDaysLeftLabel } from '../utils/formatters.ts';
import { CouponCode } from './CouponCode';
import { Countdown } from './Countdown';
import { ShareModal } from './ShareModal';

export interface CampaignCardProps {
  campaign: Campaign;
  isReminded?: boolean;
  onCouponCopied?: (code: string) => void;
  onNavigate?: (link: string, title: string) => void;
  onToggleReminder?: (campaignId: string, title: string, targetDate?: string) => void;
  onShare?: (campaign: Campaign) => void;
}

export function CampaignCard({
  campaign,
  isReminded = false,
  onCouponCopied,
  onNavigate,
  onToggleReminder,
  onShare
}: CampaignCardProps) {
  const [internalShareOpen, setInternalShareOpen] = useState(false);

  const handleAction = () => {
    onNavigate?.(campaign.link, campaign.title);
  };

  const handleReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleReminder?.(campaign.id, campaign.title, campaign.campaignStart || campaign.eventDate);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(campaign);
    } else {
      setInternalShareOpen(true);
    }
  };

  const isUpcoming = campaign.status === 'upcoming';
  const discountLabel = formatDiscountLabel(campaign.discount);
  const daysLabel = getDaysLeftLabel(campaign.daysLeft, campaign.status);

  // Format date display
  const dateDisplay = campaign.eventDate
    ? formatDateAz(campaign.eventDate)
    : campaign.campaignStart && campaign.campaignEnd
    ? formatDateRangeAz(campaign.campaignStart, campaign.campaignEnd)
    : campaign.endsAt
    ? formatDateAz(campaign.endsAt)
    : '';

  // Render variant-specific content
  switch (campaign.source) {
    // ----------------------------------------------------
    // 1. BAYRAM VƏ TƏQVİM KARTI (Faiz YOXDUR!)
    // ----------------------------------------------------
    case 'calendar':
      return (
        <>
          <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700/60 h-full min-w-0 overflow-hidden">
            <div className="flex flex-col min-w-0 w-full">
              {/* Header: Visual Banner with Emoji (CLEAN - No buttons on top of image!) */}
              <div className={`relative h-14 sm:h-22 w-full rounded-lg sm:rounded-xl bg-gradient-to-r ${campaign.gradientColor || 'from-emerald-600/20 to-teal-800/20'} flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2.5 border border-slate-100 dark:border-slate-800/80 shrink-0`}>
                <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 select-none">
                  {campaign.emoji}
                </span>

                {/* Informational badges pinned to top right (tags only, no buttons) */}
                <div className="absolute top-1 right-1 flex items-center gap-0.5 sm:gap-1 max-w-[80%] shrink-0 pointer-events-none">
                  {campaign.estimated && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-amber-500 text-white shadow-xs whitespace-nowrap">
                      <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                      Təxmini
                    </span>
                  )}
                  {campaign.badgeText && (
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-xs truncate max-w-full">
                      {campaign.badgeText}
                    </span>
                  )}
                </div>
              </div>

              {/* Date info & Days left: Single Line */}
              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium min-w-0 w-full">
                <span className="flex items-center gap-1 min-w-0 flex-1 truncate">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{dateDisplay}</span>
                </span>
                <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[8px] sm:text-[10px] shrink-0 whitespace-nowrap">
                  {daysLabel}
                </span>
              </div>

              {/* Title: Strictly Single Line */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-0.5 truncate block w-full" title={campaign.title}>
                {campaign.title}
              </h3>

              {/* Description: Strictly Single Line */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate block w-full mb-1.5" title={campaign.description}>
                {campaign.description}
              </p>
            </div>

            {/* Action Buttons: Pinned to bottom (Fürsətlər + Xatırlat + Paylaş) */}
            <div className="pt-1.5 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 min-w-0 w-full">
              <button
                type="button"
                onClick={handleAction}
                className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 dark:text-slate-200 dark:hover:text-white transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
              >
                <span className="truncate">Fürsətlər</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
              <button
                type="button"
                onClick={handleReminder}
                aria-label={`${campaign.title} üçün xatırlat`}
                title={isReminded ? 'Xatırlatma aktivdir' : 'Xatırlatma qur'}
                className={`shrink-0 flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer ${
                  isReminded
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60'
                }`}
              >
                <Bell className={`w-3 h-3 shrink-0 ${isReminded ? 'fill-current' : ''}`} />
                <span className="hidden min-[360px]:inline truncate max-w-[55px] sm:max-w-none">{isReminded ? 'Qeyd' : 'Xatırlat'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label={`${campaign.title} kampaniyasını paylaş`}
                title="Kampaniyanı paylaş"
                className="shrink-0 flex items-center justify-center gap-0.5 px-1.5 sm:px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
              >
                <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline truncate">Paylaş</span>
              </button>
            </div>
          </article>
          {internalShareOpen && (
            <ShareModal
              campaign={campaign}
              isOpen={internalShareOpen}
              onClose={() => setInternalShareOpen(false)}
              onCopied={onCouponCopied}
            />
          )}
        </>
      );

    // ----------------------------------------------------
    // 2. FLAŞ SATIŞ KARTI
    // ----------------------------------------------------
    case 'flash_sale':
      return (
        <>
          <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-600/50 p-2 sm:p-3.5 shadow-xs hover:shadow-xl transition-all duration-300 h-full min-w-0 overflow-hidden">
            <div className="flex flex-col min-w-0 w-full">
              {/* Top row with status & discount badge (CLEAN - No buttons on top!) */}
              <div className="flex items-center justify-between gap-1 mb-1.5 min-w-0 w-full">
                <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                  <span className="text-base sm:text-xl p-0.5 sm:p-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 shrink-0">
                    {campaign.emoji}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 truncate">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    <span className="truncate">{campaign.badgeText || 'Flaş'}</span>
                  </span>
                </div>

                {discountLabel && (
                  <div className="shrink-0 px-1.5 py-0.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs font-extrabold text-[9px] sm:text-xs whitespace-nowrap">
                    {discountLabel}
                  </div>
                )}
              </div>

              {/* Title: Strictly Single Line */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug truncate block w-full mb-0.5" title={campaign.title}>
                {campaign.title}
              </h3>

              {/* Description: Strictly Single Line */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate block w-full mb-1.5" title={campaign.description}>
                {campaign.description}
              </p>

              {/* Product count & days badge: Single Line */}
              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs mb-1.5 min-w-0 w-full">
                {campaign.itemCount && (
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[8px] sm:text-[10px] shrink-0 whitespace-nowrap">
                    <PackageCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {campaign.itemCount} məhsul
                  </span>
                )}

                <span className="text-[9px] sm:text-[11px] font-semibold text-amber-700 dark:text-amber-400 shrink-0 whitespace-nowrap">
                  {daysLabel}
                </span>
              </div>

              {/* Embedded Live Countdown inside card */}
              {campaign.endsAt && (
                <div className="p-1 sm:p-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 mb-1 w-full min-w-0">
                  <Countdown
                    targetDate={campaign.endsAt}
                    variant="card"
                    label="Bitir"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons: Pinned to bottom */}
            <div className="pt-1.5 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 min-w-0 w-full">
              {isUpcoming ? (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Gözlənilir</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReminder}
                    className={`shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold min-h-[32px] sm:min-h-[38px] cursor-pointer ${
                      isReminded
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <Bell className={`w-3 h-3 shrink-0 ${isReminded ? 'fill-current' : ''}`} />
                    <span className="hidden min-[360px]:inline truncate">{isReminded ? 'Qeyd' : 'Xatırlat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} flaş təklifini paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Məhsullar ({campaign.itemCount || 0})</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} flaş təklifini paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </article>
          {internalShareOpen && (
            <ShareModal
              campaign={campaign}
              isOpen={internalShareOpen}
              onClose={() => setInternalShareOpen(false)}
              onCopied={onCouponCopied}
            />
          )}
        </>
      );

    // ----------------------------------------------------
    // 3. KATEQORİYA ENDİRİMİ KARTI
    // ----------------------------------------------------
    case 'category_discount':
      return (
        <>
          <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700/60 h-full min-w-0 overflow-hidden">
            <div className="flex flex-col min-w-0 w-full">
              {/* Header row (CLEAN - No buttons on top!) */}
              <div className="flex items-center justify-between gap-1 mb-1.5 min-w-0 w-full">
                <span className="text-base sm:text-xl p-0.5 sm:p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                  {campaign.emoji}
                </span>
                
                {discountLabel && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-extrabold bg-indigo-600 text-white shadow-xs shrink-0 whitespace-nowrap">
                    {discountLabel}
                  </span>
                )}
              </div>

              <div className="text-[9px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5 truncate block w-full">
                {campaign.badgeText || 'Kateqoriya Endirimi'}
              </div>

              {/* Title: Strictly Single Line */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-0.5 leading-snug truncate block w-full" title={campaign.title}>
                {campaign.title}
              </h3>

              {/* Description: Strictly Single Line */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate block w-full mb-1.5" title={campaign.description}>
                {campaign.description}
              </p>

              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 min-w-0 w-full">
                <span className="flex items-center gap-1 min-w-0 flex-1 truncate">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{dateDisplay}</span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[8px] sm:text-[10px] shrink-0 whitespace-nowrap">
                  {daysLabel}
                </span>
              </div>
            </div>

            {/* Action Buttons: Pinned to bottom */}
            <div className="pt-1.5 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 min-w-0 w-full">
              {isUpcoming ? (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-200 dark:hover:text-white min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Kateqoriya</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReminder}
                    className={`shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold min-h-[32px] sm:min-h-[38px] cursor-pointer ${
                      isReminded
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <Bell className={`w-3 h-3 shrink-0 ${isReminded ? 'fill-current' : ''}`} />
                    <span className="hidden min-[360px]:inline truncate">{isReminded ? 'Qeyd' : 'Xatırlat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} endirimini paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-200 dark:hover:text-white transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Kateqoriyaya bax</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} endirimini paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </article>
          {internalShareOpen && (
            <ShareModal
              campaign={campaign}
              isOpen={internalShareOpen}
              onClose={() => setInternalShareOpen(false)}
              onCopied={onCouponCopied}
            />
          )}
        </>
      );

    // ----------------------------------------------------
    // 4. MAĞAZA KUPONU KARTI
    // ----------------------------------------------------
    case 'coupon':
      return (
        <>
          <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400/60 dark:border-emerald-700/60 p-2 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 h-full min-w-0 overflow-hidden">
            <div className="flex flex-col min-w-0 w-full">
              {/* Header: Store Name & Store Icon + Discount Badge (CLEAN - No buttons on top!) */}
              <div className="flex items-center justify-between gap-1 mb-1.5 min-w-0 w-full">
                <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                  <div className="p-0.5 sm:p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <Store className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {campaign.storeName || 'Panshop'}
                  </span>
                </div>

                {discountLabel && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-black bg-emerald-600 text-white shadow-xs whitespace-nowrap">
                    {discountLabel}
                  </span>
                )}
              </div>

              {/* Title: Strictly Single Line */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-0.5 leading-snug truncate block w-full" title={campaign.title}>
                {campaign.title}
              </h3>

              {/* Description: Strictly Single Line */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate block w-full mb-1.5" title={campaign.description}>
                {campaign.description}
              </p>

              {/* Coupon Code copy section */}
              {campaign.couponCode && (
                <CouponCode
                  code={campaign.couponCode}
                  minAmount={campaign.minAmount}
                  onCopied={onCouponCopied}
                  className="mb-1.5"
                />
              )}

              <div className="flex items-center justify-between gap-1 text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1 min-w-0 w-full">
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">{daysLabel}</span>
                {campaign.endsAt && (
                  <span className="truncate">
                    Bitir: {dateDisplay}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Pinned to bottom */}
            <div className="pt-1.5 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 min-w-0 w-full">
              {isUpcoming ? (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-600 text-white min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Mağaza</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReminder}
                    className={`shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold min-h-[32px] sm:min-h-[38px] cursor-pointer ${
                      isReminded
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <Bell className={`w-3 h-3 shrink-0 ${isReminded ? 'fill-current' : ''}`} />
                    <span className="hidden min-[360px]:inline truncate">{isReminded ? 'Qeyd' : 'Xatırlat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} kuponunu paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Mağazaya keç</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} kuponunu paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </article>
          {internalShareOpen && (
            <ShareModal
              campaign={campaign}
              isOpen={internalShareOpen}
              onClose={() => setInternalShareOpen(false)}
              onCopied={onCouponCopied}
            />
          )}
        </>
      );

    // ----------------------------------------------------
    // 5. ADMİN XÜSUSİ KAMPANİYASI KARTI
    // ----------------------------------------------------
    case 'admin':
    default:
      return (
        <>
          <article className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700/60 h-full min-w-0 overflow-hidden">
            <div className="flex flex-col min-w-0 w-full">
              {/* Visual gradient banner with large emoji (CLEAN - No buttons on top of image!) */}
              <div className={`relative h-14 sm:h-22 w-full rounded-lg sm:rounded-xl bg-gradient-to-r ${campaign.gradientColor || 'from-blue-600/20 to-indigo-800/20'} flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2.5 border border-slate-100 dark:border-slate-800/80 shrink-0`}>
                <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 select-none">
                  {campaign.emoji}
                </span>

                {/* Informational badge top right (tag only, no buttons) */}
                {campaign.badgeText && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-rose-600 text-white shadow-xs shrink-0 whitespace-nowrap pointer-events-none">
                    {campaign.badgeText}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium min-w-0 w-full">
                <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-[8px] sm:text-[10px] truncate">
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">Panshop Seçimi</span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[8px] sm:text-[10px] shrink-0 whitespace-nowrap">
                  {daysLabel}
                </span>
              </div>

              {/* Title: Strictly Single Line */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5 leading-snug truncate block w-full" title={campaign.title}>
                {campaign.title}
              </h3>

              {/* Description: Strictly Single Line */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate block w-full mb-1.5" title={campaign.description}>
                {campaign.description}
              </p>

              {/* Suggested Products Tags: strictly 1 row, truncated cleanly */}
              {campaign.suggestedProducts && (
                <div className="flex items-center gap-1 mb-1 min-w-0 overflow-hidden w-full">
                  {campaign.suggestedProducts.split(',').slice(0, 2).map((prod, idx) => (
                    <span
                      key={idx}
                      className="px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[65px] sm:max-w-[80px]"
                    >
                      {prod.trim()}
                    </span>
                  ))}
                  {campaign.suggestedProducts.split(',').length > 2 && (
                    <span className="text-[8px] text-slate-400 shrink-0 font-medium">
                      +{campaign.suggestedProducts.split(',').length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons: Pinned to bottom */}
            <div className="pt-1.5 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 min-w-0 w-full">
              {isUpcoming ? (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-200 dark:hover:text-white min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Kolleksiya</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReminder}
                    className={`shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold min-h-[32px] sm:min-h-[38px] cursor-pointer ${
                      isReminded
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <Bell className={`w-3 h-3 shrink-0 ${isReminded ? 'fill-current' : ''}`} />
                    <span className="hidden min-[360px]:inline truncate">{isReminded ? 'Qeyd' : 'Xatırlat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} kampaniyasını paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 min-w-0 w-full">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-200 dark:hover:text-white transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <span className="truncate">Kolleksiyaya bax</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`${campaign.title} kampaniyasını paylaş`}
                    title="Kampaniyanı paylaş"
                    className="shrink-0 flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 transition-all duration-200 min-h-[32px] sm:min-h-[38px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </article>
          {internalShareOpen && (
            <ShareModal
              campaign={campaign}
              isOpen={internalShareOpen}
              onClose={() => setInternalShareOpen(false)}
              onCopied={onCouponCopied}
            />
          )}
        </>
      );
  }
}
