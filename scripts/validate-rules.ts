import { repository } from '../src/features/regulations/repository';

const zoneIds = new Set(repository.zones.map((zone) => zone.id));
const speciesIds = new Set(repository.species.map((species) => species.id));
const versionIds = new Set(repository.ruleVersions.map((version) => version.id));

const errors: string[] = [];

for (const rule of repository.rules) {
  if (!zoneIds.has(rule.zoneId)) {
    errors.push(`Rule ${rule.id} references missing zone ${rule.zoneId}.`);
  }

  if (!speciesIds.has(rule.speciesId)) {
    errors.push(`Rule ${rule.id} references missing species ${rule.speciesId}.`);
  }

  if (!versionIds.has(rule.version)) {
    errors.push(`Rule ${rule.id} references missing rule version ${rule.version}.`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`Validated ${repository.rules.length} rules across ${repository.zones.length} zones.`);
