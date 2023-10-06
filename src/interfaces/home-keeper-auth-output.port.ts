import { HomeKeeperAuthInputPort } from './home-keeper-auth-input.port';

export interface HomeKeeperAuthOutputPort {
  signUp<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['signUp']>>,
    exception: unknown,
  ): Promise<R>;
  signIn<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['signIn']>>,
    exception: unknown,
  ): Promise<R>;
  signOut<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['signOut']>>,
    exception: unknown,
  ): Promise<R>;
  currentUser<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['currentUser']>>,
    exception: unknown,
  ): Promise<R>;

  validateUserToken<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['validateUserToken']>>,
    exception: unknown,
  ): Promise<R>;
  sendOtp<R>(
    output: Awaited<ReturnType<HomeKeeperAuthInputPort['sendOtp']>>,
    exception: unknown,
  ): Promise<R>;
}
