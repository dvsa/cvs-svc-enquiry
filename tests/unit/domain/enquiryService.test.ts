import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import { getVehicleDetails, getResultsDetails } from '../../../src/domain/enquiryService';
import DatabaseService from '../../../src/interfaces/DatabaseService';
import * as databaseService from '../../../src/app/databaseService';
import TestRecord from '../../../src/interfaces/queryResults/test/testRecord';
import testQueryFunctionFactory from '../../../src/app/testQueryFunctionFactory';

jest.mock('../../../src/app/databaseService');

describe('Enquiry Service', () => {
  describe('getVehicleDetails', () => {
    it('returns the result of a query', async () => {
      const event = { trailerId: '1234' };
      const mockQuery = jest.fn().mockResolvedValue('Success');
      const mockFactory = jest.fn().mockReturnValue(mockQuery);
      const mockDbService = {} as DatabaseService;

      expect(await getVehicleDetails(event, mockFactory, mockDbService)).toEqual('Success');
    });
  });

  describe('getResultsDetails', () => {
    it('returns the result of a query', async () => {
      const event = { vrm: '1234' };
      const testRecord = {
        testStatus: 'Success',
      } as TestRecord;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByVrm').mockResolvedValue([[testRecord], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      const result = await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(result[0].testStatus).toEqual('Success');
    });

    it('uses the VIN query if only a VIN is passed', async () => {
      const event = { vin: '1234' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByVin').mockResolvedValue([[rowDataPacket], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(databaseService.getResultsByVin).toHaveBeenCalled();
    });

    it('uses the vehicle and test query if a vehicle Id and a test id are passed', async () => {
      const event = { test_id: '123165446' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByTestId').mockResolvedValue([[rowDataPacket], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(databaseService.getResultsByTestId).toHaveBeenCalled();
    });
  });
});
