import {
  INotification,
  ListResponse,
  NotificationsInputPort,
} from '@yak4995/home-keeper-core';

export class TestNotificationsInputPort implements NotificationsInputPort {
  public sendMessage(): Promise<{ result: boolean }> {
    return Promise.resolve({ result: true });
  }

  async getUserMessages(): Promise<ListResponse<INotification>> {
    return { items: [], count: 0 };
  }

  markAsRead(): Promise<never> {
    throw new Error('Not implemented');
  }

  async deleteMessages(): Promise<INotification[]> {
    return [];
  }
}
