import { IAuthenticationService, ID, IUser } from '@yak4995/home-keeper-core';

import { ILoginDto } from '../dto/login.dto';
import { IRegistrationDto } from '../dto/registration.dto';

export interface HomeKeeperAuthInputPort extends IAuthenticationService<IUser> {
  signUp<I = IRegistrationDto>(authenticationData: I): Promise<IUser>;
  signIn<I = ILoginDto, R = IUser>(authenticationData: I): Promise<R>;
  signOut<I = string>(authenticationData: I): Promise<boolean>;
  currentUser(authenticationData: { id: ID }): Promise<IUser>;

  validateUserToken(token: string): Promise<IUser>;
  sendOtp(email: string): Promise<boolean>;
}
