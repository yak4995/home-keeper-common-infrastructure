import { ID } from '@yak4995/home-keeper-core';
import {
  buildCriteriaForMicroOrm,
  buildFieldOperatorsForMicroOrm,
} from './persistance.utils';

describe('buildFieldOperatorsForMicroOrm', () => {
  it('base check', () => {
    expect(buildFieldOperatorsForMicroOrm({ $eq: 1 })).toStrictEqual({
      $eq: 1,
    });
    expect(buildFieldOperatorsForMicroOrm({ $neq: 1 })).toStrictEqual({
      $ne: 1,
    });
    expect(
      buildFieldOperatorsForMicroOrm({
        $in: [1],
        $nin: [1],
        $lt: 1,
        $lte: 1,
        $gt: 1,
        $gte: 1,
      }),
    ).toStrictEqual({
      $gt: 1,
      $gte: 1,
      $in: [1],
      $lt: 1,
      $lte: 1,
      $nin: [1],
    });
  });

  it('text operators check', () => {
    expect(
      buildFieldOperatorsForMicroOrm<string>({
        $text: 'test',
        $regex: /test(a*)/g,
      }),
    ).toStrictEqual({
      $ilike: '%test%',
      $re: /test(a*)/g,
    });
  });

  it('array operators check', () => {
    expect(
      buildFieldOperatorsForMicroOrm<number[]>({
        $arrayIncludes: 1,
        $arrayEq: [1, 2],
        $arraySize: 2,
      }),
    ).toStrictEqual({
      $contains: [1],
      $contained: [1, 2],
      $size: 2,
    });
  });
});

describe('buildCriteriaForMicroOrm', () => {
  it('base check', () => {
    expect(
      buildCriteriaForMicroOrm<{
        id: ID;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        age: number;
      }>({
        name: { $regex: /test/g },
        age: { $gte: 18, $lte: 60 },
      }),
    ).toStrictEqual({
      age: {
        $gte: 18,
        $lte: 60,
      },
      name: {
        $re: /test/g,
      },
    });
  });
});
