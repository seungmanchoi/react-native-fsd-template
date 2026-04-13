import { usePremiumStore } from '../store/premium.store';

interface IUsePremiumGuardReturn {
  isPremiumActive: boolean;
  premiumSecondsLeft: number;
  totalRewardsEarned: number;
}

/**
 * Lightweight hook for components that just need to check premium status.
 * Use this in feature screens to gate premium-only UI.
 */
export function usePremiumGuard(): IUsePremiumGuardReturn {
  const isPremiumActive = usePremiumStore((s) => s.isPremiumActive());
  const remainingMs = usePremiumStore((s) => s.remainingTimeMs());
  const totalRewardsEarned = usePremiumStore((s) => s.totalRewardsEarned);

  return {
    isPremiumActive,
    premiumSecondsLeft: Math.ceil(remainingMs / 1000),
    totalRewardsEarned,
  };
}
