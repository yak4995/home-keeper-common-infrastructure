import {
  BudgetInputPort,
  IBudget,
  IBudgetItem,
  ListResponse,
} from '@yak4995/home-keeper-core';

import { budgetFixture, budgetItemFixture } from '../fixtures';

export class TestBudgetInputPort implements BudgetInputPort {
  public async getBudgets(): Promise<ListResponse<IBudget>> {
    return { items: [budgetFixture], count: 1 };
  }

  public async getBudgetDetails(): Promise<IBudget> {
    return budgetFixture;
  }

  public async createBudget(): Promise<IBudget> {
    return budgetFixture;
  }

  public async updateBudget(): Promise<IBudget> {
    return budgetFixture;
  }

  public async deleteBudget(): Promise<IBudget> {
    return budgetFixture;
  }

  public async getBudgetItems(): Promise<ListResponse<IBudgetItem>> {
    return { items: [budgetItemFixture], count: 1 };
  }

  public async getBudgetItem(): Promise<IBudgetItem> {
    return budgetItemFixture;
  }

  public async createBudgetItem(): Promise<IBudgetItem> {
    return budgetItemFixture;
  }

  public async updateBudgetItem(): Promise<IBudgetItem> {
    return budgetItemFixture;
  }

  public async deleteBudgetItem(): Promise<IBudgetItem> {
    return budgetItemFixture;
  }
}
