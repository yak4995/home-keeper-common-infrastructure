import {
  CustomGeneralType,
  IUser,
  OutputPort,
} from '@yak4995/home-keeper-core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthOutputPort
  extends OutputPort<{
    signUp: [Partial<IUser>, CustomGeneralType];
    signIn: [IUser, CustomGeneralType];
    signOut: [boolean, CustomGeneralType];
    currentUser: [Partial<IUser>, CustomGeneralType];

    validateUserToken: [IUser, CustomGeneralType];
    sendOtp: [boolean, CustomGeneralType];
  }> {}
