import { mocked } from 'ts-jest/utils';
import queryFunctionFactory from '../../../src/app/testQueryFunctionFactory';
import * as dbFunctions from '../../../src/app/databaseService';
import DatabaseService from '../../../src/infrastructure/databaseService';

jest.mock('../../../src/app/databaseService');
jest.mock('../../../src/infrastructure/databaseService');

const dbFunctionsMock = mocked(dbFunctions);
const dbServiceMock = (mocked(DatabaseService, true) as unknown) as DatabaseService;

describe('Query Function Factory', () => {
  it('returns the correct function when passed a vin', () => {
    dbFunctionsMock.getResultsByVin = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ vin: '1234' });

    expect(func(dbServiceMock, { vin: '1234' })).toEqual('Success');
  });
  it('returns the correct function when passed a vrm', () => {
    dbFunctionsMock.getResultsByVrm = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ vrm: '1234' });

    expect(func(dbServiceMock, { vrm: '1234' })).toEqual('Success');
  });
  it('returns the correct function when passed a trailer ID', () => {
    dbFunctionsMock.getResultsByTestId = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ test_id: '1234' });

    expect(func(dbServiceMock, { test_id: '1234' })).toEqual('Success');
  });
});
