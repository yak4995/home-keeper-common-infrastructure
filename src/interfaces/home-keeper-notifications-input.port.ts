import {
  CustomRecord,
  NotificationsInputPort,
} from '@yak4995/home-keeper-core';

import { IEmailDto } from '../dto/email.dto';

export interface HomeKeeperNotificationsInputPort
  extends NotificationsInputPort {
  sendMessage(
    method: string, // type of transport (for example email or sms or HTTP, etc), some enum
    sender: string, // for example email/phone/port/URL
    reciever: string, // for example email/phone/port/URL
    message: CustomRecord,
  ): Promise<boolean>;

  sendEmail(payload: IEmailDto): Promise<boolean>;
}
