import { IUser } from '@yak4995/home-keeper-core';

export interface HomeKeeperAuthOutputPort {
  signUp(output: IUser): Promise<any>;
  signIn(output: IUser): Promise<any>;
  signOut(output: boolean): Promise<any>;
  currentUser(output: IUser): Promise<any>;

  validateUserByDecodedJWT(output: IUser): Promise<any>;
  sendOtp(output: boolean): Promise<any>;
}
