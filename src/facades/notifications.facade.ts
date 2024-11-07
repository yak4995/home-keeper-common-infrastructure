import { Injectable } from '@nestjs/common';

import {
  ID,
  IListDto,
  INotification,
  ListResponse,
  NotificationsInputPort,
  SystemOpts,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class NotificationsFacade implements NotificationsInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public async sendMessage(
    payload: Parameters<NotificationsInputPort['sendMessage']>[0],
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.notifyServiceThroughtBus<
      typeof payload & SystemOpts
    >('notification.sendMessage', { ...payload, trace });
  }

  public async getUserMessages(
    payload: IListDto<INotification>,
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<INotification>
    >('notification.getUserMessages', { ...payload, trace }, 1000);
  }

  public async markAsRead(
    payload: { ids: ID[] },
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: boolean }
    >('notification.markAsRead', { ...payload, trace }, 1000);
  }

  public async deleteMessages(
    payload: { ids: ID[] },
    { trace }: SystemOpts,
  ): Promise<object> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      INotification
    >('notification.deleteMessages', { ...payload, trace }, 1000);
  }
}
