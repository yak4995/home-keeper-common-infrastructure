import { Injectable } from '@nestjs/common';

import {
  IIdentificationDto,
  IProjectionDto,
  ListResponse,
  SystemOpts,
  IListDto,
  IAnalyticComparisonDto,
  ID,
  BudgetInputPort,
  BudgetAnalyticInputPort,
  IBudget,
  IBudgetDto,
  IBudgetItem,
  IBudgetItemDto,
  IBudgetAnalyticDto,
  IBudgetChangeAnalyticDto,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class BudgetFacade implements BudgetInputPort, BudgetAnalyticInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public getBudgets(
    payload: {
      ownerId: string;
      from: Date;
      to: Date;
    } & IProjectionDto<IBudget>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<IBudget>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<IBudget>
    >('budget.list', { ...payload, trace }, 1000);
  }

  public getBudgetDetails(
    payload: IIdentificationDto & IProjectionDto<IBudget>,
    { trace }: SystemOpts,
  ): Promise<IBudget> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudget
    >('budget.get', { ...payload, trace }, 1000);
  }

  public createBudget(
    payload: IBudgetDto,
    { trace }: SystemOpts,
  ): Promise<IBudget> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudget
    >('budget.create', { ...payload, trace }, 1000);
  }

  public updateBudget(
    payload: IIdentificationDto & IBudgetDto,
    { trace }: SystemOpts,
  ): Promise<IBudget> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudget
    >('budget.update', { ...payload, trace }, 1000);
  }

  public deleteBudget(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<IBudget> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudget
    >('budget.delete', { ...payload, trace }, 1000);
  }

  public getBudgetItems(
    payload: IListDto<IBudgetItem>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<IBudgetItem>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<IBudgetItem>
    >('budget.list-item', { ...payload, trace }, 1000);
  }

  public getBudgetItem(
    payload: IIdentificationDto & IProjectionDto<IBudgetItem>,
    { trace }: SystemOpts,
  ): Promise<IBudgetItem> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudgetItem
    >('budget.item', { ...payload, trace }, 1000);
  }

  public createBudgetItem(
    payload: { budgetId: ID } & IBudgetItemDto,
    { trace }: SystemOpts,
  ): Promise<IBudgetItem> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudgetItem
    >('budget.create-item', { ...payload, trace }, 1000);
  }

  public updateBudgetItem(
    payload: IIdentificationDto & IBudgetItemDto,
    { trace }: SystemOpts,
  ): Promise<IBudgetItem> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudgetItem
    >('budget.update-item', { ...payload, trace }, 1000);
  }

  public deleteBudgetItem(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<IBudgetItem> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IBudgetItem
    >('budget.delete-item', { ...payload, trace }, 1000);
  }

  public getRatio(
    payload: IBudgetAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<IAnalyticComparisonDto> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAnalyticComparisonDto
    >('budget.ratio', { ...payload, trace }, 1000);
  }

  public getChange(
    payload: IBudgetChangeAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<IAnalyticComparisonDto> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAnalyticComparisonDto
    >('budget.change', { ...payload, trace }, 1000);
  }
}
