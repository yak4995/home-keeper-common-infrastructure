import { Injectable } from '@nestjs/common';

import {
  HouseholdInputPort,
  ID,
  IHousehold,
  IHouseholdInvitation,
  IIdentificationDto,
  IProjectionDto,
  SystemOpts,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class HouseholdFacade implements HouseholdInputPort {
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public async getSentInvitations(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation[]
    >(
      'household.getSentInvitations',
      { ...payload, trace },
      1000,
      `getSentInvitations_${payload.id}`,
    );
  }

  public async createInvitation(
    payload: { userId: ID } & IIdentificationDto,
    { trace, isSystemCall }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation
    >('household.createInvitation', { ...payload, trace, isSystemCall }, 1000);
  }

  public async deleteInvitation(
    payload: {
      userId: ID;
    } & IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation
    >('household.deleteInvitation', { ...payload, trace }, 1000);
  }

  public async getUserHouseholds(
    payload: { memberId: ID } & IProjectionDto<IHousehold>,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHousehold[]
    >(
      'household.getUserHouseholds',
      { ...payload, trace },
      1000,
      `getUserHouseholds_${payload.memberId}`,
    );
  }

  public async getHousehold(
    payload: IIdentificationDto & IProjectionDto<IHousehold>,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHousehold
    >(
      'household.getHousehold',
      { ...payload, trace },
      1000,
      `getHousehold_${payload.id}`,
    );
  }

  public async createHousehold(
    payload: { memberId: ID; name: string },
    { trace, isSystemCall }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHousehold
    >('household.createHousehold', { ...payload, trace, isSystemCall }, 1000);
  }

  public async updateHousehold(
    payload: { name: string } & IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHousehold
    >('household.updateHousehold', { ...payload, trace }, 1000);
  }

  public async leave(
    payload: { userId: ID } & IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: boolean }
    >('household.leave', { ...payload, trace }, 1000);
  }

  public async getInvitations(payload: { userId: ID }, { trace }: SystemOpts) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation[]
    >(
      'household.getInvitations',
      { ...payload, trace },
      1000,
      `getInvitations_${payload.userId}`,
    );
  }

  public async accept(
    payload: { userId: ID } & IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation
    >('household.accept', { ...payload, trace }, 1000);
  }

  public async reject(
    payload: { userId: ID } & IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHouseholdInvitation
    >('household.reject', { ...payload, trace }, 1000);
  }

  public async deleteHousehold(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ) {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IHousehold
    >('household.deleteHousehold', { ...payload, trace }, 1000);
  }
}
