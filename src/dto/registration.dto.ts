import { CustomRecord, SystemOpts } from '@yak4995/home-keeper-core';

export interface IRegistrationDto extends CustomRecord, SystemOpts {
  name: string;
  email: string;
}
