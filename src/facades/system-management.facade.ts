import { Injectable } from '@nestjs/common';

import {
  SystemInputPort,
  ICurrency,
  ILanguage,
  ITimezone,
  IIdentificationDto,
  SystemOpts,
  IListDto,
  ListResponse,
  IProjectionDto,
  ICurrencyDto,
  ILangDto,
  ITzDto,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class SystemManagementFacade implements SystemInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public async getListOfCurrencies(
    payload: IListDto<ICurrency>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ICurrency>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ICurrency>
    >('system-management.currencies.list', { ...payload, trace }, 1000);
  }

  public async getCurrencyById(
    payload: IIdentificationDto & IProjectionDto<ICurrency>,
    { trace }: SystemOpts,
  ): Promise<ICurrency> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ICurrency
    >(
      'system-management.currencies.findOneById',
      { ...payload, trace },
      1000,
      `getCurrencyById_${payload.id}`,
    );
  }

  public createCurrency(
    payload: ICurrencyDto,
    { trace }: SystemOpts,
  ): Promise<ICurrency> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ICurrency
    >('system-management.currencies.create', { ...payload, trace }, 1000);
  }

  public updateCurrency(
    payload: IIdentificationDto & ICurrencyDto,
    { trace }: SystemOpts,
  ): Promise<ICurrency> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ICurrency
    >('system-management.currencies.update', { ...payload, trace }, 1000);
  }

  public deleteCurrency(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ICurrency> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ICurrency
    >('system-management.currencies.delete', { ...payload, trace }, 1000);
  }

  public getListOfLanguages(
    payload: IListDto<ILanguage>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ILanguage>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ILanguage>
    >('system-management.languages.list', { ...payload, trace }, 1000);
  }

  public getLangById(
    payload: IIdentificationDto & IProjectionDto<ILanguage>,
    { trace }: SystemOpts,
  ): Promise<ILanguage> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ILanguage
    >(
      'system-management.languages.findOneById',
      { ...payload, trace },
      1000,
      `getLangById_${payload.id}`,
    );
  }

  public createLanguage(
    payload: ILangDto,
    { trace }: SystemOpts,
  ): Promise<ILanguage> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ILanguage
    >('system-management.languages.create', { ...payload, trace }, 1000);
  }

  public updateLanguage(
    payload: IIdentificationDto & ILangDto,
    { trace }: SystemOpts,
  ): Promise<ILanguage> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ILanguage
    >('system-management.languages.update', { ...payload, trace }, 1000);
  }

  public deleteLanguage(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ILanguage> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ILanguage
    >('system-management.languages.delete', { ...payload, trace }, 1000);
  }

  public getListOfTimezones(
    payload: IListDto<ITimezone>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITimezone>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITimezone>
    >('system-management.timezones.list', { ...payload, trace }, 1000);
  }

  public getTzById(
    payload: IIdentificationDto & IProjectionDto<ITimezone>,
    { trace }: SystemOpts,
  ): Promise<ITimezone> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITimezone
    >(
      'system-management.timezones.findOneById',
      { ...payload, trace },
      1000,
      `getTzById_${payload.id}`,
    );
  }

  public createTimezone(
    payload: ITzDto,
    { trace }: SystemOpts,
  ): Promise<ITimezone> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITimezone
    >('system-management.timezones.create', { ...payload, trace }, 1000);
  }

  public updateTimezone(
    payload: IIdentificationDto & ITzDto,
    { trace }: SystemOpts,
  ): Promise<ITimezone> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITimezone
    >('system-management.timezones.update', { ...payload, trace }, 1000);
  }

  public deleteTimezone(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ITimezone> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITimezone
    >('system-management.timezones.delete', { ...payload, trace }, 1000);
  }
}
