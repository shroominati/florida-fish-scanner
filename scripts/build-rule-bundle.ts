import { repository } from '../src/features/regulations/repository';

const summary = {
  generatedAt: new Date().toISOString(),
  speciesCount: repository.species.length,
  ruleCount: repository.rules.length,
  zoneCount: repository.zones.length,
  sourceCount: repository.dataSources.length,
  latestVersion: repository.ruleVersions[0]?.id
};

console.log(JSON.stringify(summary, null, 2));
