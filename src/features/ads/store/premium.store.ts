import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADS_CONFIG } from '@/shared/config';
import type { IPremiumState, IPersistedPremiumData } from '../types';

function getDefaultPremiumData(): IPersistedPremiumData {
  return {
    premiumExpiryTime: 0,
    totalRewardsEarned: 0,
  };
}

async function persistPremiumState(data: IPersistedPremiumData): Promise<void> {
  try {
    await AsyncStorage.setItem(
      ADS_CONFIG.STORAGE_KEYS.PREMIUM_STATE,
      JSON.stringify(data),
    );
  } catch {
    // Storage write failure is non-critical
  }
}

export const usePremiumStore = create<IPremiumState>((set, get) => ({
  ...getDefaultPremiumData(),
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(
        ADS_CONFIG.STORAGE_KEYS.PREMIUM_STATE,
      );
      if (raw) {
        const parsed = JSON.parse(raw) as IPersistedPremiumData;
        // If premium expired while app was closed, keep the expiry time
        // so checkAndExpire can properly transition
        set({
          premiumExpiryTime: parsed.premiumExpiryTime,
          totalRewardsEarned: parsed.totalRewardsEarned,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  isPremiumActive: () => {
    const { premiumExpiryTime } = get();
    return premiumExpiryTime > 0 && Date.now() < premiumExpiryTime;
  },

  remainingTimeMs: () => {
    const { premiumExpiryTime } = get();
    if (premiumExpiryTime <= 0) return 0;
    const remaining = premiumExpiryTime - Date.now();
    return remaining > 0 ? remaining : 0;
  },

  grantPremium: (durationMs: number) => {
    const { premiumExpiryTime, totalRewardsEarned } = get();
    const now = Date.now();
    // If already premium, extend from current expiry; otherwise from now
    const baseTime =
      premiumExpiryTime > 0 && premiumExpiryTime > now
        ? premiumExpiryTime
        : now;
    const newExpiry = baseTime + durationMs;
    const newTotal = totalRewardsEarned + 1;

    persistPremiumState({
      premiumExpiryTime: newExpiry,
      totalRewardsEarned: newTotal,
    });
    set({
      premiumExpiryTime: newExpiry,
      totalRewardsEarned: newTotal,
    });
  },

  expirePremium: () => {
    persistPremiumState({
      premiumExpiryTime: 0,
      totalRewardsEarned: get().totalRewardsEarned,
    });
    set({ premiumExpiryTime: 0 });
  },

  checkAndExpire: () => {
    const { premiumExpiryTime } = get();
    if (premiumExpiryTime > 0 && Date.now() >= premiumExpiryTime) {
      const { totalRewardsEarned } = get();
      persistPremiumState({ premiumExpiryTime: 0, totalRewardsEarned });
      set({ premiumExpiryTime: 0 });
      return true; // just expired
    }
    return false;
  },

  resetAll: () => {
    const defaults = getDefaultPremiumData();
    persistPremiumState(defaults);
    set(defaults);
  },
}));
