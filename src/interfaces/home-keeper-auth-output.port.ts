import { IUser, OutputPort } from '@yak4995/home-keeper-core';

export interface HomeKeeperAuthOutputPort
  extends OutputPort<{
    signUp: [Partial<IUser>, object];
    signIn: [IUser, object];
    signOut: [{ result: boolean }, object];
    currentUser: [Partial<IUser>, object];

    validateUserToken: [IUser, object];
    sendOtp: [{ result: boolean }, object];
  }> {}
