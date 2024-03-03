import { CustomRecord } from '@yak4995/home-keeper-core';

export interface ILogoutDto extends CustomRecord {
  token: string;
}
