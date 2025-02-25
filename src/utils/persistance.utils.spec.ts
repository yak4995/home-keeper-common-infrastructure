import { ID, IHousehold, ITimezone } from '@yak4995/home-keeper-core';

import {
  applyProjection,
  buildCriteriaForMicroOrm,
  buildFieldOperatorsForMicroOrm,
  buildProjectionForMicroOrm,
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
        tz: ITimezone;
      }>({
        name: { $regex: /test/g },
        age: { $gte: 18, $lte: 60 },
        tz: { id: { $eq: 'some-id' } },
      }),
    ).toStrictEqual({
      age: {
        $gte: 18,
        $lte: 60,
      },
      name: {
        $re: /test/g,
      },
      tz: { id: 'some-id' },
    });
  });
});

describe('buildProjectionForMicroOrm', () => {
  it('all fields are empty', () => {
    expect(
      buildProjectionForMicroOrm<IHousehold>(
        {},
        [
          'accounts',
          'budgets',
          'invitations',
          'members',
          'transactionCategories',
        ],
        [],
      ),
    ).toStrictEqual({ fields: undefined, populate: undefined });
  });

  it('all fields are set to 0 and no ones are in populate', () => {
    expect(
      buildProjectionForMicroOrm<IHousehold>(
        { isOwn: 0, name: 0 },
        [
          'accounts',
          'budgets',
          'invitations',
          'members',
          'transactionCategories',
        ],
        [],
      ),
    ).toStrictEqual({
      fields: undefined,
      populate: [
        'accounts',
        'budgets',
        'invitations',
        'members',
        'transactionCategories',
      ],
    });
  });

  it('all fields are set to 0 and some ones are in populate', () => {
    expect(
      buildProjectionForMicroOrm<IHousehold>(
        { isOwn: 0, name: 0, accounts: 0, budgets: 0 },
        ['invitations', 'members', 'transactionCategories'],
        [],
      ),
    ).toStrictEqual({
      fields: undefined,
      populate: ['invitations', 'members', 'transactionCategories'],
    });
  });

  it('all fields are set to 1', () => {
    expect(
      buildProjectionForMicroOrm<IHousehold>(
        { isOwn: 1, name: 1, accounts: { owner: 1 }, budgets: 1 },
        [
          'accounts',
          'budgets',
          'invitations',
          'members',
          'transactionCategories',
        ],
        [],
      ),
    ).toStrictEqual({
      fields: ['isOwn', 'name'],
      populate: ['accounts', 'budgets'],
    });
  });

  it('fields are set to 0 and 1 both', () => {
    expect(
      buildProjectionForMicroOrm<IHousehold>(
        { isOwn: 0, name: 1, accounts: 0, budgets: 1 },
        [
          'accounts',
          'budgets',
          'invitations',
          'members',
          'transactionCategories',
        ],
        [],
      ),
    ).toStrictEqual({
      fields: undefined,
      populate: ['budgets', 'invitations', 'members', 'transactionCategories'],
    });
  });
});

describe('applyProjection', () => {
  it('with empty projection', () => {
    expect(
      applyProjection<IHousehold>({}, {
        name: 'test',
        isOwn: false,
        members: [],
      } as IHousehold),
    ).toStrictEqual({ name: 'test', isOwn: false, members: [] });
  });

  it('with all fields are 0', () => {
    expect(
      applyProjection<IHousehold>({ name: 0, members: 0 }, {
        name: 'test',
        isOwn: false,
        members: [],
      } as IHousehold),
    ).toStrictEqual({ isOwn: false });
  });

  it('with all fields are 1', () => {
    expect(
      applyProjection<IHousehold>({ name: 1, members: 1 }, {
        name: 'test',
        isOwn: false,
        members: [],
      } as IHousehold),
    ).toStrictEqual({ name: 'test', members: [] });
  });

  it('with fields are 0 and 1 both', () => {
    expect(
      applyProjection<IHousehold>({ name: 0, members: 1 }, {
        name: 'test',
        isOwn: false,
        members: [],
      } as IHousehold),
    ).toStrictEqual({
      members: [],
    });
  });
});
