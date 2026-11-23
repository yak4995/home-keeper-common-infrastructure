import { getEntityLockTokens } from '../services/entity-mutex';
import { camelCase } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ICacheService, SystemOpts } from '@yak4995/home-keeper-core';

import { TraceableError } from '../errors/traceable.error';

// Attach trusted internal ownership metadata without changing ordinary RPC payloads.
function attachEntityLocks<T extends object>(params: T): T {
  const payload = { ...params } as T & {
    __entityLocks?: Record<string, string>;
  };
  const tokens = getEntityLockTokens();

  delete payload.__entityLocks;

  if (Object.keys(tokens).length) {
    payload.__entityLocks = tokens;
  }

  return payload;
}

@Injectable()
export class BusGateway {
  constructor(
    @Inject('ICacheService')
    private readonly fallbackProvider: ICacheService,
  ) {}

  private static readonly DEFAULT_TIMEOUT = 5_000;

  public async notifyServiceThroughtBus<TInput extends object & SystemOpts>(
    address: string,
    params?: TInput,
  ): Promise<object> {
    if (!params || !params?.trace) {
      params.trace = randomUUID();
    }
    const [serviceName] = address.split('.');
    const clientInstance: ClientProxy = this[`${camelCase(serviceName)}Client`];
    if (!clientInstance) {
      throw new TraceableError(params.trace, 'Incorrect request address');
    }

    try {
      await lastValueFrom(
        clientInstance.emit(address, attachEntityLocks(params)),
      );

      return { result: true };
    } catch (e) {
      throw new TraceableError(
        params.trace,
        e instanceof Error ? e.message : e,
        e instanceof Error ? e.stack : undefined,
      );
    }
  }

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
      params.trace = randomUUID();
    }
    const [serviceName] = address.split('.');
    const clientInstance: ClientProxy = this[`${camelCase(serviceName)}Client`];
    if (!clientInstance) {
      throw new TraceableError(params.trace, 'Incorrect request address');
    }

    try {
      const response: TResult = await lastValueFrom(
        clientInstance
          .send<TResult, TInput>(address, attachEntityLocks(params))
          .pipe(timeout(timeoutInSeconds ?? BusGateway.DEFAULT_TIMEOUT)),
      );

      if (fallbackKey) {
        await this.fallbackProvider.set([fallbackKey], response);
      }

      return response;
    } catch (e) {
      const error = new TraceableError(
        params.trace,
        e instanceof Error ? e.message : e,
        e instanceof Error ? e.stack : undefined,
      );
      if (!fallbackKey) {
        throw error;
      }

      try {
        const fallbackResponse: TResult =
          await this.fallbackProvider.get<TResult>(fallbackKey, () =>
            Promise.reject(error),
          );

        if (!fallbackResponse) {
          throw error;
        } else {
          return fallbackResponse;
        }
      } catch {
        throw error;
      }
    }
  }
}
