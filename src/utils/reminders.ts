const STORAGE_KEY = 'panshop_campaign_reminders';

export interface StoredReminder {
  campaignId: string;
  campaignTitle: string;
  targetDate?: string;
  createdAt: string;
}

/**
 * Loads list of saved campaign IDs from localStorage.
 */
export function getSavedReminderIds(storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null): string[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item: string | StoredReminder) =>
        typeof item === 'string' ? item : item.campaignId
      );
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Toggles a campaign reminder status in storage.
 * Returns true if added, false if removed.
 */
export function toggleReminderInStorage(
  campaignId: string,
  campaignTitle: string,
  targetDate?: string,
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): { isReminded: boolean; updatedIds: string[] } {
  if (!storage) return { isReminded: false, updatedIds: [] };

  try {
    const currentIds = getSavedReminderIds(storage);
    const exists = currentIds.includes(campaignId);

    let nextIds: string[];
    let isReminded: boolean;

    if (exists) {
      nextIds = currentIds.filter(id => id !== campaignId);
      isReminded = false;
    } else {
      nextIds = [...currentIds, campaignId];
      isReminded = true;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    return { isReminded, updatedIds: nextIds };
  } catch {
    return { isReminded: false, updatedIds: [] };
  }
}
