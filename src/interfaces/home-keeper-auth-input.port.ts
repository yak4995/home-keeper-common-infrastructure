import { IAuthenticationService, IUser } from '@yak4995/home-keeper-core';

import { ILoginDto } from '../dto/login.dto';
import { IRegistrationDto } from '../dto/registration.dto';

export interface HomeKeeperAuthInputPort extends IAuthenticationService {
  signUp(authenticationData: IRegistrationDto): Promise<IUser>;
  signIn(authenticationData: ILoginDto): Promise<IUser>;
  signOut(token: string): Promise<boolean>;
  currentUser(userId: string): Promise<IUser>;

  validateUserByDecodedJWT(userId: string): Promise<IUser>;
  sendOtp(email: string): Promise<boolean>;
}
