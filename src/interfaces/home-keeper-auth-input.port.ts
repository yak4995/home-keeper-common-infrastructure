import {
  CustomRecord,
  IAuthenticationService,
  ID,
  InputPort,
  IUser,
} from '@yak4995/home-keeper-core';

export interface HomeKeeperAuthInputPort
  extends InputPort<
      | 'signUp'
      | 'signIn'
      | 'signOut'
      | 'currentUser'
      | 'validateUserToken'
      | 'sendOtp'
    >,
    IAuthenticationService<IUser> {
  signUp(authenticationData: CustomRecord): Promise<IUser>;
  signIn(authenticationData: CustomRecord): Promise<IUser>;
  signOut(authenticationData: CustomRecord): Promise<boolean>;
  currentUser(authenticationData: { id: ID }): Promise<IUser>;

  validateUserToken(token: string): Promise<IUser>;
  sendOtp(email: string): Promise<boolean>;
}
