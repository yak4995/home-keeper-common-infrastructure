import { Injectable } from '@nestjs/common';

import {
  ID,
  IIdentificationDto,
  IListDto,
  IProjectionDto,
  IUser,
  IUserDto,
  IUserProfileDto,
  ListResponse,
  SystemOpts,
  UserInputPort,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

import { IRegistrationDto } from '../dto/registration.dto';

@Injectable()
export class UserFacade implements UserInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public createUser(
    payload: IRegistrationDto,
    { trace }: SystemOpts,
  ): Promise<IUser> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IUser
    >('users.create', { ...payload, trace }, 1000);
  }

  public getAllUsers(
    payload: IListDto<IUser>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<IUser>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<IUser>
    >('users.find', { ...payload, trace }, 1000);
  }

  public getUserById(
    payload: IIdentificationDto & IProjectionDto<IUser>,
    { trace }: SystemOpts,
  ): Promise<IUser> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IUser
    >(
      'users.findOneById',
      { ...payload, trace },
      1000,
      `getUserById_${payload.id}`,
    );
  }

  public changeProfileInfo(
    payload: IIdentificationDto & IUserProfileDto,
    { trace }: SystemOpts,
  ): Promise<IUser> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IUser
    >('users.updateProfile', { ...payload, trace }, 1000);
  }

  public updateUser(
    payload: IIdentificationDto & IUserDto,
    { trace }: SystemOpts,
  ): Promise<IUser> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IUser
    >('users.update', { ...payload, trace }, 1000);
  }

  public deleteAccount(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<IUser> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IUser
    >('users.delete', { ...payload, trace }, 1000);
  }

  public async syncState(
    payload: { userIds: ID[] },
    { trace }: SystemOpts,
  ): Promise<{ success: boolean }> {
    const { result } = (await this.busGateway.notifyServiceThroughtBus<
      typeof payload & SystemOpts
    >('users.sync-state', { ...payload, trace })) as { result: boolean };

    return { success: result };
  }
}
