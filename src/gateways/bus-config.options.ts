import {
  ClientProvider,
  ClientsModuleAsyncOptions,
  Transport,
} from '@nestjs/microservices';

import { EnvConfigService } from '../services/env-config.service';

export const busConfigOptions: ClientsModuleAsyncOptions = [
  { token: 'NOTIFICATION', queueName: 'homekeeper-notification-service' },
  { token: 'SYSTEM_MANAGEMENT', queueName: 'homekeeper-system-mgmt-service' },
  { token: 'USERS', queueName: 'homekeeper-users-sevice' },
  { token: 'HOUSEHOLDS', queueName: 'homekeeper-household-service' },
  { token: 'ACCOUNTS', queueName: 'homekeeper-accounts-service' },
].map(({ token: name, queueName: queue }) => ({
  name,
  useFactory: async (config: EnvConfigService): Promise<ClientProvider> => ({
    transport: Transport.RMQ,
    options: {
      urls: ['' + (await config.getConfigValue('busUrl'))],
      queue,
      prefetchCount: 1,
      isGlobalPrefetchCount: false,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  }),
  inject: [EnvConfigService],
}));
