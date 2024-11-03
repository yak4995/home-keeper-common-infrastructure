import {
  ICurrency,
  ILanguage,
  ITimezone,
  SystemInputPort,
} from '@yak4995/home-keeper-core';

import { currencyFixture, languageFixture, timezoneFixture } from '../fixtures';

export class TestSystemInputPort implements SystemInputPort {
  getListOfCurrencies(): Promise<ICurrency[]> {
    throw new Error('Method not implemented.');
  }

  getCurrencyById(): Promise<ICurrency> {
    return Promise.resolve(currencyFixture);
  }

  createCurrency(): Promise<ICurrency> {
    throw new Error('Method not implemented.');
  }

  updateCurrency(): Promise<ICurrency> {
    throw new Error('Method not implemented.');
  }

  deleteCurrency(): Promise<ICurrency> {
    throw new Error('Not implemented');
  }

  getListOfLanguages(): Promise<ILanguage[]> {
    throw new Error('Method not implemented.');
  }

  getLangById(): Promise<ILanguage> {
    return Promise.resolve(languageFixture);
  }

  createLanguage(): Promise<ILanguage> {
    throw new Error('Method not implemented.');
  }

  updateLanguage(): Promise<ILanguage> {
    throw new Error('Method not implemented.');
  }

  deleteLanguage(): Promise<ILanguage> {
    throw new Error('Not implemented');
  }

  getListOfTimezones(): Promise<ITimezone[]> {
    throw new Error('Method not implemented.');
  }

  getTzById(): Promise<ITimezone> {
    return Promise.resolve(timezoneFixture);
  }

  createTimezone(): Promise<ITimezone> {
    throw new Error('Method not implemented.');
  }

  updateTimezone(): Promise<ITimezone> {
    throw new Error('Method not implemented.');
  }

  deleteTimezone(): Promise<ITimezone> {
    throw new Error('Not implemented');
  }
}
