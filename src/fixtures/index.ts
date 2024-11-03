import {
  HouseholdInvitationStatusEnum,
  IHousehold,
  IHouseholdInvitation,
  UserRole,
} from '@yak4995/home-keeper-core';

export const currencyFixture = {
  id: 'curr-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  name: 'test',
  code: 'test',
};

export const languageFixture = {
  id: 'lang-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  name: 'test',
  code: 'test',
};

export const timezoneFixture = {
  id: 'tz-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  name: 'test',
  shift: 'test',
};

export const userFixture = {
  id: 'user-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  email: 'yak4995@gmail.com',
  name: 'Yurii Kryvokhyzha',
  profileImageUrl: 'https://avatars.githubusercontent.com/u/11019274?s=40&v=4',
  roles: [
    UserRole.USER,
    UserRole.USERS_ADMIN,
    UserRole.SYSTEM_ADMIN,
    UserRole.CATEGORIES_ADMIN,
    UserRole.MANAGER_ADMIN,
  ],
  timezoneId: currencyFixture.id,
  languageId: languageFixture.id,
  defaultCurrencyId: currencyFixture.id,
  defaultCurrency: currencyFixture,
  lang: languageFixture,
  timezone: timezoneFixture,
  households: [{ id: 'household-id' } as IHousehold],
  invitations: [{ household: { id: 'household-id' } } as IHouseholdInvitation],
};

export const householdFixture = {
  id: 'household-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  name: 'test',
  isOwn: false,
  invitationLinks: [],
  members: [userFixture],
  invitations: [],
  accounts: [],
  budgets: [],
  transactionCategories: [],
};

export const householdInvitationFixture = {
  id: 'invitation-id',
  createdAt: new Date(0),
  updatedAt: new Date(0),
  household: householdFixture,
  user: userFixture,
  status: HouseholdInvitationStatusEnum.PENDING,
};
