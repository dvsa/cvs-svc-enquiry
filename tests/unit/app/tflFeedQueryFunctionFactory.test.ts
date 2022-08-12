import { mocked } from 'ts-jest/utils';
import queryFunctionFactory from '../../../src/app/tflFeedQueryFunctionFactory';
import * as dbFunctions from '../../../src/app/databaseService';
import DatabaseService from '../../../src/infrastructure/databaseService';

jest.mock('../../../src/app/databaseService');
jest.mock('../../../src/infrastructure/databaseService');

const dbFunctionsMock = mocked(dbFunctions);
const dbServiceMock = (mocked(DatabaseService, true) as unknown) as DatabaseService;

describe('Query Function Factory', () => {
  it('returns the correct function when passed no parameters', () => {
    dbFunctionsMock.getTflFeed = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory();

    expect(func(dbServiceMock)).toEqual('Success');
  });
});
