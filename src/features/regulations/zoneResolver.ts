import type { DeviceLocation, RegulationZone, RuleRepository, WaterType } from '../../types/domain';

function inBounds(zone: RegulationZone, latitude: number, longitude: number): boolean {
  if (zone.geometryType !== 'bbox' || !zone.bounds) {
    return false;
  }

  return (
    latitude >= zone.bounds.minLat &&
    latitude <= zone.bounds.maxLat &&
    longitude >= zone.bounds.minLng &&
    longitude <= zone.bounds.maxLng
  );
}

export function resolveZoneFromLocation(
  repository: RuleRepository,
  waterType: WaterType,
  location?: DeviceLocation
): RegulationZone | undefined {
  if (!location) {
    return undefined;
  }

  return repository.zones
    .filter((zone) => zone.waterType === waterType && !zone.manualOnly)
    .filter((zone) => inBounds(zone, location.latitude, location.longitude))
    .sort((left, right) => right.priority - left.priority)[0];
}
