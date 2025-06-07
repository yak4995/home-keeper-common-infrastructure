import { Injectable } from '@nestjs/common';

import {
  ID,
  IIdentificationDto,
  IProjectionDto,
  ITransactionCategory,
  ITransactionCategoryDto,
  ListResponse,
  SystemOpts,
  TransactionCategoryInputPort,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class TransactionCategoryFacade implements TransactionCategoryInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public getTopCategories(
    _: {},
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory[]> {
    return this.busGateway.callServiceThroughtBus<
      SystemOpts,
      ITransactionCategory[]
    >('transaction-category.top', { trace }, 1000);
  }

  public getTransactionCategoryDirectChildren(
    payload: { ownerId?: ID } & IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransactionCategory>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransactionCategory>
    >('transaction-category.direct-children', { ...payload, trace }, 1000);
  }

  public getTransactionCategoryAllChildren(
    payload: { ownerId?: ID } & IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransactionCategory>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransactionCategory>
    >('transaction-category.all-children', { ...payload, trace }, 1000);
  }

  public list(
    payload: { ownerId?: ID } & IProjectionDto<ITransactionCategory>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransactionCategory>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransactionCategory>
    >('transaction-category.list', { ...payload, trace }, 1000);
  }

  public search(
    payload: {
      ownerId?: ID;
      name?: string;
    } & IProjectionDto<ITransactionCategory>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransactionCategory>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransactionCategory>
    >('transaction-category.search', { ...payload, trace }, 1000);
  }

  public getById(
    payload: IIdentificationDto & IProjectionDto<ITransactionCategory>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransactionCategory>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransactionCategory>
    >('transaction-category.getById', { ...payload, trace }, 1000);
  }

  public createCategory(
    payload: ITransactionCategoryDto,
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransactionCategory
    >('transaction-category.create', { ...payload, trace }, 1000);
  }

  public updateCategory(
    payload: IIdentificationDto & ITransactionCategoryDto,
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransactionCategory
    >('transaction-category.update', { ...payload, trace }, 1000);
  }

  public deleteCategory(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransactionCategory
    >('transaction-category.delete', { ...payload, trace }, 1000);
  }

  public getByIds(
    payload: { ids: ID[] } & IProjectionDto<ITransactionCategory>,
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory[]> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransactionCategory[]
    >('transaction-category.getByIds', { ...payload, trace }, 1000);
  }

  public getByOwnerIds(
    payload: { ownerIds: ID[] } & IProjectionDto<ITransactionCategory>,
    { trace }: SystemOpts,
  ): Promise<ITransactionCategory[]> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransactionCategory[]
    >('transaction-category.getByOwnerIds', { ...payload, trace }, 1000);
  }
}
