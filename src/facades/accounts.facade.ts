import { Injectable } from '@nestjs/common';

import {
  AccountInputPort,
  IAccount,
  IAccountDto,
  ID,
  IIdentificationDto,
  IProjectionDto,
  ListResponse,
  SystemOpts,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class AccountsFacade implements AccountInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public getAccounts(
    payload: { userId: ID } & IProjectionDto<IAccount>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<IAccount>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<IAccount>
    >('accounts.list', { ...payload, trace }, 1000);
  }

  public getAccountDetails(
    payload: IIdentificationDto & IProjectionDto<IAccount>,
    { trace }: SystemOpts,
  ): Promise<IAccount> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAccount
    >(
      'accounts.findOneById',
      { ...payload, trace },
      1000,
      `AccountDetails_${payload.id}`,
    );
  }

  public getBalance(
    payload: { at?: Date } & IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('accounts.balance', { ...payload, trace }, 1000);
  }

  public createAccount(
    payload: IAccountDto,
    { trace }: SystemOpts,
  ): Promise<IAccount> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAccount
    >('accounts.create', { ...payload, trace }, 1000);
  }

  public updateAccount(
    payload: IIdentificationDto & IAccountDto,
    { trace }: SystemOpts,
  ): Promise<IAccount> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAccount
    >('accounts.update', { ...payload, trace }, 1000);
  }

  public deleteAccount(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<IAccount> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAccount
    >('accounts.delete', { ...payload, trace }, 1000);
  }
}
