import { OutputPort } from '@yak4995/home-keeper-core';
import { HomeKeeperAuthInputPort } from './home-keeper-auth-input.port';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthOutputPort
  extends OutputPort<
    | 'signUp'
    | 'signIn'
    | 'signOut'
    | 'currentUser'
    | 'validateUserToken'
    | 'sendOtp',
    HomeKeeperAuthInputPort
  > {}
