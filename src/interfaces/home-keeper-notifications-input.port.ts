import { NotificationsInputPort, SystemOpts } from '@yak4995/home-keeper-core';

import { IEmailDto } from '../dto/email.dto';

export interface HomeKeeperNotificationsInputPort
  extends NotificationsInputPort {
  sendMessage(
    payload: {
      method: string; // type of transport (for example email or sms or HTTP, etc), some enum
      sender: string; // for example email/phone/port/URL
      reciever: string; // for example email/phone/port/URL
      message: object;
    },
    opts: SystemOpts,
  ): Promise<object>;

  sendEmail(payload: IEmailDto, opts: SystemOpts): Promise<object>;
}
