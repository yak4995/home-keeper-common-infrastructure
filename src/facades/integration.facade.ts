import { Injectable } from '@nestjs/common';

import {
  CurrencyConverterService,
  ID,
  SystemOpts,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class IntegrationFacade implements CurrencyConverterService {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  getRateFor(
    payload: { from: ID; to: ID; forDate: Date },
    { trace }: SystemOpts,
  ): Promise<{ rate: number }> {
    payload.forDate = new Date(payload.forDate);
    const year = payload.forDate.getFullYear();
    const month = String(payload.forDate.getMonth() + 1).padStart(2, '0');
    const day = String(payload.forDate.getDate()).padStart(2, '0');
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
