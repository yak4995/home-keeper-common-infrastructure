import { CustomRecord } from '@yak4995/home-keeper-core';

export interface ILoginDto extends CustomRecord {
  email: string;
  otp: string;
}
