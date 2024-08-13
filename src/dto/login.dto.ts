import { CustomRecord, SystemOpts } from '@yak4995/home-keeper-core';

export interface ILoginDto extends CustomRecord, SystemOpts {
  email: string;
  otp: string;
}
