import {
  ITransaction,
  ListResponse,
  TransactionInputPort,
} from '@yak4995/home-keeper-core';

import { transactionFixture } from '../fixtures';

export class TestTransactionInputPort implements TransactionInputPort {
  public async getTransactions(): Promise<ListResponse<ITransaction>> {
    return { items: [transactionFixture], count: 1 };
  }

  public async getConvertedTransactions() {
    return { items: [transactionFixture], count: 1 };
  }

  public async getTransactionDetails(): Promise<ITransaction> {
    return transactionFixture;
  }

  public async createTransaction(): Promise<ITransaction> {
    return transactionFixture;
  }

  public async updateTransaction(): Promise<ITransaction> {
    return transactionFixture;
  }

  public async deleteTransaction(): Promise<ITransaction> {
    return transactionFixture;
  }

  public async batchCreateTransactions(): Promise<ListResponse<ITransaction>> {
    return { items: [transactionFixture], count: 1 };
  }
  public async batchUpdateTransactions(): Promise<ListResponse<ITransaction>> {
    return { items: [transactionFixture], count: 1 };
  }
  public async batchDeleteTransactions(): Promise<ListResponse<ITransaction>> {
    return { items: [transactionFixture], count: 1 };
  }

  public async syncRate() {
    return { result: true };
  }
}
