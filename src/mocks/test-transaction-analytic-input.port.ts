import {
  IAnalyticComparisonDto,
  TransactionAnalyticInputPort,
} from '@yak4995/home-keeper-core';

export class TestTransactionAnalyticInputPort
  implements TransactionAnalyticInputPort
{
  public async getMaxTransaction(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getMinTransaction(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getTransactionsCount(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getTransactionsSum(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getTransactionsAverage(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getTransactionsMedian(): Promise<{ result: number }> {
    return { result: 0 };
  }

  public async getTransactionsSumRatio(): Promise<IAnalyticComparisonDto> {
    return {};
  }

  public async getTransactionsCountRatio(): Promise<IAnalyticComparisonDto> {
    return {};
  }

  public async getTransactionsChange(): Promise<IAnalyticComparisonDto> {
    return {};
  }
}
