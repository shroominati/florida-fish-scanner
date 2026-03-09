import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedCatchRecord } from '../../types/domain';
import { normalizeSavedCatchRecords } from './catchRecordParser';

const STORAGE_KEY = 'florida-fish-scanner:saved-catches';

export async function loadSavedCatches(): Promise<SavedCatchRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return normalizeSavedCatchRecords(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveCatch(record: SavedCatchRecord): Promise<SavedCatchRecord[]> {
  const current = await loadSavedCatches();
  const next = normalizeSavedCatchRecords([record, ...current]).slice(0, 50);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
