import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatAzn,
  formatDateAz,
  formatDateRangeAz,
  formatDiscountLabel,
  getDaysLeftLabel,
  calculateTimeRemaining
} from './formatters.ts';

test('formatAzn formats integers and decimals with AZN symbol after number', () => {
  assert.equal(formatAzn(12.5), '12,50 ₼');
  assert.equal(formatAzn(40), '40 ₼');
  assert.equal(formatAzn(40, true), '40,00 ₼');
  assert.equal(formatAzn(0), '0 ₼');
});

test('formatDateAz formats ISO date to Azerbaijani abbreviated month in Asia/Baku timezone', () => {
  // 2026-11-27T12:00:00Z -> 27 noy 2026
  const formatted = formatDateAz('2026-11-27T12:00:00Z');
  assert.equal(formatted, '27 noy 2026');

  const victoryDay = formatDateAz('2026-11-08T08:00:00Z');
  assert.equal(victoryDay, '8 noy 2026');

  const flagDay = formatDateAz('2026-11-09T08:00:00Z');
  assert.equal(flagDay, '9 noy 2026');
});

test('formatDateRangeAz formats date range correctly', () => {
  const range = formatDateRangeAz('2026-11-27T00:00:00+04:00', '2026-11-30T23:59:59+04:00');
  assert.equal(range, '27–30 noy 2026');
});

test('formatDiscountLabel returns real discount strings and null for missing/calendar discounts', () => {
  assert.equal(formatDiscountLabel({ kind: 'percent', value: 15 }), '15%');
  assert.equal(formatDiscountLabel({ kind: 'upto_percent', value: 23 }), '23%-ə qədər');
  assert.equal(formatDiscountLabel({ kind: 'amount', value: 10 }), '10 ₼');
  assert.equal(formatDiscountLabel({ kind: 'free_shipping', value: 0 }), 'Pulsuz çatdırılma');
  assert.equal(formatDiscountLabel(null), null);
  assert.equal(formatDiscountLabel(undefined), null);
});

test('getDaysLeftLabel outputs appropriate Azerbaijani status text', () => {
  assert.equal(getDaysLeftLabel(7, 'running'), '7 gün qaldı');
  assert.equal(getDaysLeftLabel(1, 'running'), 'Son 1 gün qaldı');
  assert.equal(getDaysLeftLabel(0, 'running'), 'Bu gün bitir');

  assert.equal(getDaysLeftLabel(19, 'upcoming'), '19 gün sonra başlayır');
  assert.equal(getDaysLeftLabel(1, 'upcoming'), 'Sabah başlayır');
  assert.equal(getDaysLeftLabel(0, 'upcoming'), 'Bu gün başlayır');
});

test('calculateTimeRemaining returns remaining breakdown and handles expired dates', () => {
  const now = new Date('2026-10-19T12:00:00Z').getTime();
  const target = '2026-10-21T14:30:00Z'; // 2 days, 2 hours, 30 minutes later
  const res = calculateTimeRemaining(target, now);

  assert.equal(res.days, 2);
  assert.equal(res.hours, 2);
  assert.equal(res.minutes, 30);
  assert.equal(res.isExpired, false);

  const pastTarget = '2026-10-18T10:00:00Z';
  const expiredRes = calculateTimeRemaining(pastTarget, now);
  assert.equal(expiredRes.isExpired, true);
  assert.equal(expiredRes.days, 0);
});
