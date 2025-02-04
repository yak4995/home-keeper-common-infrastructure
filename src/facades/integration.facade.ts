import { Injectable } from '@nestjs/common';

import {
  CurrencyConverterService,
  ID,
  // ITransaction,
  SystemOpts,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class IntegrationFacade implements CurrencyConverterService {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  /*async importTransactions(
    payload: {
      accountId: string;
      bank: string;
      mimetype: string;
      data: Buffer;
    },
    { trace }: SystemOpts,
  ): Promise<ITransaction[]> {
    console.log(payload);
    console.log(trace);
    return [];
  }*/

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
