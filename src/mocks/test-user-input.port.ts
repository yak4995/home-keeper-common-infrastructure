import { IUser, ListResponse, UserInputPort } from '@yak4995/home-keeper-core';

import { userFixture } from '../fixtures';

export class TestUserInputPort implements UserInputPort {
  public createUser(): Promise<IUser> {
    return Promise.resolve(userFixture);
  }

  public getAllUsers(): Promise<ListResponse<IUser>> {
    return Promise.resolve({ items: [userFixture], count: 1 });
  }

  public getUserById(): Promise<IUser> {
    return Promise.resolve(userFixture);
  }

  public changeProfileInfo(): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  public updateUser(): Promise<IUser> {
    return Promise.resolve(userFixture);
  }

  public async deleteAccount(): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
}
