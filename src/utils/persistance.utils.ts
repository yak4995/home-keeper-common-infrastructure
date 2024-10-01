import {
  FieldOperators,
  FilterCriteria,
  IPersistantEntity,
  ProjectionCriteria,
} from '@yak4995/home-keeper-core';

export function applyProjection<T extends IPersistantEntity>(
  projection: ProjectionCriteria<T>,
  value: T,
): Partial<T> {
  const projectionKeys = Object.keys(projection);
  if (projectionKeys.length === 0) {
    return value;
  }
  for (const key in value) {
    if (!projectionKeys.includes(key) || !projection[key]) {
      delete value[key];
    }
  }
  return value;
}

export function buildCriteriaForMicroOrm<T extends IPersistantEntity>(
  criteria: FilterCriteria<T>,
): Record<keyof T, unknown> {
  const query: Record<string, unknown> = {};

  for (const key in criteria) {
    const fieldCriteria = criteria[key as keyof T];
    if (fieldCriteria !== undefined) {
      query[key] = buildFieldOperatorsForMicroOrm(fieldCriteria) as Record<
        keyof T,
        unknown
      >;
    }
  }

  return query as Record<keyof T, unknown>;
}

export function buildFieldOperatorsForMicroOrm<T>(
  operators: FieldOperators<T>,
): Record<keyof T, unknown> {
  const operatorEntries: Record<string, unknown> = {};

  if ('$eq' in operators && operators.$eq !== undefined) {
    operatorEntries['$eq'] = operators.$eq;
  } else if ('$neq' in operators && operators.$neq !== undefined) {
    operatorEntries['$ne'] = operators.$neq;
  } else {
    const comparisonOps = [
      '$in',
      '$nin',
      '$lt',
      '$lte',
      '$gt',
      '$gte',
    ] as const;
    for (const op of comparisonOps) {
      if (op in operators && operators[op] !== undefined) {
        operatorEntries[op] = operators[op];
      }
    }
  }

  if ('$text' in operators && operators.$text !== undefined) {
    operatorEntries['$ilike'] = '%' + operators.$text + '%';
  }
  if ('$regex' in operators && operators.$regex !== undefined) {
    operatorEntries['$re'] = operators.$regex;
  }

  if ('$arrayIncludes' in operators && operators.$arrayIncludes !== undefined) {
    operatorEntries['$contains'] = [operators.$arrayIncludes];
  }
  if ('$arrayEq' in operators && operators.$arrayEq !== undefined) {
    operatorEntries['$contained'] = operators.$arrayEq;
  }
  if ('$arraySize' in operators && operators.$arraySize !== undefined) {
    operatorEntries['$size'] = operators.$arraySize;
  }

  return operatorEntries as Record<keyof T, unknown>;
}

export function buildProjectionForMicroOrm<T extends IPersistantEntity>(
  projection: ProjectionCriteria<T>,
): (keyof T)[] {
  const result = [];
  for (const key in projection) {
    if (projection[key]) result.push(key);
  }
  return result;
}
