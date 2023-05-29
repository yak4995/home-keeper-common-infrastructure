import { MessageType } from '../enums/message-type.enum';

export interface IEmailDto {
  recieverEmail: string;
  messageTemplate: MessageType;
  context: { [name: string]: any };
}
