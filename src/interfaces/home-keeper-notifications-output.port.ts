import { NotificationsOutputPort } from '@yak4995/home-keeper-core';

export interface HomeKeeperNotificationsOutputPort
  extends NotificationsOutputPort {
  sendEmail(output: boolean): Promise<boolean>;
}
