import {
  ComparisonOperators,
  FieldOperators,
  ID,
  FilterCriteria,
  IPersistantEntity,
  ProjectionCriteria,
} from '@yak4995/home-keeper-core';

import type { FilterObject, ObjectQuery } from '@mikro-orm/core';

export function applyProjection<T extends IPersistantEntity>(
  projection: ProjectionCriteria<T>,
  value: T,
): Partial<T> {
  const projectionKeys = Object.keys(projection);

  if (projectionKeys.length === 0) {
    return value;
  }

  const inclusiveProjection = Object.values(projection).includes(1);

  for (const key in value) {
    if (
      (inclusiveProjection && !projectionKeys.includes(key)) ||
      projection[key] === 0
    ) {
      delete value[key];
    }
  }

  return value;
}

/** Maps core filter criteria to a MikroORM query at the persistence boundary. */
export function buildCriteriaForMicroOrm<T extends IPersistantEntity>(
  criteria: FilterCriteria<T>,
): FilterObject<T> {
  const query: Record<string, unknown> = {};

  for (const key in criteria) {
    const fieldCriteria = criteria[key];

    if (fieldCriteria !== undefined) {
      query[key] = buildFieldOperatorsForMicroOrm<T[typeof key]>(fieldCriteria);
    }
  }

  // Dynamic keys cannot be checked against MikroORM's conditional query type.
  // Keep the assertion inside the mapper; callers use the core criteria type.
  return query as FilterObject<T>;
}

/** Maps core field operators to MikroORM scalar or relation conditions. */
export function buildFieldOperatorsForMicroOrm<T>(
  operators: FieldOperators<T>,
): ObjectQuery<T> {
  const operatorEntries: Record<string, unknown> = {};

  if ('$eq' in operators && operators.$eq !== undefined) {
    operatorEntries['$eq'] = operators.$eq;
  } else if ('$neq' in operators && operators.$neq !== undefined) {
    operatorEntries['$ne'] = operators.$neq;
  } else if ('id' in operators) {
    const idCondition = operators.id as ComparisonOperators<ID>;
    operatorEntries.id =
      '$eq' in idCondition && idCondition.$eq !== undefined
        ? idCondition.$eq
        : buildFieldOperatorsForMicroOrm<ID>(idCondition);
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
    // Match MikroORM's RegExp normalization; $re itself accepts a string.
    operatorEntries['$re'] =
      operators.$regex instanceof RegExp
        ? `${operators.$regex.ignoreCase ? '(?i)' : ''}${operators.$regex.source}`
        : operators.$regex;
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

  // All operator renaming and relation conversion is contained in this mapper.
  return operatorEntries as ObjectQuery<T>;
}

export function buildProjectionForMicroOrm<T extends IPersistantEntity>(
  projection: ProjectionCriteria<T>,
  populatedFields: (keyof T)[],
  outsideFields: (keyof T)[],
): { fields: (keyof T)[]; populate: (keyof T)[] } {
  const exclusiveProjection = Object.values(projection).includes(0);
  const fields: (keyof T)[] = [];
  const populate: (keyof T)[] = exclusiveProjection ? [...populatedFields] : [];

  if (exclusiveProjection) {
    for (const key in projection) {
      if (projection[key] === 0 && populatedFields.includes(key)) {
        populate.splice(
          populate.findIndex((p) => key === p),
          1,
        );
      }
    }

    return { fields, populate };
  }

  for (const key in projection) {
    const value = projection[key];
    if (
      value === 1 ||
      (populatedFields.includes(key) && typeof value === 'object')
    ) {
      if (populatedFields.includes(key)) {
        if (!outsideFields.includes(key)) {
          populate.push(key);
        }
      } else {
        if (!outsideFields.includes(key)) {
          fields.push(key);
        }
      }
    }
  }

  return { fields, populate };
}
