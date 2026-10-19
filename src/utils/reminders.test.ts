import test from 'node:test';
import assert from 'node:assert/strict';
import { getSavedReminderIds, toggleReminderInStorage } from './reminders.ts';

// Mock storage implementation for node environment
class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length() {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

test('getSavedReminderIds returns empty array when empty or invalid', () => {
  const storage = new MockStorage();
  assert.deepEqual(getSavedReminderIds(storage), []);

  storage.setItem('panshop_campaign_reminders', 'invalid-json');
  assert.deepEqual(getSavedReminderIds(storage), []);
});

test('toggleReminderInStorage toggles campaign reminder on and off', () => {
  const storage = new MockStorage();

  // First toggle: add
  const first = toggleReminderInStorage('camp-cal-zefer', 'Zəfər Günü', '2026-11-08', storage);
  assert.equal(first.isReminded, true);
  assert.deepEqual(first.updatedIds, ['camp-cal-zefer']);
  assert.deepEqual(getSavedReminderIds(storage), ['camp-cal-zefer']);

  // Second toggle: remove
  const second = toggleReminderInStorage('camp-cal-zefer', 'Zəfər Günü', '2026-11-08', storage);
  assert.equal(second.isReminded, false);
  assert.deepEqual(second.updatedIds, []);
  assert.deepEqual(getSavedReminderIds(storage), []);
});
