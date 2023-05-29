import { NotificationsOutputPort } from '@yak4995/home-keeper-core';

export interface HomeKeeperNotificationsOutputPort
  extends NotificationsOutputPort {
  sendMessage(output: boolean): Promise<boolean>;
  sendEmail(output: boolean): Promise<boolean>;
}
