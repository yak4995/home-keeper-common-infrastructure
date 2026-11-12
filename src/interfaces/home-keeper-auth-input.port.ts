import { IIdentificationDto, InputPort } from '@yak4995/home-keeper-core';
import { ILoginDto } from '../dto/login.dto';
import { ILogoutDto } from '../dto/logout.dto';
import { IRegistrationDto } from '../dto/registration.dto';
import { ISendOtpDto } from '../dto/send-otp.dto';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeKeeperAuthInputPort
  extends InputPort<{
    signUp: [IRegistrationDto, object];
    signIn: [ILoginDto, object];
    signOut: [ILogoutDto, object];
    currentUser: [IIdentificationDto, object];

    validateUserToken: [ILogoutDto, object];
    sendOtp: [ISendOtpDto, object];
  }> {}
