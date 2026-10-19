import test from 'node:test';
import assert from 'node:assert/strict';
import { getCampaignShareData } from './share.ts';
import type { Campaign } from '../types/campaign.ts';

const mockCampaign: Campaign = {
  id: 'test-camp-1',
  title: 'Yaz Endirimi 2026',
  description: 'Seçilmiş geyim və aksessuarlara böyük endirimlər',
  source: 'category_discount',
  status: 'running',
  emoji: '🌸',
  discount: { kind: 'percent', value: 30 },
  daysLeft: 5,
  link: '/kampaniyalar/yaz-endirimi'
};

test('getCampaignShareData constructs complete URLs and social sharing parameters', () => {
  const data = getCampaignShareData(mockCampaign);

  assert.ok(data.fullUrl.includes('/kampaniyalar/yaz-endirimi'));
  assert.ok(data.fullUrl.includes('cid=test-camp-1'));
  assert.ok(data.shareTitle.includes('Yaz Endirimi 2026'));
  assert.ok(data.socialUrls.whatsapp.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(data.socialUrls.telegram.startsWith('https://t.me/share/url?'));
  assert.ok(data.socialUrls.facebook.startsWith('https://www.facebook.com/sharer/sharer.php?'));
  assert.ok(data.socialUrls.twitter.startsWith('https://twitter.com/intent/tweet?'));
});
