import { Injectable, type OnModuleDestroy } from '@nestjs/common';

import { closeEntityMutex } from './entity-mutex';

// Close the shared Redis connection when the Nest application shuts down.
@Injectable()
export class EntityMutexLifecycle implements OnModuleDestroy {
  // Release the connection after request handling stops.
  async onModuleDestroy(): Promise<void> {
    await closeEntityMutex();
  }
}
