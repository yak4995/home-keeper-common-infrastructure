import { camelCase } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ICacheService } from '@yak4995/home-keeper-core';

@Injectable()
export class BusGateway {
  constructor(
    @Inject('ICacheService')
    private readonly fallbackProvider: ICacheService,
  ) {}

  private static readonly DEFAULT_TIMEOUT = 5_000;

  public async callServiceThroughtBus<TInput = any, TResult = any>(
    address: string,
    params?: TInput,
    timeoutInSeconds?: number,
    fallbackKey?: string,
  ): Promise<TResult> {
    const [serviceName] = address.split('.');
    const clientInstance: ClientProxy = this[`${camelCase(serviceName)}Client`];
    if (!clientInstance) {
      throw new Error('Incorrect request address');
    }

    try {
      const response: TResult = await lastValueFrom(
        clientInstance
          .send<TResult, TInput | any>(address, params ?? {})
          .pipe(timeout(timeoutInSeconds ?? BusGateway.DEFAULT_TIMEOUT)),
      );

      if (fallbackKey) {
        await this.fallbackProvider.set([fallbackKey], response);
      }

      return response;
    } catch (e) {
      if (!fallbackKey) {
        throw e;
      }

      try {
        const fallbackResponse: TResult =
          await this.fallbackProvider.get<TResult>(fallbackKey, () =>
            Promise.reject(e),
          );

        if (!fallbackResponse) {
          throw e;
        } else {
          return fallbackResponse;
        }
      } catch {
        throw e;
      }
    }
  }
}
