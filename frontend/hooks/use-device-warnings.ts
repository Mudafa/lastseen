import * as Battery from 'expo-battery';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const LOW_BATTERY_THRESHOLD = 0.2;

export function useDeviceWarnings() {
  const netInfo = useNetInfo();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [level, lowPower] = await Promise.all([
          Battery.getBatteryLevelAsync(),
          Battery.isLowPowerModeEnabledAsync(),
        ]);
        if (mounted) {
          setBatteryLevel(level);
          setLowPowerMode(lowPower);
        }
      } catch {
        if (mounted) {
          setBatteryLevel(null);
        }
      }
    };

    load();
    const interval = setInterval(load, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const isOffline = netInfo.isConnected === false;
  const isLowBattery =
    batteryLevel !== null && batteryLevel <= LOW_BATTERY_THRESHOLD;

  const warnings: string[] = [];
  if (isOffline) warnings.push('No internet connection');
  if (isLowBattery) warnings.push('Battery is low');
  if (lowPowerMode) warnings.push('Low power mode is on');

  return {
    warnings,
    isOffline,
    isLowBattery,
    batteryLevel,
    netInfo,
  };
}
