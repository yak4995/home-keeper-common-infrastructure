import { NotificationsOutputPort, SystemOpts } from '@yak4995/home-keeper-core';

export interface HomeKeeperNotificationsOutputPort
  extends NotificationsOutputPort {
  sendEmail(
    output: boolean,
    exception: unknown,
    opts: SystemOpts,
  ): Promise<object>;
}
