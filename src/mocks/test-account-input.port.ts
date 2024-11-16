import {
  AccountInputPort,
  IAccount,
  ListResponse,
} from '@yak4995/home-keeper-core';

import { accountFixture } from '../fixtures';

export class TestAccountInputPort implements AccountInputPort {
  public async getAccounts(): Promise<ListResponse<IAccount>> {
    return { items: [accountFixture], count: 1 };
  }

  public async getAccountDetails(): Promise<IAccount> {
    return accountFixture;
  }

  public async getBalance(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async createAccount(): Promise<IAccount> {
    return accountFixture;
  }

  public async updateAccount(): Promise<IAccount> {
    return accountFixture;
  }

  public async deleteAccount(): Promise<IAccount> {
    return accountFixture;
  }
}
