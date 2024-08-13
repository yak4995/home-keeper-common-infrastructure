import {
  CustomGeneralType,
  IIdentificationDto,
  InputPort,
} from '@yak4995/home-keeper-core';
import { ILoginDto } from 'dto/login.dto';
import { ILogoutDto } from 'dto/logout.dto';
import { IRegistrationDto } from 'dto/registration.dto';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthInputPort
  extends InputPort<{
    signUp: [IRegistrationDto, CustomGeneralType];
    signIn: [ILoginDto, CustomGeneralType];
    signOut: [ILogoutDto, CustomGeneralType];
    currentUser: [IIdentificationDto, CustomGeneralType];

    validateUserToken: [{ token: string }, CustomGeneralType];
    sendOtp: [{ email: string }, CustomGeneralType];
  }> {}
