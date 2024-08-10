import {
  CustomGeneralType,
  CustomRecord,
  IIdentificationDto,
  InputPort,
} from '@yak4995/home-keeper-core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthInputPort
  extends InputPort<{
    signUp: [CustomRecord, CustomGeneralType];
    signIn: [CustomRecord, CustomGeneralType];
    signOut: [CustomRecord, CustomGeneralType];
    currentUser: [IIdentificationDto, CustomGeneralType];

    validateUserToken: [{ token: string }, CustomGeneralType];
    sendOtp: [{ email: string }, CustomGeneralType];
  }> {}
