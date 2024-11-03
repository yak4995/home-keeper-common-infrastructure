import { Injectable } from '@nestjs/common';

import { NotificationsInputPort, SystemOpts } from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class NotificationsFacade implements NotificationsInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public async sendMessage(
    payload: Parameters<NotificationsInputPort['sendMessage']>[0],
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: boolean }
    >('notification.sendMessage', { ...payload, trace }, 5000);
  }
}
