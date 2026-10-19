import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Share2, Smartphone } from 'lucide-react';
import { Campaign } from '../types/campaign';
import { getCampaignShareData, isWebShareSupported, shareCampaign } from '../utils/share';
import { formatDiscountLabel } from '../utils/formatters';

interface ShareModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onCopied?: (code: string) => void;
}

export function ShareModal({ campaign, isOpen, onClose, onCopied }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset copied state when campaign changes
  useEffect(() => {
    setCopied(false);
  }, [campaign?.id]);

  if (!isOpen || !campaign) return null;

  const shareData = getCampaignShareData(campaign);
  const discountLabel = formatDiscountLabel(campaign.discount);
  const supportsNativeShare = isWebShareSupported();

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.fullUrl);
      } else {
        inputRef.current?.select();
        document.execCommand('copy');
      }
      setCopied(true);
      onCopied?.(`«${campaign.title}» linki kopyalandı!`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback select
      inputRef.current?.select();
    }
  };

  const handleNativeShare = async () => {
    const res = await shareCampaign(campaign);
    if (res.success) {
      onCopied?.(res.message);
      onClose();
    }
  };

  const handleSocialClick = (url: string, platformName: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    onCopied?.(`«${campaign.title}» ${platformName} ilə paylaşılır`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-2xl transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Fürsəti Paylaş
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Sosial şəbəkələrdə bölüşün və ya linki kopyalayın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Preview Capsule */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xl shrink-0">
            {campaign.emoji || '🎁'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {campaign.title}
              </span>
              {discountLabel && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white shrink-0">
                  {discountLabel}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {campaign.description || (campaign.storeName ? `${campaign.storeName} mağazasından fürsət` : 'Panshop.az kampaniyası')}
            </p>
          </div>
        </div>

        {/* Copy Link Input Section */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Kampaniya linki
          </label>
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={shareData.fullUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900/80 border border-emerald-200/80 dark:border-emerald-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Media Sharing Buttons */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sosial şəbəkələrdə paylaş
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => handleSocialClick(shareData.socialUrls.whatsapp, 'WhatsApp')}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              type="button"
              onClick={() => handleSocialClick(shareData.socialUrls.telegram, 'Telegram')}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.965z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Telegram</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialClick(shareData.socialUrls.facebook, 'Facebook')}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Facebook</span>
            </button>

            {/* X (Twitter) */}
            <button
              type="button"
              onClick={() => handleSocialClick(shareData.socialUrls.twitter, 'X (Twitter)')}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">X (Twitter)</span>
            </button>
          </div>

          {/* Native Web Share option for mobile browsers */}
          {supportsNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Digər tətbiqlərlə paylaş (Instagram, AirDrop və s.)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
