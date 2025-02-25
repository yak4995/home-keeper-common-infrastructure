import { Injectable } from '@nestjs/common';

import {
  CurrencyConverterService,
  ID,
  SystemOpts,
  IImportService,
  IBackupService,
  Bank,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class IntegrationFacade
  implements CurrencyConverterService, IImportService, IBackupService
{
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  importTransactions(
    payload: {
      bank: Bank;
      accountId: ID;
      bankStatement: {
        originalname: string;
        mimetype: string;
        buffer: Buffer;
      };
    },
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { rate: number }
    >('integration.import-transactions', { ...payload, trace }, 5000);
  }

  backup(payload: { userId: ID }, { trace }: SystemOpts): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { rate: number }
    >('integration.backup', { ...payload, trace }, 5000);
  }

  restore(payload: object, { trace }: SystemOpts): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { rate: number }
    >('integration.restore', { ...payload, trace }, 5000);
  }

  getRateFor(
    payload: { from: ID; to: ID; forDate: Date },
    { trace }: SystemOpts,
  ): Promise<{ rate: number }> {
    const forDate = new Date(payload.forDate);
    const year = forDate.getFullYear();
    const month = String(forDate.getMonth() + 1).padStart(2, '0');
    const day = String(forDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { rate: number }
    >(
      'integration.currency-rate',
      { ...payload, trace },
      1000,
      `Rate_${payload.from}_${payload.to}_${formattedDate}`,
    );
  }
}
