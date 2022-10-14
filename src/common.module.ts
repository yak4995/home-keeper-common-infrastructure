import * as redisStore from 'cache-manager-redis-store';

import { CacheModule, Global, Module } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';

import { RedisCacheService } from './services/redis-cache.service';
import { OutputStreamLoggerService } from './services/output-stream-logger.service';
import { EnvConfigService } from './services/env-config.service';

const reexportedModules = [
  CacheModule.registerAsync({
    useFactory: async () => {
      const config: IConfigService = new EnvConfigService();
      return {
        store: redisStore,
        // Store-specific configuration:
        host: await config.getConfigValue('cacheUrl'),
        port: await config.getConfigValue('cachePort'),
      };
    },
  }),
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
  providers: [OutputStreamLoggerService, RedisCacheService],
  exports: [OutputStreamLoggerService, ...reexportedModules, RedisCacheService],
})
export class CommonModule {}
