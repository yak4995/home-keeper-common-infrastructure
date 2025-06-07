import {
  HouseholdInputPort,
  IHousehold,
  IHouseholdInvitation,
} from '@yak4995/home-keeper-core';

export class TestHouseholdInputPort implements HouseholdInputPort {
  public getSentInvitations(): never {
    throw new Error('Method not implemented');
  }

  public createInvitation(): never {
    throw new Error('Method not implemented');
  }

  public async deleteInvitation(): Promise<IHouseholdInvitation> {
    return null;
  }

  public getUserHouseholds(): never {
    throw new Error('Method not implemented');
  }

  public getHousehold(): never {
    throw new Error('Method not implemented');
  }

  public async createHousehold(): Promise<IHousehold> {
    return null;
  }

  public updateHousehold(): never {
    throw new Error('Method not implemented');
  }

  public async leave(): Promise<IHousehold> {
    return null;
  }

  public getInvitations(): never {
    throw new Error('Method not implemented');
  }

  public accept(): never {
    throw new Error('Method not implemented');
  }

  public reject(): never {
    throw new Error('Method not implemented');
  }

  public deleteHousehold(): never {
    throw new Error('Method not implemented');
  }

  public async syncState(): Promise<{ success: boolean }> {
    return { success: true };
  }

  public async getHouseholdsByIds(): Promise<never> {
    throw new Error('Method not implemented');
  }

  public async getInvitationsByUserIds(): Promise<never> {
    throw new Error('Method not implemented');
  }
}
