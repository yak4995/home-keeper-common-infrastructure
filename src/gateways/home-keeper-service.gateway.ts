import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ICacheService } from '@yak4995/home-keeper-core';

import { BusGateway } from './bus.gateway';

@Injectable()
export class HomeKeeperServiceGateway extends BusGateway {
  constructor(
    @Inject('ICacheService')
    fallbackProvider: ICacheService,
    @Inject('NOTIFICATION')
    private notificationClient: ClientProxy,
    @Inject('SYSTEM_MANAGEMENT')
    private systemManagementClient: ClientProxy,
    @Inject('USERS')
    private usersClient: ClientProxy,
    @Inject('HOUSEHOLDS')
    private householdClient: ClientProxy,
    @Inject('ACCOUNTS')
    private accountsClient: ClientProxy,
  ) {
    super(fallbackProvider);
  }
}
