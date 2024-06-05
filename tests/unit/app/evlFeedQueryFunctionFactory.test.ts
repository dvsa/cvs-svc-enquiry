import { mocked } from 'ts-jest/utils';
import queryFunctionFactory from '../../../src/app/evlFeedQueryFunctionFactory';
import * as dbFunctions from '../../../src/app/databaseService';
import DatabaseService from '../../../src/infrastructure/databaseService';
import { FeedName } from '../../../src/interfaces/FeedTypes';

jest.mock('../../../src/app/databaseService');
jest.mock('../../../src/infrastructure/databaseService');

const dbFunctionsMock = mocked(dbFunctions);
const dbServiceMock = (mocked(DatabaseService, true) as unknown) as DatabaseService;

describe('Query Function Factory', () => {
  it('returns the correct function when passed a vin', () => {
    dbFunctionsMock.getEvlFeedByVrm = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({ vrm_trm: '1234' });

    expect(func(dbServiceMock, FeedName.EVL, { vrm_trm: '1234' })).toEqual('Success');
  });

  it('return the correct function when passed no parameter', () => {
    dbFunctionsMock.getFeed = jest.fn().mockReturnValue('Success');

    const func = queryFunctionFactory({});

    expect(func(dbServiceMock, FeedName.EVL, {})).toEqual('Success');
  });
});
