import { redisStore } from 'cache-manager-redis-store';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { Global, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ClientsModule } from '@nestjs/microservices';

import { AsyncContextService } from './services/async-context.service';
import { RedisCacheService } from './services/redis-cache.service';
import { OutputStreamLoggerService } from './services/output-stream-logger.service';
import { EnvConfigService } from './services/env-config.service';

import { busConfigOptions } from './gateways/bus-config.options';
import { BusGateway } from './gateways/bus.gateway';
import { HomeKeeperServiceGateway } from './gateways/home-keeper-service.gateway';

import { NotificationsFacade } from './facades/notifications.facade';
import { SystemManagementFacade } from './facades/system-management.facade';
import { UserFacade } from './facades/user.facade';
import { HouseholdFacade } from './facades/household.facade';
import { AccountsFacade } from './facades/accounts.facade';
import { TransactionCategoryFacade } from './facades/transaction-category.facade';
import { IntegrationFacade } from './facades/integration.facade';
import { TransactionsFacade } from './facades/transaction.facade';

const reexportedModules = [
  CacheModule.registerAsync({
    useFactory: async (config: EnvConfigService) => {
      return {
        store: (await redisStore({
          url: `redis://${'' + (await config.getConfigValue('cacheUrl'))}:${+(await config.getConfigValue('cachePort'))}`,
          ttl: +(await config.getConfigValue('cacheTTL')),
        })) as unknown as CacheStore,
        ttl: +(await config.getConfigValue('cacheTTL')),
      };
    },
    inject: [EnvConfigService],
  }),
  PrometheusModule.register(),
  ClientsModule.registerAsync(busConfigOptions),
];

const exportedProviders = [
  OutputStreamLoggerService,
  EnvConfigService,
  RedisCacheService,
  BusGateway,
  HomeKeeperServiceGateway,
  AsyncContextService,
  {
    provide: 'ICacheService',
    useClass: RedisCacheService,
  },
  {
    provide: 'IConfigService',
    useClass: EnvConfigService,
  },
  {
    provide: 'NotificationInputPort',
    useClass: NotificationsFacade,
  },
  { provide: 'SystemInputPort', useClass: SystemManagementFacade },
  {
    provide: 'UserInputPort',
    useClass: UserFacade,
  },
  { provide: 'HouseholdInputPort', useClass: HouseholdFacade },
  { provide: 'AccountInputPort', useClass: AccountsFacade },
  {
    provide: 'TransactionCategoryInputPort',
    useClass: TransactionCategoryFacade,
  },
  {
    provide: 'CurrencyConverterService',
    useClass: IntegrationFacade,
  },
  {
    provide: 'TransactionInputPort',
    useClass: TransactionsFacade,
  },
];

// MIDDLEWARES
//  (ONLY FOR HTTP/S: have access to request and response, support DI, can execute any code, change request/response, breack request lifecycle)
// ->
// GUARDS
//  (support DI, responsible for passing or not request to related handler (authorization),
//   have access to execution context which is more wide than req/res and has access to metadata of handler (like list of allowed roles)
//   and depends on protocol)
// ->
// INTERCEPTORS
//   (support DI, responsible for AOP:
//    - bind extra logic before / after method execution
//    - transform the result returned from a function
//    - transform the exception thrown from a function
//    - extend the basic function behavior
//    - completely override a function depending on specific conditions (e.g., for caching purposes)
//   Has 2 params: execution context and call handler (user's handler, related to query))
// ->
// PIPES (support DI, responsible for validation and transformation passing data) ->
// USER'S HANDLER (controller/resolver method) ->
// INTERCEPTORS ->
// EXCEPTION FILTERS
//   (transform possible throwing exception to correct response (http/rpc). Has 2 params: exception and argument host (superclass of execution context))
@Global()
@Module({
  imports: [...reexportedModules],
  providers: [...exportedProviders],
  exports: [...reexportedModules, ...exportedProviders],
})
export class CommonModule {}
