import * as Location from 'expo-location';

import type { DeviceLocation } from '../types/domain';

export async function requestCurrentLocation(): Promise<DeviceLocation | undefined> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return undefined;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracyM: position.coords.accuracy ?? undefined,
    capturedAt: new Date().toISOString(),
    source: 'gps'
  };
}
