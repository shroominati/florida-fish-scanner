import type {
  DataSource,
  RegulationRule,
  RegulationZone,
  RuleVersion,
  Species
} from '../../types/domain';

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function hasBounds(value: unknown): value is RegulationZone['bounds'] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return ['minLat', 'maxLat', 'minLng', 'maxLng'].every(
    (key) => typeof candidate[key] === 'number'
  );
}

export function parseSpeciesCatalog(input: unknown): Species[] {
  return asArray<Record<string, unknown>>(input).map((item, index) => ({
    id: asString(item.id, `species-${index}`),
    commonName: asString(item.commonName, `Species ${index + 1}`),
    scientificName: asString(item.scientificName),
    aliases: asArray<string>(item.aliases).filter((alias) => typeof alias === 'string'),
    waterTypes: asArray<Species['waterTypes'][number]>(item.waterTypes).filter(
      (waterType) => waterType === 'saltwater' || waterType === 'freshwater'
    ),
    confusionSpeciesIds: asArray<string>(item.confusionSpeciesIds).filter(
      (speciesId) => typeof speciesId === 'string'
    ),
    mvpPriority: asNumber(item.mvpPriority, index + 1),
    notes: asArray<string>(item.notes).filter((note) => typeof note === 'string')
  }));
}

export function parseDataSources(input: unknown): DataSource[] {
  return asArray<Record<string, unknown>>(input).map((item, index) => ({
    id: asString(item.id, `source-${index}`),
    label: asString(item.label, `Source ${index + 1}`),
    authority: asString(item.authority, 'Unknown authority'),
    type:
      item.type === 'official_federal' || item.type === 'secondary_cache' ? item.type : 'official',
    url: asString(item.url),
    lastVerifiedAt: asString(item.lastVerifiedAt, '1970-01-01'),
    notes: asArray<string>(item.notes).filter((note) => typeof note === 'string')
  }));
}

export function parseRuleVersions(input: unknown): RuleVersion[] {
  return asArray<Record<string, unknown>>(input).map((item, index) => {
    const publishedAt = asString(item.publishedAt, '1970-01-01');
    const freshnessWindowDays = asNumber(item.freshnessWindowDays, 90);

    return {
      id: asString(item.id, `version-${index}`),
      label: asString(item.label, `Rule version ${index + 1}`),
      publishedAt,
      freshnessWindowDays,
      staleWarningThresholdDays: asNumber(
        item.staleWarningThresholdDays,
        Math.max(7, Math.floor(freshnessWindowDays * 0.75))
      ),
      effectiveStart: asString(item.effectiveStart, publishedAt),
      effectiveEnd:
        item.effectiveEnd === null ? null : asString(item.effectiveEnd, null as unknown as string),
      updatedAt: asString(item.updatedAt, publishedAt),
      sourceIds: asArray<string>(item.sourceIds).filter((sourceId) => typeof sourceId === 'string'),
      notes: asArray<string>(item.notes).filter((note) => typeof note === 'string')
    };
  });
}

export function parseZones(input: unknown): RegulationZone[] {
  return asArray<Record<string, unknown>>(input).map((item, index) => ({
    id: asString(item.id, `zone-${index}`),
    name: asString(item.name, `Zone ${index + 1}`),
    waterType: item.waterType === 'freshwater' ? 'freshwater' : 'saltwater',
    region: asString(item.region, 'Florida'),
    priority: asNumber(item.priority, 0),
    parentZoneId:
      item.parentZoneId === null ? null : asString(item.parentZoneId, null as unknown as string),
    geometryType: item.geometryType === 'bbox' ? 'bbox' : null,
    bounds: hasBounds(item.bounds) ? item.bounds : undefined,
    manualOnly: asBoolean(item.manualOnly, false),
    notes: asArray<string>(item.notes).filter((note) => typeof note === 'string')
  }));
}

function parseSeasonWindows(input: unknown): RegulationRule['seasonWindows'] {
  return asArray<Record<string, unknown>>(input).map((item) => ({
    startMonthDay: asString(item.startMonthDay, '01-01'),
    endMonthDay: asString(item.endMonthDay, '12-31'),
    status: item.status === 'open' ? 'open' : 'closed',
    note: asString(item.note)
  }));
}

export function parseRules(input: unknown): RegulationRule[] {
  return asArray<Record<string, unknown>>(input).map((item, index) => {
    const effectiveStart = asString(item.effectiveStart, '1970-01-01');

    return {
      id: asString(item.id, `rule-${index}`),
      speciesId: asString(item.speciesId),
      jurisdiction: 'FL',
      waterType: item.waterType === 'freshwater' ? 'freshwater' : 'saltwater',
      zoneId: asString(item.zoneId),
      fishingModes: asArray<RegulationRule['fishingModes'][number]>(item.fishingModes).filter(
        (mode) =>
          mode === 'shore' ||
          mode === 'boat' ||
          mode === 'pier' ||
          mode === 'reef' ||
          mode === 'inland' ||
          mode === 'nearshore' ||
          mode === 'offshore' ||
          mode === 'federal'
      ),
      appliesInFederalWaters:
        item.appliesInFederalWaters === 'adjacent_federal' || item.appliesInFederalWaters === 'federal_only'
          ? item.appliesInFederalWaters
          : 'state_only',
      effectiveStart,
      effectiveEnd:
        item.effectiveEnd === null ? null : asString(item.effectiveEnd, null as unknown as string),
      minLengthIn: typeof item.minLengthIn === 'number' ? item.minLengthIn : undefined,
      maxLengthIn: typeof item.maxLengthIn === 'number' ? item.maxLengthIn : undefined,
      minLengthInclusive: typeof item.minLengthInclusive === 'boolean' ? item.minLengthInclusive : true,
      maxLengthInclusive: typeof item.maxLengthInclusive === 'boolean' ? item.maxLengthInclusive : true,
      slotOnly: typeof item.slotOnly === 'boolean' ? item.slotOnly : false,
      bagLimitPerPerson: typeof item.bagLimitPerPerson === 'number' ? item.bagLimitPerPerson : undefined,
      possessionLimit: typeof item.possessionLimit === 'number' ? item.possessionLimit : undefined,
      vesselLimit: typeof item.vesselLimit === 'number' ? item.vesselLimit : undefined,
      catchAndReleaseOnly:
        typeof item.catchAndReleaseOnly === 'boolean' ? item.catchAndReleaseOnly : false,
      allowOneOverMaxCount:
        typeof item.allowOneOverMaxCount === 'number' ? item.allowOneOverMaxCount : 0,
      seasonWindows: parseSeasonWindows(item.seasonWindows),
      specialNotes: asArray<string>(item.specialNotes).filter((note) => typeof note === 'string'),
      sourceType:
        item.sourceType === 'official_federal' || item.sourceType === 'secondary_cache'
          ? item.sourceType
          : 'official',
      sourceLabel: asString(item.sourceLabel, 'Unknown'),
      sourceUrl: asString(item.sourceUrl),
      sourceId: asString(item.sourceId),
      version: asString(item.version),
      updatedAt: asString(item.updatedAt, effectiveStart)
    };
  });
}
