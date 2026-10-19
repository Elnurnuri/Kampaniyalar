import { Campaign, CampaignCategory, CampaignStats, PublicCampaignsResponse } from '../types/campaign';

export const MOCK_CATEGORIES: CampaignCategory[] = [
  {
    id: 'cat-flash',
    name: 'Flaş satış',
    slug: 'flash-sale',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-600',
    source: 'flash_sale'
  },
  {
    id: 'cat-coupons',
    name: 'Mağaza kuponları',
    slug: 'coupons',
    icon: 'TicketPercent',
    color: 'from-emerald-500 to-teal-700',
    source: 'coupon'
  },
  {
    id: 'cat-category',
    name: 'Kateqoriya endirimləri',
    slug: 'category-discounts',
    icon: 'Percent',
    color: 'from-indigo-500 to-purple-600',
    source: 'category_discount'
  },
  {
    id: 'cat-calendar',
    name: 'Bayramlar & Təqvim',
    slug: 'holidays',
    icon: 'Calendar',
    color: 'from-rose-500 to-pink-600',
    source: 'calendar'
  },
  {
    id: 'cat-admin',
    name: 'Xüsusi kampaniyalar',
    slug: 'special',
    icon: 'Sparkles',
    color: 'from-blue-500 to-cyan-600',
    source: 'admin'
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  // 1. Flaş Satış: «Həftəsonu flaş», 23%-ə qədər, 6 məhsul, 2 gün qalıb
  {
    id: 'camp-flash-1',
    source: 'flash_sale',
    status: 'running',
    title: 'Həftəsonu flaş satışı',
    description: 'Seçilmiş elektronika və ev aksesuarlarına məhdud zamanlı flaş endirimlər.',
    emoji: '⚡',
    badgeText: 'Flaş Fürsət',
    gradientColor: 'from-amber-500/20 via-orange-500/15 to-amber-600/10',
    campaignStart: '2026-10-18T00:00:00+04:00',
    endsAt: '2026-10-21T23:59:59+04:00',
    daysLeft: 2,
    discount: {
      kind: 'upto_percent',
      value: 23
    },
    discountText: '23%-ə qədər',
    link: '/deals?type=flash',
    itemCount: 6
  },

  // 2. Kupon 1: «AYSU10», 10 ₼, Aysu Elektronika, min. 40 ₼, 7 gün qalıb
  {
    id: 'camp-coupon-1',
    source: 'coupon',
    status: 'running',
    title: 'Aysu Elektronika Kuponu',
    description: 'Qulaqlıqlar, adapterlər və mobil aksesuarlar üçün dərhal 10 ₼ qənaət.',
    emoji: '🎧',
    badgeText: 'Populyar',
    gradientColor: 'from-emerald-500/20 via-teal-500/15 to-emerald-700/10',
    storeName: 'Aysu Elektronika',
    storeSlug: 'aysu-elektronika',
    couponCode: 'AYSU10',
    minAmount: '40 ₼',
    campaignStart: '2026-10-15T00:00:00+04:00',
    endsAt: '2026-10-26T23:59:59+04:00',
    daysLeft: 7,
    discount: {
      kind: 'amount',
      value: 10
    },
    discountText: '10 ₼',
    link: '/vendor-detail/aysu-elektronika'
  },

  // 3. Kupon 2: «NERGIZ15», 15%, Nərgiz Ev Dünyası, 7 gün qalıb
  {
    id: 'camp-coupon-2',
    source: 'coupon',
    status: 'running',
    title: 'Nərgiz Ev Dünyası Endirimi',
    description: 'Bütün mətbəx dəstləri və dekorativ ev tekstilinə xüsusi mağaza güzəşti.',
    emoji: '🛋️',
    badgeText: 'Kupon',
    gradientColor: 'from-purple-500/20 via-pink-500/15 to-rose-600/10',
    storeName: 'Nərgiz Ev Dünyası',
    storeSlug: 'nergiz-ev-dunyasi',
    couponCode: 'NERGIZ15',
    campaignStart: '2026-10-15T00:00:00+04:00',
    endsAt: '2026-10-26T23:59:59+04:00',
    daysLeft: 7,
    discount: {
      kind: 'percent',
      value: 15
    },
    discountText: '15%',
    link: '/vendor-detail/nergiz-ev-dunyasi'
  },

  // 4. Kupon 3: Pulsuz çatdırılma kuponu
  {
    id: 'camp-coupon-3',
    source: 'coupon',
    status: 'running',
    title: 'Panshop Express Çatdırılma',
    description: 'Bakı və Abşeron ərazisinə kuryer çatdırılması tamamilə pulsuzdur.',
    emoji: '🚚',
    badgeText: 'Pulsuz Karqo',
    gradientColor: 'from-blue-500/20 via-cyan-500/15 to-indigo-600/10',
    storeName: 'Panshop Express',
    storeSlug: 'panshop-express',
    couponCode: 'PULSUZCATDIRILMA',
    minAmount: '25 ₼',
    campaignStart: '2026-10-17T00:00:00+04:00',
    endsAt: '2026-10-24T23:59:59+04:00',
    daysLeft: 5,
    discount: {
      kind: 'free_shipping',
      value: 0
    },
    discountText: 'Pulsuz çatdırılma',
    link: '/products?delivery=free'
  },

  // 5. Kateqoriya Endirimi: «Heyvanlar həftəsi», 12%-ə qədər
  {
    id: 'camp-cat-1',
    source: 'category_discount',
    status: 'running',
    title: 'Heyvanlar həftəsi',
    description: 'Ev heyvanları üçün qidalar, oyuncaqlar və qulluq vasitələrinə seçilmiş endirimlər.',
    emoji: '🐾',
    badgeText: 'Kateqoriya',
    gradientColor: 'from-teal-500/20 via-emerald-500/15 to-green-600/10',
    campaignStart: '2026-10-16T00:00:00+04:00',
    endsAt: '2026-10-25T23:59:59+04:00',
    daysLeft: 6,
    discount: {
      kind: 'upto_percent',
      value: 12
    },
    discountText: '12%-ə qədər',
    link: '/products?category=pet-supplies'
  },

  // 6. Bayram: Zəfər günü (8 noy) → upcoming, faizsiz
  {
    id: 'camp-cal-zefer',
    source: 'calendar',
    status: 'upcoming',
    title: 'Zəfər Günü',
    description: 'Qürur və qələbə bayramı münasibətilə mağazalar tərəfindən təqdim ediləcək xüsusi təkliflər.',
    emoji: '🇦🇿',
    badgeText: 'Dövlət Bayramı',
    gradientColor: 'from-red-500/25 via-emerald-500/20 to-sky-600/25',
    eventDate: '2026-11-08T00:00:00+04:00',
    campaignStart: '2026-11-08T00:00:00+04:00',
    endsAt: '2026-11-08T23:59:59+04:00',
    daysLeft: 20,
    discount: null, // QAYDA: Bayram kartlarında faiz YOXDUR!
    link: '/deals?event=zefer-gunu'
  },

  // 7. Bayram: Dövlət Bayrağı günü (9 noy) → upcoming, faizsiz
  {
    id: 'camp-cal-bayraq',
    source: 'calendar',
    status: 'upcoming',
    title: 'Dövlət Bayrağı Günü',
    description: 'Milli atributlar, kitablar və vətənpərvərlik kolleksiyalarına baxış.',
    emoji: '🌟',
    badgeText: 'Dövlət Bayramı',
    gradientColor: 'from-sky-500/25 via-red-500/20 to-emerald-600/25',
    eventDate: '2026-11-09T00:00:00+04:00',
    campaignStart: '2026-11-09T00:00:00+04:00',
    endsAt: '2026-11-09T23:59:59+04:00',
    daysLeft: 21,
    discount: null, // QAYDA: Bayram kartlarında faiz YOXDUR!
    link: '/deals?event=bayraq-gunu'
  },

  // 8. Bayram/Alış-veriş: Qara Cümə (27–30 noy) → upcoming, faizsiz
  {
    id: 'camp-cal-blackfriday',
    source: 'calendar',
    status: 'upcoming',
    title: 'Qara Cümə (Black Friday)',
    description: 'İlin ən böyük alış-veriş həyəcanı yaxınlaşır! Marketplace üzrə yüzlərlə mağaza qoşulacaq.',
    emoji: '🛍️',
    badgeText: 'Mövsümün Hadisəsi',
    gradientColor: 'from-slate-900/60 via-purple-950/40 to-slate-900/60',
    campaignStart: '2026-11-27T00:00:00+04:00',
    campaignEnd: '2026-11-30T23:59:59+04:00',
    endsAt: '2026-11-30T23:59:59+04:00',
    daysLeft: 39,
    discount: null, // QAYDA: faizsiz!
    link: '/deals?event=black-friday'
  },

  // 9. Bayram: Ramazan bayramı → estimated: true (faizsiz)
  {
    id: 'camp-cal-ramazan',
    source: 'calendar',
    status: 'upcoming',
    title: 'Ramazan Bayramı',
    description: 'Bərəkət və paylaşma bayramı üçün ərzaq səbətləri, xurma və hədiyyəlik bağlamalar.',
    emoji: '🌙',
    badgeText: 'Dini Bayram',
    gradientColor: 'from-amber-600/20 via-yellow-500/15 to-emerald-700/15',
    eventDate: '2027-03-10T00:00:00+04:00',
    campaignStart: '2027-03-10T00:00:00+04:00',
    endsAt: '2027-03-12T23:59:59+04:00',
    daysLeft: 142,
    estimated: true, // «Təxmini tarix» nişanı
    discount: null,
    link: '/deals?event=ramazan'
  },

  // 10. Admin Kampaniyası: Məktəb və Ofis ləvazimatları
  {
    id: 'camp-admin-1',
    source: 'admin',
    status: 'running',
    title: 'Ofis və Tədris Kolleksiyası',
    description: 'İş masanızı yeniləmək və gündəlik tədris məhsullarını sərfəli əldə etmək üçün tərtib edilmiş xüsusi seçimlər.',
    emoji: '📚',
    badgeText: 'Hot',
    gradientColor: 'from-blue-600/20 via-indigo-500/15 to-violet-700/15',
    campaignStart: '2026-10-10T00:00:00+04:00',
    endsAt: '2026-10-31T23:59:59+04:00',
    daysLeft: 12,
    discount: null,
    suggestedProducts: 'Dəftər, Qələm dəsti, Sırt çantası, Qələm qabı, Stolüstü lampa',
    link: '/products?collection=office-study'
  }
];

export const MOCK_STATS: CampaignStats = {
  totalCampaigns: MOCK_CAMPAIGNS.length,
  maxDiscount: '23%', // Real ən yüksək endirim: Həftəsonu flaş 23%
  totalCategories: MOCK_CATEGORIES.length,
  activeDealsCount: MOCK_CAMPAIGNS.filter(c => c.status === 'running').length
};

export const MOCK_RESPONSE: PublicCampaignsResponse = {
  campaigns: MOCK_CAMPAIGNS,
  categories: MOCK_CATEGORIES,
  stats: MOCK_STATS
};

export const EMPTY_RESPONSE: PublicCampaignsResponse = {
  campaigns: [],
  categories: MOCK_CATEGORIES,
  stats: {
    totalCampaigns: 0,
    maxDiscount: '—',
    totalCategories: MOCK_CATEGORIES.length,
    activeDealsCount: 0
  }
};

/**
 * Simulates fetching public campaigns from GET /marketing/api/public-campaigns/?lang=az&category=<slug>
 */
export async function fetchPublicCampaigns(
  categorySlug?: string,
  mode: 'normal' | 'empty' | 'error' = 'normal'
): Promise<PublicCampaignsResponse> {
  // Artificial slight network latency
  await new Promise(resolve => setTimeout(resolve, 250));

  if (mode === 'error') {
    throw new Error('Serverlə əlaqə qurularkən xəta baş verdi. Zəhmət olmasa internet bağlantınızı yoxlayın.');
  }

  if (mode === 'empty') {
    return EMPTY_RESPONSE;
  }

  let filtered = [...MOCK_CAMPAIGNS];

  if (categorySlug && categorySlug !== 'all') {
    const matchedCategory = MOCK_CATEGORIES.find(c => c.slug === categorySlug);
    if (matchedCategory && matchedCategory.source) {
      filtered = filtered.filter(c => c.source === matchedCategory.source);
    }
  }

  return {
    campaigns: filtered,
    categories: MOCK_CATEGORIES,
    stats: {
      ...MOCK_STATS,
      totalCampaigns: filtered.length
    }
  };
}
