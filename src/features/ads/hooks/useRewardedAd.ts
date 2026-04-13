import { useEffect, useCallback, useRef, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AdUnitIds, ADS_CONFIG } from '@/shared/config';
import { usePremiumStore } from '../store/premium.store';

interface IUseRewardedAdOptions {
  /** Custom duration in ms. Defaults to ADS_CONFIG.REWARDED_PREMIUM_DURATION_MS */
  premiumDurationMs?: number;
  /** Additional callback after reward is earned */
  onRewarded?: () => void;
}

interface IUseRewardedAdReturn {
  show: () => void;
  isLoaded: boolean;
  isPremiumActive: boolean;
  remainingTimeMs: number;
}

/**
 * Hook for rewarded ads that grant timed premium access.
 *
 * On reward: grants premium for the configured duration.
 * Premium time stacks if already active (extends from current expiry).
 * Premium state persists across app restarts.
 */
export function useRewardedAd(
  options: IUseRewardedAdOptions = {},
): IUseRewardedAdReturn {
  const {
    premiumDurationMs = ADS_CONFIG.REWARDED_PREMIUM_DURATION_MS,
    onRewarded,
  } = options;

  const adRef = useRef<RewardedAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onRewardedRef = useRef(onRewarded);
  onRewardedRef.current = onRewarded;

  const grantPremium = usePremiumStore((s) => s.grantPremium);
  const isPremiumActive = usePremiumStore((s) => s.isPremiumActive());
  const remainingTimeMs = usePremiumStore((s) => s.remainingTimeMs());

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(AdUnitIds.REWARDED_PREMIUM);

    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsLoaded(true);
      },
    );

    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        grantPremium(premiumDurationMs);
        onRewardedRef.current?.();
      },
    );

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      // Pre-load next ad for quick availability
      ad.load();
    });

    ad.load();
    adRef.current = ad;

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
    };
  }, [grantPremium, premiumDurationMs]);

  const show = useCallback(() => {
    if (isLoaded && adRef.current) {
      adRef.current.show();
    }
  }, [isLoaded]);

  return { show, isLoaded, isPremiumActive, remainingTimeMs };
}
