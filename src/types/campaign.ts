export type CampaignSource = 'calendar' | 'flash_sale' | 'category_discount' | 'coupon' | 'admin';

export type CampaignStatus = 'running' | 'upcoming';

export type DiscountKind = 'percent' | 'upto_percent' | 'amount' | 'free_shipping';

export interface CampaignDiscount {
  kind: DiscountKind;
  value: number; // e.g. 15 for 15%, 10 for 10 AZN, 0 for free shipping
}

export interface Campaign {
  id: string;
  source: CampaignSource;
  status: CampaignStatus;
  title: string;
  description: string;
  emoji: string;
  badgeText?: string; // "Yeni", "Hot", "Xüsusi"
  image?: string; // çox vaxt boş → emoji + qradiyent fon
  gradientColor?: string; // "from-orange-500 to-red-500", "from-emerald-500 to-teal-700", etc.
  campaignStart?: string; // ISO date
  campaignEnd?: string; // ISO date
  eventDate?: string; // ISO date for holiday/single day event
  endsAt?: string; // ISO date
  daysLeft: number; // running → bitməsinə, upcoming → başlamasına neçə gün
  discount?: CampaignDiscount | null;
  discountText?: string;
  link: string; // /vendor-detail/<slug>, /deals, /products?category=<slug>
  storeName?: string; // yalnız kupon üçün
  storeSlug?: string;
  couponCode?: string; // yalnız kupon üçün, kopyalana bilsin
  minAmount?: string; // minimum səbət, kupon (məs: "40 ₼")
  itemCount?: number; // flaş satışda məhsul sayı
  isMovable?: boolean;
  estimated?: boolean; // tarix təxminidir (Ramazan, Qurban) → «Təxmini tarix» nişanı
  suggestedProducts?: string; // admin kampaniyasında vergüllə məhsul ideyaları
}

export interface CampaignCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  source?: CampaignSource;
}

export interface CampaignStats {
  totalCampaigns: number;
  maxDiscount: string; // e.g. "23%" or "—" if 0%
  totalCategories: number;
  activeDealsCount: number;
}

export interface PublicCampaignsResponse {
  campaigns: Campaign[];
  categories: CampaignCategory[];
  stats: CampaignStats;
}
