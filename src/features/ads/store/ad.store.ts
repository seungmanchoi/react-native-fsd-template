import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADS_CONFIG } from '@/shared/config';
import type { IAdState, IPersistedAdData } from '../types';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultPersistedData(): IPersistedAdData {
  return {
    actionCount: 0,
    lastInterstitialTime: 0,
    interstitialsToday: 0,
    lastDailyResetDate: getTodayDate(),
    appStartTime: Date.now(),
  };
}

async function persistAdState(data: IPersistedAdData): Promise<void> {
  try {
    await AsyncStorage.setItem(
      ADS_CONFIG.STORAGE_KEYS.AD_STATE,
      JSON.stringify(data),
    );
  } catch {
    // Storage write failure is non-critical
  }
}

export const useAdStore = create<IAdState>((set, get) => ({
  ...getDefaultPersistedData(),
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(ADS_CONFIG.STORAGE_KEYS.AD_STATE);
      if (raw) {
        const parsed = JSON.parse(raw) as IPersistedAdData;
        const today = getTodayDate();
        const needsReset = parsed.lastDailyResetDate !== today;

        set({
          actionCount: needsReset ? 0 : parsed.actionCount,
          lastInterstitialTime: needsReset ? 0 : parsed.lastInterstitialTime,
          interstitialsToday: needsReset ? 0 : parsed.interstitialsToday,
          lastDailyResetDate: today,
          appStartTime: Date.now(), // always fresh on app start
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true, appStartTime: Date.now() });
      }
    } catch {
      set({ isHydrated: true, appStartTime: Date.now() });
    }
  },

  incrementAction: () => {
    set((s) => {
      const next = { ...s, actionCount: s.actionCount + 1 };
      persistAdState(next);
      return { actionCount: next.actionCount };
    });
  },

  recordInterstitial: () => {
    set((s) => {
      const next = {
        ...s,
        lastInterstitialTime: Date.now(),
        interstitialsToday: s.interstitialsToday + 1,
        actionCount: 0,
      };
      persistAdState(next);
      return {
        lastInterstitialTime: next.lastInterstitialTime,
        interstitialsToday: next.interstitialsToday,
        actionCount: 0,
      };
    });
  },

  canShowInterstitial: () => {
    const {
      actionCount,
      lastInterstitialTime,
      interstitialsToday,
      appStartTime,
    } = get();
    const now = Date.now();

    if (now - appStartTime < ADS_CONFIG.FIRST_AD_DELAY_MS) return false;
    if (actionCount < ADS_CONFIG.INTERSTITIAL_INTERVAL) return false;
    if (now - lastInterstitialTime < ADS_CONFIG.INTERSTITIAL_COOLDOWN_MS)
      return false;
    if (interstitialsToday >= ADS_CONFIG.MAX_INTERSTITIALS_PER_DAY)
      return false;

    return true;
  },

  checkDailyReset: () => {
    const today = getTodayDate();
    const { lastDailyResetDate } = get();
    if (lastDailyResetDate !== today) {
      const state = get();
      const next = {
        ...state,
        interstitialsToday: 0,
        lastDailyResetDate: today,
        actionCount: 0,
        lastInterstitialTime: 0,
      };
      persistAdState(next);
      set({
        interstitialsToday: 0,
        lastDailyResetDate: today,
        actionCount: 0,
        lastInterstitialTime: 0,
      });
    }
  },

  resetDaily: () => {
    const state = get();
    const next = {
      ...state,
      interstitialsToday: 0,
      lastDailyResetDate: getTodayDate(),
    };
    persistAdState(next);
    set({ interstitialsToday: 0, lastDailyResetDate: getTodayDate() });
  },
}));
