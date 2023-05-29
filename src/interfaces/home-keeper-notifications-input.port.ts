import { NotificationsInputPort } from '@yak4995/home-keeper-core';

import { IEmailDto } from '../dto/email.dto';

export interface HomeKeeperNotificationsInputPort
  extends NotificationsInputPort {
  sendMessage(
    method: any,
    sender: any,
    reciever: any,
    message: any,
  ): Promise<boolean>;

  sendEmail(payload: IEmailDto): Promise<boolean>;
}
