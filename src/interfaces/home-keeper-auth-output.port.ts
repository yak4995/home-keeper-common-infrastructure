import { IUser, OutputPort } from '@yak4995/home-keeper-core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthOutputPort
  extends OutputPort<{
    signUp: [Partial<IUser>, object];
    signIn: [IUser, object];
    signOut: [{ result: boolean }, object];
    currentUser: [Partial<IUser>, object];

    validateUserToken: [IUser, object];
    sendOtp: [{ result: boolean }, object];
  }> {}
