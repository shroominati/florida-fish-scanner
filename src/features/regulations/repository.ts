import ruleVersions from '../../data/ruleVersions.json';
import rules from '../../data/regulationRules.json';
import sources from '../../data/sources.json';
import species from '../../data/species.json';
import zones from '../../data/zones.json';
import {
  parseDataSources,
  parseRuleVersions,
  parseRules,
  parseSpeciesCatalog,
  parseZones
} from './parsers';
import type {
  DataSource,
  RegulationRule,
  RegulationZone,
  RuleRepository,
  RuleVersion,
  Species
} from '../../types/domain';

export const repository: RuleRepository = {
  species: parseSpeciesCatalog(species),
  rules: parseRules(rules),
  zones: parseZones(zones),
  ruleVersions: parseRuleVersions(ruleVersions),
  dataSources: parseDataSources(sources)
};

export function getSpeciesById(speciesId: string): Species | undefined {
  return repository.species.find((item) => item.id === speciesId);
}

export function getZoneById(zoneId: string): RegulationZone | undefined {
  return repository.zones.find((item) => item.id === zoneId);
}

export function getRuleVersion(versionId: string): RuleVersion | undefined {
  return repository.ruleVersions.find((item) => item.id === versionId);
}

export function getSourceById(sourceId: string): DataSource | undefined {
  return repository.dataSources.find((item) => item.id === sourceId);
}

export function getRuleFreshness(versionId: string, asOfDate: string): {
  stale: boolean;
  warning: boolean;
  ageDays: number;
  ruleVersion?: RuleVersion;
} {
  const version = getRuleVersion(versionId);

  if (!version) {
    return { stale: true, warning: true, ageDays: Number.POSITIVE_INFINITY };
  }

  const publishedAt = new Date(`${version.publishedAt}T00:00:00Z`);
  const evaluatedAt = new Date(`${asOfDate}T00:00:00Z`);
  const ageDays = Math.max(
    0,
    Math.floor((evaluatedAt.getTime() - publishedAt.getTime()) / 86400000)
  );

  return {
    stale: ageDays > version.freshnessWindowDays,
    warning: ageDays > version.staleWarningThresholdDays,
    ageDays,
    ruleVersion: version
  };
}

export function getZoneAncestry(zoneId: string | undefined): string[] {
  if (!zoneId) {
    return [];
  }

  const ancestry: string[] = [];
  let current = getZoneById(zoneId);

  while (current) {
    ancestry.push(current.id);
    current = current.parentZoneId ? getZoneById(current.parentZoneId) : undefined;
  }

  return ancestry;
}
