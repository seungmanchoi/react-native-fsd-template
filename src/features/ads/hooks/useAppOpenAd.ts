import { useEffect, useCallback, useRef } from 'react';
import {
  AppOpenAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AdUnitIds } from '@/shared/config';
import { useAppState } from '@/shared/lib/hooks';
import { usePremiumStore } from '../store/premium.store';

/**
 * Hook for App Open ads shown when the app returns to foreground.
 *
 * - Skips display if premium is active.
 * - Only shows if the ad is loaded and app was backgrounded > 30s.
 * - Auto-loads next ad after close.
 */
export function useAppOpenAd() {
  const adRef = useRef<AppOpenAd | null>(null);
  const isLoadedRef = useRef(false);
  const backgroundTimeRef = useRef(0);
  const isPremiumActive = usePremiumStore((s) => s.isPremiumActive);

  useEffect(() => {
    const ad = AppOpenAd.createForAdRequest(AdUnitIds.APP_OPEN);

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

  const handleForeground = useCallback(() => {
    const backgroundDuration = Date.now() - backgroundTimeRef.current;
    // Only show if backgrounded for at least 30 seconds
    if (backgroundDuration < 30_000) return;
    if (isPremiumActive()) return;
    if (isLoadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, [isPremiumActive]);

  const handleBackground = useCallback(() => {
    backgroundTimeRef.current = Date.now();
  }, []);

  useAppState(handleForeground, handleBackground);
}
