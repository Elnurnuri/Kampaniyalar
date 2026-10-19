import { useState, useEffect, useMemo, useCallback } from 'react';
import { CampaignHero } from './components/CampaignHero';
import { StatsStrip } from './components/StatsStrip';
import { CategoryTabs } from './components/CategoryTabs';
import { CampaignCard } from './components/CampaignCard';
import { EmptyState, SkeletonGrid } from './components/EmptyState';
import { NewsletterBlock } from './components/NewsletterBlock';
import { TopBar } from './components/TopBar';
import { Toast } from './components/Toast';
import { ShareModal } from './components/ShareModal';
import { fetchPublicCampaigns, MOCK_CAMPAIGNS, MOCK_CATEGORIES, MOCK_STATS } from './data/campaignsMock';
import { Campaign, CampaignCategory, CampaignStats } from './types/campaign';
import { getSavedReminderIds, toggleReminderInStorage } from './utils/reminders.ts';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('panshop_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('panshop_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('panshop_theme', 'light');
    }
  }, [isDark]);

  // Read initial category from URL
  const getInitialCategory = (): string => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) return cat;
    }
    return 'all';
  };

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(getInitialCategory);
  const [apiMode, setApiMode] = useState<'normal' | 'empty' | 'error'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<CampaignCategory[]>(MOCK_CATEGORIES);
  const [stats, setStats] = useState<CampaignStats>(MOCK_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Share Modal state
  const [shareModalCampaign, setShareModalCampaign] = useState<Campaign | null>(null);

  // Reminders state from localStorage
  const [remindedIds, setRemindedIds] = useState<string[]>(() => getSavedReminderIds());

  // Sync URL when category changes
  const handleSelectCategory = useCallback((slug: string) => {
    setActiveCategorySlug(slug);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (slug === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', slug);
      }
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category') || 'all';
      setActiveCategorySlug(cat);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Fetch campaigns from simulated API
  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchPublicCampaigns(activeCategorySlug, apiMode);
      setCampaigns(res.campaigns);
      setCategories(res.categories);
      setStats(res.stats);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Bilinməyən xəta baş verdi');
      }
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategorySlug, apiMode]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Compute category counts from the full mock list for consistent tab badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      if (cat.source) {
        counts[cat.slug] = MOCK_CAMPAIGNS.filter(c => c.source === cat.source).length;
      }
    }
    return counts;
  }, [categories]);

  // Filter campaigns by search query if any
  const displayedCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    const q = searchQuery.toLowerCase().trim();
    return campaigns.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.storeName && c.storeName.toLowerCase().includes(q)) ||
      (c.couponCode && c.couponCode.toLowerCase().includes(q)) ||
      (c.suggestedProducts && c.suggestedProducts.toLowerCase().includes(q))
    );
  }, [campaigns, searchQuery]);

  // Identify nearest campaign for the live countdown in Hero
  const nearestCampaign = useMemo(() => {
    if (!campaigns.length) return null;
    // Prefer running campaign with least days left
    const running = campaigns
      .filter(c => c.status === 'running' && (c.endsAt || c.campaignEnd))
      .sort((a, b) => a.daysLeft - b.daysLeft);
    if (running.length > 0) return running[0];

    // Otherwise upcoming campaign with least days left
    const upcoming = campaigns
      .filter(c => c.status === 'upcoming' && (c.eventDate || c.campaignStart))
      .sort((a, b) => a.daysLeft - b.daysLeft);
    return upcoming[0] || null;
  }, [campaigns]);

  const handleCouponCopied = (code: string) => {
    setToastMessage(`«${code}» kupon kodu kopyalandı!`);
  };

  const handleOpenShare = (campaign: Campaign) => {
    setShareModalCampaign(campaign);
  };

  const handleNavigate = (link: string, title: string) => {
    setToastMessage(`«${title}» səhifəsinə keçid edilir: ${link}`);
  };

  const handleToggleReminder = (campaignId: string, title: string, targetDate?: string) => {
    const { isReminded, updatedIds } = toggleReminderInStorage(campaignId, title, targetDate);
    setRemindedIds(updatedIds);

    if (isReminded) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission().catch(() => {});
        }
      }
      setToastMessage(`«${title}» başlamazdan əvvəl sizə xatırladılacaq!`);
    } else {
      setToastMessage(`«${title}» üçün xatırlatma ləğv edildi.`);
    }
  };

  const handleScrollToNewsletter = () => {
    const el = document.getElementById('newsletter-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Marketplace TopBar Context */}
      <TopBar
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        apiMode={apiMode}
        onSetApiMode={setApiMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-2.5 sm:py-6">
        {/* 1. Hero Section with Live Countdown */}
        <CampaignHero
          totalActive={stats.activeDealsCount}
          nearestCampaign={nearestCampaign}
        />

        {/* 2. Stats Strip with 4 Key Metrics */}
        <StatsStrip stats={stats} />

        {/* 3. Category Filter Tabs */}
        <CategoryTabs
          categories={categories}
          activeSlug={activeCategorySlug}
          counts={categoryCounts}
          totalCount={MOCK_CAMPAIGNS.length}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Campaigns Cards Grid / States */}
        {loading ? (
          <SkeletonGrid />
        ) : errorMessage ? (
          <EmptyState
            type="error"
            errorMessage={errorMessage}
            onRetry={loadCampaigns}
          />
        ) : displayedCampaigns.length === 0 ? (
          activeCategorySlug !== 'all' ? (
            <EmptyState
              type="category-empty"
              onResetCategory={() => handleSelectCategory('all')}
            />
          ) : (
            <EmptyState
              type="no-campaigns"
              onScrollToNewsletter={handleScrollToNewsletter}
            />
          )
        ) : (
          <div
            id={`panel-${activeCategorySlug}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategorySlug}`}
            className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-3 lg:gap-4"
          >
            {displayedCampaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                isReminded={remindedIds.includes(campaign.id)}
                onCouponCopied={handleCouponCopied}
                onNavigate={handleNavigate}
                onToggleReminder={handleToggleReminder}
                onShare={handleOpenShare}
              />
            ))}
          </div>
        )}

        {/* 5. Newsletter Subscription Block */}
        <NewsletterBlock />
      </main>

      {/* Social Share Modal */}
      <ShareModal
        campaign={shareModalCampaign}
        isOpen={Boolean(shareModalCampaign)}
        onClose={() => setShareModalCampaign(null)}
        onCopied={(msg) => setToastMessage(msg)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
