import { CustomRecord, SystemOpts } from '@yak4995/home-keeper-core';

import { MessageType } from '../enums/message-type.enum';

export interface IEmailDto extends SystemOpts {
  recieverEmail: string;
  messageTemplate: MessageType;
  context: CustomRecord;
}
