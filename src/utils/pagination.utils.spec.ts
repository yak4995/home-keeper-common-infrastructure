import { describe, expect, it, vi } from 'vitest';
import { IListDto, IPersistantEntity } from '@yak4995/home-keeper-core';

import {
  BATCH_SIZE,
  batches,
  readPages,
  collectTree,
} from './pagination.utils';

interface Row extends IPersistantEntity {
  parentId?: string;
  scope: string;
}

function row(number: number, parentId?: string): Row {
  return {
    id: `00000000-0000-4000-8000-${number.toString(16).padStart(12, '0')}`,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    parentId,
    scope: 'keep',
  };
}

function page(rows: Row[], query: IListDto<Row>) {
  const cursor = query.filter?.id;
  const afterId = cursor && '$gt' in cursor ? cursor.$gt : undefined;
  const items = rows
    .filter(({ id }) => !afterId || id > afterId)
    .sort((left, right) => left.id.localeCompare(right.id))
    .slice(0, query.perPage);

  return {
    items,
    count: rows.length,
  };
}

describe('batches', () => {
  it('keeps the last short group and leaves the source unchanged', () => {
    const source = [1, 2, 3, 4, 5];
    const groups = [...batches(source, 2)];

    expect(groups).toEqual([[1, 2], [3, 4], [5]]);
    groups[0][0] = 99;
    expect(source).toEqual([1, 2, 3, 4, 5]);
    expect([...batches([])]).toEqual([]);
  });

  it.each([0, -1, 1.5, NaN, Infinity])('rejects invalid size %s', (size) => {
    expect(() => [...batches([1], size)]).toThrow(
      'Batch size must be a positive integer',
    );
  });
});

describe('readPages', () => {
  it('keeps the filter and reads every UUID when the caller removes earlier pages', async () => {
    const source = Array.from({ length: BATCH_SIZE * 2 + 1 }, (_, index) =>
      row(index),
    ).reverse();
    const remaining = new Map(source.map((item) => [item.id, item]));
    const read = vi.fn(async (query: IListDto<Row>) =>
      page([...remaining.values()], query),
    );
    const resultIds: string[] = [];

    for await (const items of readPages(read, {
      filter: {
        scope: { $eq: 'keep' },
      },
    })) {
      // Keep only IDs for the final test check.
      for (const item of items) {
        resultIds.push(item.id);
        remaining.delete(item.id);
      }
    }

    expect(resultIds).toEqual(source.map(({ id }) => id).sort());
    expect(remaining.size).toBe(0);
    expect(read).toHaveBeenCalledTimes(3);
    expect(
      read.mock.calls.every(
        ([query]) =>
          query.page === 1 &&
          query.perPage === BATCH_SIZE &&
          query.sort?.id === 'ASC',
      ),
    ).toBe(true);
    expect(read.mock.calls.every(([query]) => query.filter?.scope)).toBe(true);
  });

  it('stops on an empty page after an exact full page', async () => {
    const source = Array.from({ length: BATCH_SIZE }, (_, index) => row(index));
    const read = vi.fn(async (query: IListDto<Row>) => page(source, query));

    const pages = readPages(read, {});

    expect((await pages.next()).value).toHaveLength(BATCH_SIZE);
    expect((await pages.next()).done).toBe(true);
    expect(read).toHaveBeenCalledTimes(2);
  });

  it('rejects a repeated page instead of reading forever', async () => {
    const source = Array.from({ length: BATCH_SIZE }, (_, index) => row(index));
    const read = vi.fn(async () => ({ items: source, count: source.length }));

    const pages = readPages(read, {});

    await pages.next();
    await expect(pages.next()).rejects.toThrow('Page cursor did not advance');
    expect(read).toHaveBeenCalledTimes(2);
  });
});

describe('collectTree', () => {
  it('reads wide levels with small parent filters and puts parents before children', async () => {
    const root = row(0);
    const children = Array.from({ length: BATCH_SIZE + 1 }, (_, index) =>
      row(index + 1, root.id),
    );
    const grandchild = row(10000, children[0].id);
    const descendants = [...children, grandchild];
    const read = vi.fn(async (parentIds: string[], query: IListDto<Row>) =>
      page(
        descendants.filter(({ parentId }) => parentIds.includes(parentId)),
        query,
      ),
    );
    const result = await collectTree([root], read);

    expect(result).toEqual([root, ...children, grandchild]);
    expect(
      read.mock.calls.every(
        ([parentIds, query]) =>
          parentIds.length <= BATCH_SIZE && query.perPage === BATCH_SIZE,
      ),
    ).toBe(true);
    expect(
      read.mock.calls.some(([parentIds]) => parentIds.length === BATCH_SIZE),
    ).toBe(true);
  });

  it('rejects a cycle', async () => {
    const root = row(0);
    const read = vi.fn(async () => ({ items: [root], count: 1 }));

    await expect(collectTree([root], read)).rejects.toThrow(
      'Tree contains a repeated ID',
    );
    expect(read).toHaveBeenCalledOnce();
  });

  it('does not read when there are no roots', async () => {
    const read = vi.fn(async () => ({ items: [], count: 0 }));

    expect(await collectTree([], read)).toEqual([]);
    expect(read).not.toHaveBeenCalled();
  });
});
