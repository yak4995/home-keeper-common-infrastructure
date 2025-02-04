import { Injectable } from '@nestjs/common';

import {
  TransactionInputPort,
  ITransaction,
  ITransactionDto,
  IIdentificationDto,
  IProjectionDto,
  ListResponse,
  SystemOpts,
  IListDto,
  FilterCriteria,
  TransactionAnalyticInputPort,
  ITransactionAnalyticDto,
  ITransactionChangeAnalyticDto,
  IAnalyticComparisonDto,
  ID,
} from '@yak4995/home-keeper-core';

import { HomeKeeperServiceGateway } from '../gateways/home-keeper-service.gateway';

@Injectable()
export class TransactionsFacade
  implements TransactionInputPort, TransactionAnalyticInputPort
{
  constructor(private readonly busGateway: HomeKeeperServiceGateway) {}

  public getTransactions(
    payload: IListDto<ITransaction>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransaction>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransaction>
    >('transactions.list', { ...payload, trace }, 1000);
  }

  public getConvertedTransactions(
    payload: IListDto<ITransaction> & { targetCurrency: ID },
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransaction>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransaction>
    >('transactions.converted-list', { ...payload, trace }, 2000);
  }

  public getTransactionDetails(
    payload: IIdentificationDto & IProjectionDto<ITransaction>,
    { trace }: SystemOpts,
  ): Promise<ITransaction> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransaction
    >(
      'transactions.findOneById',
      { ...payload, trace },
      1000,
      `TransactionDetails_${payload.id}`,
    );
  }

  public createTransaction(
    payload: ITransactionDto,
    { trace }: SystemOpts,
  ): Promise<ITransaction> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransaction
    >('transactions.create', { ...payload, trace }, 1000);
  }

  public updateTransaction(
    payload: IIdentificationDto & ITransactionDto,
    { trace }: SystemOpts,
  ): Promise<ITransaction> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransaction
    >('transactions.update', { ...payload, trace }, 1000);
  }

  public deleteTransaction(
    payload: IIdentificationDto,
    { trace }: SystemOpts,
  ): Promise<ITransaction> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ITransaction
    >('transactions.delete', { ...payload, trace }, 1000);
  }

  public batchCreateTransactions(
    payload: { data: ITransactionDto[] },
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransaction>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransaction>
    >('transactions.batch-create', { ...payload, trace }, 5000);
  }

  public batchUpdateTransactions(
    payload: {
      data: Omit<
        IIdentificationDto & ITransactionDto,
        'transactionCategoryId'
      >[];
    } & Pick<ITransactionDto, 'transactionCategoryId'>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransaction>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransaction>
    >('transactions.batch-update', { ...payload, trace }, 5000);
  }

  public batchDeleteTransactions(
    payload: FilterCriteria<ITransaction>,
    { trace }: SystemOpts,
  ): Promise<ListResponse<ITransaction>> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      ListResponse<ITransaction>
    >('transactions.batch-delete', { ...payload, trace }, 5000);
  }

  public syncRate(
    payload: { from: ID; to: ID; forDate: Date; rate: number },
    { trace }: SystemOpts,
  ): Promise<{ result: boolean }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: boolean }
    >('transactions.sync-rate', { ...payload, trace }, 1000);
  }

  public getMaxTransaction(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.max', { ...payload, trace }, 1000);
  }

  public getMinTransaction(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.min', { ...payload, trace }, 1000);
  }

  public getTransactionsCount(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.count', { ...payload, trace }, 1000);
  }

  public getTransactionsSum(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.sum', { ...payload, trace }, 1000);
  }

  public getTransactionsAverage(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.avg', { ...payload, trace }, 1000);
  }

  public getTransactionsMedian(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<{ result: number }> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      { result: number }
    >('transactions.median', { ...payload, trace }, 1000);
  }

  public getTransactionsSumRatio(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<IAnalyticComparisonDto> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAnalyticComparisonDto
    >('transactions.sum-ratio', { ...payload, trace }, 1000);
  }

  public getTransactionsCountRatio(
    payload: ITransactionAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<IAnalyticComparisonDto> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAnalyticComparisonDto
    >('transactions.count-ratio', { ...payload, trace }, 1000);
  }

  public getTransactionsChange(
    payload: ITransactionChangeAnalyticDto,
    { trace }: SystemOpts,
  ): Promise<IAnalyticComparisonDto> {
    return this.busGateway.callServiceThroughtBus<
      typeof payload & SystemOpts,
      IAnalyticComparisonDto
    >('transactions.change', { ...payload, trace }, 1000);
  }
}
