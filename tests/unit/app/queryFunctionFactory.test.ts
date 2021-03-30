import { mocked } from 'ts-jest';
import queryFunctionFactory from '../../../src/app/queryFunctionFactory';
import * as dbFunctions from '../../../src/app/databaseService';
import DatabaseService from '../../../src/infrastructure/databaseService';

jest.mock('../../../src/app/databaseService');
jest.mock('../../../src/infrastructure/databaseService');

const dbFunctionsMock = mocked(dbFunctions);
const dbServiceMock = (mocked(DatabaseService, true) as unknown) as DatabaseService;

describe('Query Function Factory', () => {
  it('returns the correct function when passed a vin', () => {
    dbFunctionsMock.getVehicleDetailsByVin = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ vinNumber: '1234' });

    expect(func(dbServiceMock, { vinNumber: '1234' })).toEqual('Success');
  });
  it('returns the correct function when passed a vrm', () => {
    dbFunctionsMock.getVehicleDetailsByVrm = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ VehicleRegMark: '1234' });

    expect(func(dbServiceMock, { VehicleRegMark: '1234' })).toEqual('Success');
  });
  it('returns the correct function when passed a trailer ID', () => {
    dbFunctionsMock.getVehicleDetailsByTrailerId = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ trailerId: '1234' });

    expect(func(dbServiceMock, { trailerId: '1234' })).toEqual('Success');
  });
});
