import {
  ITransactionCategory,
  ListResponse,
  TransactionCategoryInputPort,
} from '@yak4995/home-keeper-core';

import {
  systemTransactionCategoriesFixture,
  transactionCategoryFixture,
} from '../fixtures';

export class TestTransactionCategoryInputPort
  implements TransactionCategoryInputPort
{
  public async getTopCategories(): Promise<ITransactionCategory[]> {
    return systemTransactionCategoriesFixture;
  }

  public async getTransactionCategoryDirectChildren(): Promise<
    ListResponse<ITransactionCategory>
  > {
    return { items: [transactionCategoryFixture], count: 1 };
  }

  public async getTransactionCategoryAllChildren(): Promise<
    ListResponse<ITransactionCategory>
  > {
    return { items: [transactionCategoryFixture], count: 1 };
  }

  public async list(): Promise<ListResponse<ITransactionCategory>> {
    return {
      items: [
        ...systemTransactionCategoriesFixture,
        transactionCategoryFixture,
      ],
      count: 3,
    };
  }

  public async search(): Promise<ListResponse<ITransactionCategory>> {
    return {
      items: [
        ...systemTransactionCategoriesFixture,
        transactionCategoryFixture,
      ],
      count: 3,
    };
  }

  public async getById(): Promise<ITransactionCategory> {
    return transactionCategoryFixture;
  }

  public async createCategory(): Promise<ITransactionCategory> {
    return transactionCategoryFixture;
  }

  public async updateCategory(): Promise<ITransactionCategory> {
    return transactionCategoryFixture;
  }

  public async deleteCategory(): Promise<ITransactionCategory> {
    return transactionCategoryFixture;
  }

  public async getByIds(): Promise<ITransactionCategory[]> {
    return [transactionCategoryFixture];
  }

  public async getByOwnerIds(): Promise<ITransactionCategory[]> {
    return [transactionCategoryFixture];
  }
}
