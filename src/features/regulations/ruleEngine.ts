import {
  getRuleFreshness,
  getRuleVersion,
  getSpeciesById,
  getZoneAncestry,
  getZoneById,
  repository
} from './repository';
import { resolveZoneFromLocation } from './zoneResolver';
import type {
  CatchEvaluationInput,
  DecisionStatus,
  EvaluationSummary,
  LengthEvaluation,
  MatchedRule,
  RegulationRule,
  RegulationZone,
  RuleRepository
} from '../../types/domain';

const SPECIES_CONFIDENCE_THRESHOLD = 0.85;
const MEASUREMENT_CONFIDENCE_THRESHOLD = 0.75;

function toDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function isDateInRange(value: Date, start: string, end: string | null): boolean {
  const startDate = toDate(start);
  const endDate = end ? toDate(end) : undefined;
  return value >= startDate && (!endDate || value <= endDate);
}

function normalizeMonthDay(monthDay: string): number {
  const [month, day] = monthDay.split('-').map((part) => Number(part));
  return (month ?? 0) * 100 + (day ?? 0);
}

function isWithinAnnualWindow(requestDate: string, startMonthDay: string, endMonthDay: string): boolean {
  const request = new Date(`${requestDate}T00:00:00Z`);
  const requestValue = (request.getUTCMonth() + 1) * 100 + request.getUTCDate();
  const startValue = normalizeMonthDay(startMonthDay);
  const endValue = normalizeMonthDay(endMonthDay);

  if (startValue <= endValue) {
    return requestValue >= startValue && requestValue <= endValue;
  }

  return requestValue >= startValue || requestValue <= endValue;
}

function evaluateSeason(rule: RegulationRule, requestDate: string): {
  status: DecisionStatus;
  summary: string;
} {
  for (const window of rule.seasonWindows) {
    if (isWithinAnnualWindow(requestDate, window.startMonthDay, window.endMonthDay)) {
      if (window.status === 'closed') {
        return {
          status: 'ILLEGAL',
          summary: window.note
        };
      }
    }
  }

  if (rule.seasonWindows.length === 0) {
    return {
      status: 'LEGAL',
      summary: 'Season is open under the selected rule.'
    };
  }

  return {
    status: 'LEGAL',
    summary: 'Requested date is outside the configured closure windows.'
  };
}

function evaluateLength(rule: RegulationRule, input: CatchEvaluationInput): LengthEvaluation {
  const lowerBound = input.measurement.totalLengthIn - input.measurement.uncertaintyIn;
  const upperBound = input.measurement.totalLengthIn + input.measurement.uncertaintyIn;
  const minInclusive = rule.minLengthInclusive ?? true;
  const maxInclusive = rule.maxLengthInclusive ?? true;

  if (typeof rule.minLengthIn === 'number') {
    const clearlyBelowMin = minInclusive ? upperBound < rule.minLengthIn : upperBound <= rule.minLengthIn;
    const crossesMin = minInclusive ? lowerBound < rule.minLengthIn : lowerBound <= rule.minLengthIn;

    if (clearlyBelowMin) {
      return {
        status: 'ILLEGAL',
        explanation: `Fish is below the minimum allowed length of ${rule.minLengthIn} inches.`
      };
    }

    if (crossesMin) {
      return {
        status: 'UNCERTAIN',
        explanation: `Measurement band crosses the minimum length of ${rule.minLengthIn} inches.`
      };
    }
  }

  if (typeof rule.maxLengthIn === 'number') {
    const clearlyAboveMax = maxInclusive ? lowerBound > rule.maxLengthIn : lowerBound >= rule.maxLengthIn;
    const crossesMax = maxInclusive ? upperBound > rule.maxLengthIn : upperBound >= rule.maxLengthIn;

    if (rule.allowOneOverMaxCount && clearlyAboveMax) {
      const retainedExceptional = input.context.retainedOverMaxCount ?? 0;

      if (retainedExceptional < rule.allowOneOverMaxCount) {
        return {
          status: 'LEGAL',
          explanation: `Fish exceeds ${rule.maxLengthIn} inches but the rule allows ${rule.allowOneOverMaxCount} over-slot fish.`
        };
      }

      return {
        status: 'ILLEGAL',
        explanation: `Fish exceeds ${rule.maxLengthIn} inches and the angler already kept the allowed over-slot fish.`
      };
    }

    if (clearlyAboveMax) {
      return {
        status: 'ILLEGAL',
        explanation: `Fish is above the maximum allowed length of ${rule.maxLengthIn} inches.`
      };
    }

    if (crossesMax) {
      return {
        status: 'UNCERTAIN',
        explanation: `Measurement band crosses the maximum length of ${rule.maxLengthIn} inches.`
      };
    }
  }

  if (!rule.minLengthIn && !rule.maxLengthIn) {
    return {
      status: 'LEGAL',
      explanation: 'No explicit size restriction matched for the selected rule.'
    };
  }

  return {
    status: 'LEGAL',
    explanation: 'Measured length is inside the allowed range.'
  };
}

function evaluateBag(rule: RegulationRule, input: CatchEvaluationInput): {
  status: DecisionStatus;
  summary: string;
} {
  if (!rule.bagLimitPerPerson) {
    return {
      status: 'LEGAL',
      summary: 'No explicit daily bag limit stored in the matched rule.'
    };
  }

  if (input.context.retainedCount >= rule.bagLimitPerPerson) {
    return {
      status: 'ILLEGAL',
      summary: `Keeping this fish would exceed the bag limit of ${rule.bagLimitPerPerson}.`
    };
  }

  return {
    status: 'LEGAL',
    summary: `Bag limit: ${rule.bagLimitPerPerson} per person. Retained count before this fish: ${input.context.retainedCount}.`
  };
}

function resolveMatchedRule(
  repo: RuleRepository,
  input: CatchEvaluationInput
): { matchedRule?: MatchedRule; resolvedZone?: RegulationZone } {
  const resolvedZone =
    (input.context.manualZoneId ? getZoneById(input.context.manualZoneId) : undefined) ??
    resolveZoneFromLocation(repo, input.context.waterType, input.context.location);

  if (!resolvedZone) {
    return { matchedRule: undefined, resolvedZone: undefined };
  }

  const ancestry = getZoneAncestry(resolvedZone.id);
  const requestDate = toDate(input.context.requestDate);
  const wantsFederal = input.context.fishingMode === 'federal' || input.context.fishingMode === 'offshore';

  const candidates = repo.rules.filter((rule) => {
    if (rule.speciesId !== input.speciesId) {
      return false;
    }

    if (rule.waterType !== input.context.waterType) {
      return false;
    }

    if (!ancestry.includes(rule.zoneId)) {
      return false;
    }

    if (!rule.fishingModes.includes(input.context.fishingMode)) {
      return false;
    }

    if (wantsFederal && rule.appliesInFederalWaters === 'state_only') {
      return false;
    }

    if (!wantsFederal && rule.appliesInFederalWaters === 'federal_only') {
      return false;
    }

    return isDateInRange(requestDate, rule.effectiveStart, rule.effectiveEnd);
  });

  const sorted = candidates.sort((left, right) => {
    const leftZone = getZoneById(left.zoneId);
    const rightZone = getZoneById(right.zoneId);
    return (rightZone?.priority ?? 0) - (leftZone?.priority ?? 0);
  });

  const rule = sorted[0];

  if (!rule) {
    return { matchedRule: undefined, resolvedZone };
  }

  const zone = getZoneById(rule.zoneId);
  const ruleVersion = getRuleVersion(rule.version);

  if (!zone || !ruleVersion) {
    return { matchedRule: undefined, resolvedZone };
  }

  return {
    resolvedZone,
    matchedRule: {
      rule,
      zone,
      ruleVersion
    }
  };
}

export function evaluateCatchLegality(
  input: CatchEvaluationInput,
  repo: RuleRepository = repository
): EvaluationSummary {
  const species = getSpeciesById(input.speciesId);
  const trace: EvaluationSummary['trace'] = [];
  const reasons: string[] = [];
  const notes: string[] = [];

  trace.push({
    title: 'Species',
    detail: species
      ? `${species.commonName} selected at ${(input.speciesConfidence * 100).toFixed(0)}% confidence.`
      : `${input.speciesId} selected at ${(input.speciesConfidence * 100).toFixed(0)}% confidence.`
  });

  trace.push({
    title: 'Measurement',
    detail: `${input.measurement.totalLengthIn.toFixed(1)} in +/- ${input.measurement.uncertaintyIn.toFixed(1)} in (${input.measurement.method}${input.measurement.userAdjusted ? ', user-adjusted' : ''}).`
  });

  if (!input.speciesConfirmed && input.speciesConfidence < SPECIES_CONFIDENCE_THRESHOLD) {
    reasons.push('Species confidence is below the harvest-decision threshold.');
  }

  if (!input.measurement.userAdjusted && input.measurement.confidence < MEASUREMENT_CONFIDENCE_THRESHOLD) {
    reasons.push('Measurement confidence is below the harvest-decision threshold.');
  }

  const { matchedRule, resolvedZone } = resolveMatchedRule(repo, input);

  if (!resolvedZone) {
    reasons.push('No regulation zone could be determined from GPS or manual selection.');
  } else {
    trace.push({
      title: 'Zone',
      detail: `Matched zone: ${resolvedZone.name}.`
    });
  }

  if (!matchedRule) {
    reasons.push('No active regulation rule bundle matched the selected species, zone, date, and fishing mode.');
  }

  if (reasons.length > 0 && !matchedRule) {
    return {
      status: 'UNCERTAIN',
      confidenceLabel: 'low',
      staleData: true,
      zone: resolvedZone,
      reasons,
      trace,
      notes,
      disclaimer: 'Verify before harvest. The app does not have enough rule context for a reliable answer.'
    };
  }

  const activeRule = matchedRule as MatchedRule;
  const freshness = getRuleFreshness(activeRule.rule.version, input.context.requestDate);
  const staleData = freshness.stale;

  trace.push({
    title: 'Rule Version',
    detail: `${activeRule.ruleVersion.label} (${activeRule.rule.version}) published ${activeRule.ruleVersion.publishedAt}.`,
    sourceUrl: activeRule.rule.sourceUrl
  });

  if (staleData) {
    reasons.push('The cached regulation bundle is older than the configured freshness window.');
  } else if (freshness.warning) {
    notes.push('The cached regulation bundle is approaching its stale threshold. Verify current FWC/NOAA updates before harvest.');
  }

  const season = evaluateSeason(activeRule.rule, input.context.requestDate);
  const length = evaluateLength(activeRule.rule, input);
  const bag = evaluateBag(activeRule.rule, input);

  trace.push({ title: 'Season', detail: season.summary });
  trace.push({ title: 'Length', detail: length.explanation });
  trace.push({ title: 'Bag', detail: bag.summary });
  trace.push({
    title: 'Rule Logic',
    detail: `Applied ${activeRule.rule.sourceLabel} rule for ${activeRule.zone.name} with effective window ${activeRule.rule.effectiveStart} through ${activeRule.rule.effectiveEnd ?? 'open-ended'}.`,
    sourceUrl: activeRule.rule.sourceUrl
  });

  if (activeRule.rule.specialNotes.length > 0) {
    notes.push(...activeRule.rule.specialNotes);
  }

  if (activeRule.rule.catchAndReleaseOnly) {
    reasons.push('This species is catch-and-release only under the matched rule.');
  }

  const statuses: DecisionStatus[] = [
    season.status,
    length.status,
    bag.status,
    reasons.length > 0 ? 'UNCERTAIN' : 'LEGAL'
  ];

  const confidenceLabel =
    input.speciesConfirmed || input.measurement.userAdjusted
      ? 'high'
      : input.speciesConfidence >= 0.9 && input.measurement.confidence >= 0.85
        ? 'high'
        : 'medium';

  let status: DecisionStatus = 'LEGAL';

  if (statuses.includes('ILLEGAL')) {
    status = 'ILLEGAL';
  } else if (statuses.includes('UNCERTAIN')) {
    status = 'UNCERTAIN';
  }

  if (
    !input.speciesConfirmed &&
    input.speciesConfidence < SPECIES_CONFIDENCE_THRESHOLD
  ) {
    status = 'UNCERTAIN';
  }

  if (
    !input.measurement.userAdjusted &&
    input.measurement.confidence < MEASUREMENT_CONFIDENCE_THRESHOLD
  ) {
    status = 'UNCERTAIN';
  }

  if (activeRule.rule.catchAndReleaseOnly) {
    status = 'ILLEGAL';
  }

  const resultReasons =
    status === 'LEGAL'
      ? [
          'Species confidence meets threshold or the species was manually confirmed.',
          'Measurement confidence is adequate or the measurement was manually adjusted.',
          'A current rule bundle matched the selected place, date, and fishing context.'
        ]
      : reasons;

  return {
    status,
    confidenceLabel,
    matchedRule: activeRule,
    zone: resolvedZone,
    staleData,
    reasons: resultReasons,
    trace,
    bagLimitSummary: bag.summary,
    seasonSummary: season.summary,
    ruleLogicSummary: [
      season.summary,
      length.explanation,
      bag.summary,
      `Rule source: ${activeRule.rule.sourceLabel}.`
    ],
    notes,
    disclaimer:
      status === 'UNCERTAIN'
        ? 'Verify before harvest. The app cannot determine legality with enough confidence.'
        : input.speciesConfidence < 0.9 || input.measurement.confidence < 0.85
          ? 'Verify before harvest if the fish is close to the limit or if the photo was difficult.'
          : undefined
  };
}
