import {
  CustomGeneralType,
  NotificationsOutputPort,
} from '@yak4995/home-keeper-core';

export interface HomeKeeperNotificationsOutputPort
  extends NotificationsOutputPort {
  sendEmail(output: boolean, exception: unknown): Promise<CustomGeneralType>;
}
