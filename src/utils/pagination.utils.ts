import {
  IListDto,
  IPersistantEntity,
  ListResponse,
} from '@yak4995/home-keeper-core';

export const BATCH_SIZE = 500;

// Split items into small groups
export function* batches<T>(
  items: readonly T[],
  size = BATCH_SIZE,
): Generator<T[]> {
  if (!Number.isInteger(size) || size < 1) {
    throw new Error('Batch size must be a positive integer');
  }

  for (let offset = 0; offset < items.length; offset += size) {
    yield items.slice(offset, offset + size);
  }
}

export async function* readPages<T extends IPersistantEntity>(
  read: (query: IListDto<T>) => Promise<object>,
  query: IListDto<T>,
): AsyncGenerator<T[]> {
  let afterId: string | undefined;

  // Use ID order, so removing rows does not move the next page.
  while (true) {
    const { items } = (await read({
      ...query,
      filter: {
        ...query.filter,
        ...(afterId ? { id: { $gt: afterId } } : {}),
      },
      sort: { id: 'ASC' },
      page: 1,
      perPage: BATCH_SIZE,
    })) as ListResponse<T>;

    if (!items.length) {
      return;
    }

    const lastId = items[items.length - 1].id;

    // Stop a broken reader before it repeats a page.
    if (afterId && lastId <= afterId) {
      throw new Error('Page cursor did not advance');
    }

    yield items;

    if (items.length < BATCH_SIZE) {
      return;
    }

    afterId = lastId;
  }
}

// Read a tree by level. Roots are saved rows; read finds children for a group of parents.
export async function collectTree<T extends IPersistantEntity>(
  roots: T[],
  read: (parentIds: string[], query: IListDto<T>) => Promise<object>,
): Promise<T[]> {
  const result = [...roots];
  const seen = new Set(roots.map(({ id }) => id));
  let parentIds = roots.map(({ id }) => id);

  // Read the next level while there are parents.
  while (parentIds.length) {
    const nextIds: string[] = [];

    // Keep both the parent filter and the result page small.
    for (const ids of batches(parentIds)) {
      for await (const page of readPages<T>((query) => read(ids, query), {})) {
        for (const row of page) {
          // A repeated ID means the tree changed or has a cycle.
          if (seen.has(row.id)) {
            throw new Error('Tree contains a repeated ID');
          }

          seen.add(row.id);
          nextIds.push(row.id);
          result.push(row);
        }
      }
    }

    parentIds = nextIds;
  }

  return result;
}
