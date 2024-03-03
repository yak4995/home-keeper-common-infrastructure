import { CustomRecord } from '@yak4995/home-keeper-core';

export interface IRegistrationDto extends CustomRecord {
  name: string;
  email: string;
}
