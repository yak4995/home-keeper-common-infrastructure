import { camelCase } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ICacheService, SystemOpts } from '@yak4995/home-keeper-core';

import { TraceableError } from '../errors/traceable.error';

@Injectable()
export class BusGateway {
  constructor(
    @Inject('ICacheService')
    private readonly fallbackProvider: ICacheService,
  ) {}

  private static readonly DEFAULT_TIMEOUT = 5_000;

  public async callServiceThroughtBus<
    TInput extends object & SystemOpts,
    TResult = object,
  >(
    address: string,
    params?: TInput,
    timeoutInSeconds?: number,
    fallbackKey?: string,
  ): Promise<TResult> {
    if (!params || !params?.trace) {
      params.trace = uuidv4();
    }
    const [serviceName] = address.split('.');
    const clientInstance: ClientProxy = this[`${camelCase(serviceName)}Client`];
    if (!clientInstance) {
      throw new TraceableError(params.trace, 'Incorrect request address');
    }

    try {
      const response: TResult = await lastValueFrom(
        clientInstance
          .send<TResult, TInput>(address, params)
          .pipe(timeout(timeoutInSeconds ?? BusGateway.DEFAULT_TIMEOUT)),
      );

      if (fallbackKey) {
        await this.fallbackProvider.set([fallbackKey], response);
      }

      return response;
    } catch (e) {
      e = new TraceableError(params.trace, e instanceof Error ? e.message : e);
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
