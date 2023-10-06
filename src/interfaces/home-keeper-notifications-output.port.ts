import { NotificationsOutputPort } from '@yak4995/home-keeper-core';

export interface HomeKeeperNotificationsOutputPort
  extends NotificationsOutputPort {
  sendMessage<R = boolean>(output: boolean): Promise<R>;
  sendEmail(output: boolean): Promise<boolean>;
}
