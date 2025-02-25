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

export function buildCriteriaForMicroOrm<T extends IPersistantEntity>(
  criteria: FilterCriteria<T>,
): Record<keyof T, unknown> {
  const query: Record<string, unknown> = {};

  for (const key in criteria) {
    const fieldCriteria = criteria[key as keyof T];
    if (fieldCriteria !== undefined) {
      query[key] = buildFieldOperatorsForMicroOrm(
        fieldCriteria as FieldOperators<T>,
      ) as Record<keyof T, unknown>;
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
  } else if ('id' in operators) {
    operatorEntries.id = operators.id['$eq'];
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
  populatedFields: (keyof T)[],
  outsideFields: (keyof T)[],
): { fields: (keyof T)[]; populate: (keyof T)[] } {
  let fields: (keyof T)[] = undefined;
  let populate: (keyof T)[] = undefined;

  const exclusiveProjection = Object.values(projection).includes(0);

  if (exclusiveProjection) {
    populate = [...populatedFields];
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
          if (!populate) populate = [];
          populate.push(key);
        }
      } else {
        if (!outsideFields.includes(key)) {
          if (!fields) fields = [];
          fields.push(key);
        }
      }
    }
  }

  return { fields, populate };
}
