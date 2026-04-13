import { useEffect, useCallback, useRef } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AdUnitIds } from '@/shared/config';
import { useAdStore } from '../store/ad.store';
import { usePremiumStore } from '../store/premium.store';

/**
 * Hook for interstitial ads with cooldown + premium skip.
 *
 * - Skips ad display entirely while premium is active.
 * - Still counts actions so ads resume immediately when premium expires.
 * - Respects all cooldown/daily limits from useAdStore.
 */
export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const isLoadedRef = useRef(false);
  const { canShowInterstitial, recordInterstitial, incrementAction } =
    useAdStore();
  const isPremiumActive = usePremiumStore((s) => s.isPremiumActive);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(
      AdUnitIds.INTERSTITIAL_AFTER_ACTION,
    );

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      isLoadedRef.current = true;
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoadedRef.current = false;
      ad.load();
    });

    ad.load();
    adRef.current = ad;

    return () => {
      unsubLoaded();
      unsubClosed();
    };
  }, []);

  const showAfterAction = useCallback(() => {
    incrementAction();

    // Skip interstitial if user has active premium
    if (isPremiumActive()) return;

    if (canShowInterstitial() && isLoadedRef.current && adRef.current) {
      adRef.current.show();
      recordInterstitial();
    }
  }, [canShowInterstitial, recordInterstitial, incrementAction, isPremiumActive]);

  return { showAfterAction };
}
