import type { CampaignDiscount, CampaignStatus } from '../types/campaign.ts';

const AZ_MONTHS_SHORT = [
  'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
  'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'
];

/**
 * Formats a monetary amount into Azerbaijani Manat format:
 * Example: 12.5 -> "12,50 ₼", 40 -> "40 ₼" (or with decimals if needed).
 */
export function formatAzn(amount: number, forceDecimals = false): string {
  if (isNaN(amount)) return '0 ₼';
  
  const hasDecimals = amount % 1 !== 0 || forceDecimals;
  if (hasDecimals) {
    const formatted = amount.toFixed(2).replace('.', ',');
    return `${formatted} ₼`;
  }
  return `${amount} ₼`;
}

/**
 * Formats an ISO date string in Asia/Baku timezone as «27 noy 2026».
 */
export function formatDateAz(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  // Get parts in Asia/Baku timezone
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Baku',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  
  const parts = dtf.formatToParts(date);
  const day = parts.find(p => p.type === 'day')?.value ?? '';
  const monthNum = parseInt(parts.find(p => p.type === 'month')?.value ?? '1', 10);
  const year = parts.find(p => p.type === 'year')?.value ?? '';
  
  const monthName = AZ_MONTHS_SHORT[monthNum - 1] || '';
  return `${day} ${monthName} ${year}`;
}

/**
 * Formats a date range, e.g.:
 * «27–30 noy 2026» if same month & year, or «28 dek 2026 – 2 yan 2027».
 */
export function formatDateRangeAz(startInput: string | undefined, endInput: string | undefined): string {
  if (!startInput && !endInput) return '';
  if (!endInput) return formatDateAz(startInput);
  if (!startInput) return formatDateAz(endInput);

  const start = new Date(startInput);
  const end = new Date(endInput);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return formatDateAz(startInput) || formatDateAz(endInput);
  }

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Baku',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  const startParts = dtf.formatToParts(start);
  const endParts = dtf.formatToParts(end);

  const startDay = startParts.find(p => p.type === 'day')?.value;
  const startMonth = parseInt(startParts.find(p => p.type === 'month')?.value ?? '1', 10);
  const startYear = startParts.find(p => p.type === 'year')?.value;

  const endDay = endParts.find(p => p.type === 'day')?.value;
  const endMonth = parseInt(endParts.find(p => p.type === 'month')?.value ?? '1', 10);
  const endYear = endParts.find(p => p.type === 'year')?.value;

  if (startYear === endYear && startMonth === endMonth) {
    const monthName = AZ_MONTHS_SHORT[startMonth - 1];
    return `${startDay}–${endDay} ${monthName} ${startYear}`;
  }

  if (startYear === endYear) {
    const startMonthName = AZ_MONTHS_SHORT[startMonth - 1];
    const endMonthName = AZ_MONTHS_SHORT[endMonth - 1];
    return `${startDay} ${startMonthName} – ${endDay} ${endMonthName} ${startYear}`;
  }

  return `${formatDateAz(start)} – ${formatDateAz(end)}`;
}

/**
 * Generates human readable discount text strictly based on real data.
 * Returns null if no real discount exists (e.g. holiday cards).
 */
export function formatDiscountLabel(discount: CampaignDiscount | null | undefined): string | null {
  if (!discount) return null;

  switch (discount.kind) {
    case 'percent':
      return `${discount.value}%`;
    case 'upto_percent':
      return `${discount.value}%-ə qədər`;
    case 'amount':
      return `${formatAzn(discount.value)}`;
    case 'free_shipping':
      return 'Pulsuz çatdırılma';
    default:
      return null;
  }
}

/**
 * Calculates human readable days label according to campaign status.
 */
export function getDaysLeftLabel(daysLeft: number, status: CampaignStatus): string {
  if (status === 'running') {
    if (daysLeft <= 0) return 'Bu gün bitir';
    if (daysLeft === 1) return 'Son 1 gün qaldı';
    return `${daysLeft} gün qaldı`;
  } else {
    if (daysLeft <= 0) return 'Bu gün başlayır';
    if (daysLeft === 1) return 'Sabah başlayır';
    return `${daysLeft} gün sonra başlayır`;
  }
}

/**
 * Computes remaining time breakdown (days, hours, minutes, seconds)
 * between now and a target ISO date string in Asia/Baku.
 */
export interface TimeRemaining {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function calculateTimeRemaining(targetIsoDate: string, nowEpochMs: number = Date.now()): TimeRemaining {
  const targetTime = new Date(targetIsoDate).getTime();
  if (isNaN(targetTime)) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diffMs = targetTime - nowEpochMs;
  if (diffMs <= 0) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}
