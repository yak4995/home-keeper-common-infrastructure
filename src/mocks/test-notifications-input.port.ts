import { NotificationsInputPort } from '@yak4995/home-keeper-core';

export class TestNotificationsInputPort implements NotificationsInputPort {
  public sendMessage(): Promise<{ result: boolean }> {
    return Promise.resolve({ result: true });
  }
}
