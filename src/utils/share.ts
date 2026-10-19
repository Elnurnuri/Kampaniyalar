import type { Campaign } from '../types/campaign.ts';

export interface ShareResult {
  success: boolean;
  method: 'share' | 'clipboard' | 'social';
  message: string;
}

export interface CampaignShareData {
  fullUrl: string;
  shareTitle: string;
  shareText: string;
  socialUrls: {
    whatsapp: string;
    telegram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

/**
 * Returns canonical full URL and text formatted for sharing a campaign deal.
 */
export function getCampaignShareData(campaign: Campaign): CampaignShareData {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://panshop.az';

  // Include campaign anchor/parameter for direct deep-linking
  const path = campaign.link.startsWith('/') ? campaign.link : `/${campaign.link}`;
  const fullUrl = `${origin}${path}${path.includes('?') ? '&' : '?'}ref=share&cid=${encodeURIComponent(campaign.id)}`;
  const shareTitle = `${campaign.title} — Panshop.az Kampaniyası`;
  
  // Format engaging description for social media
  const discountText = campaign.discount
    ? campaign.discount.kind === 'percent'
      ? `${campaign.discount.value}% endirimlə`
      : campaign.discount.kind === 'amount'
      ? `${campaign.discount.value} ₼ endirimlə`
      : 'xüsusi endirimlə'
    : '';

  const shareText = campaign.couponCode
    ? `🔥 ${campaign.title} (${discountText})! Kupon kodu: ${campaign.couponCode}. Panshop.az-da qaçırmayın:`
    : `🎉 ${campaign.title} ${discountText}! Panshop.az fürsətini kəşf edin:`;

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(shareText);

  return {
    fullUrl,
    shareTitle,
    shareText,
    socialUrls: {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
  };
}

/**
 * Checks whether native Web Share API is supported.
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Directly copies campaign deal link to clipboard.
 */
export async function copyCampaignLink(campaign: Campaign): Promise<ShareResult> {
  const { fullUrl } = getCampaignShareData(campaign);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fullUrl);
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = fullUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    return {
      success: true,
      method: 'clipboard',
      message: `«${campaign.title}» linki kopyalandı!`
    };
  } catch {
    return {
      success: false,
      method: 'clipboard',
      message: 'Linki kopyalamaq mümkün olmadı'
    };
  }
}

/**
 * Shares a campaign using Web Share API if supported, or copies the URL to clipboard.
 */
export async function shareCampaign(campaign: Campaign): Promise<ShareResult> {
  const { fullUrl, shareTitle, shareText } = getCampaignShareData(campaign);

  // Try Web Share API first if supported and available
  if (isWebShareSupported()) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: fullUrl
      });
      return {
        success: true,
        method: 'share',
        message: `«${campaign.title}» uğurla paylaşıldı!`
      };
    } catch (err) {
      // If user aborted / dismissed the native share sheet, do not fallback to copy or error
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          method: 'share',
          message: 'Paylaşım ləğv edildi'
        };
      }
      // Otherwise fall through to clipboard copy
    }
  }

  // Fallback: copy to clipboard
  return copyCampaignLink(campaign);
}
