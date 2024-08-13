import { CustomRecord, SystemOpts } from '@yak4995/home-keeper-core';

export interface ILogoutDto extends CustomRecord, SystemOpts {
  token: string;
}
