import {
  FilterCriteria,
  ICacheService,
  ID,
  IListDto,
  IPersistantEntity,
  IRepository,
  ListResponse,
  SystemOpts,
} from '@yak4995/home-keeper-core';

export async function fetchListThroughCache<T extends IPersistantEntity>(
  params: {
    payload: IListDto<T>;
    cacheService: ICacheService;
    repository: IRepository<T>;
    listCacheKey: string;
    idCacheKey: string;
  },
  { trace }: SystemOpts,
): Promise<ListResponse<T>> {
  const { payload, cacheService, repository, listCacheKey, idCacheKey } =
    params;

  const { filter, sort, page, perPage, projection } = payload;

  if (!sort && !page && !perPage) {
    if (!filter || !Object.keys(filter)) {
      const { items, count } = await cacheService.get<ListResponse<T>>(
        listCacheKey,
        () =>
          repository.list(
            { filter, sort, page, perPage, projection: undefined },
            { trace },
          ),
      );

      return {
        items: await repository.mapRelatedEntities(items, projection, {
          trace,
        }),
        count,
      };
    } else if (Object.keys(filter).length === 1 && filter?.id?.['$in']) {
      const idsForDb: ID[] = [];

      const promises: Promise<T>[] = [];
      const idsFilter = (
        filter.id as {
          $in?: (ID | null)[];
        }
      ).$in;
      for (const id of idsFilter) {
        if (!(await cacheService.has(`${idCacheKey}_${id}`))) {
          idsForDb.push(id);
        } else {
          promises.push(
            cacheService.get<T>(`${idCacheKey}_${id}`, () =>
              repository.findById({ id, projection: undefined }, { trace }),
            ),
          );
        }
      }

      const cachedItems: T[] = await Promise.all(promises);
      const dbItems = await repository.list(
        {
          filter: { id: { $in: idsForDb } } as FilterCriteria<T>,
          sort,
          page,
          perPage,
          projection: undefined,
        },
        { trace },
      );

      return {
        items: await repository.mapRelatedEntities(
          [...dbItems.items, ...cachedItems],
          projection,
          { trace },
        ),
        count: dbItems.items.length + cachedItems.length,
      };
    }
  }

  return repository.list(
    { filter, sort, page, perPage, projection },
    { trace },
  );
}
