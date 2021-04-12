import { RowDataPacket } from 'mysql2/promise';
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
      const event = { VehicleRegMark: '1234' };
      const testRecord = {
        testStatus: 'Success',
      } as TestRecord;
      jest.spyOn(databaseService, 'getTestResultsByVrm').mockResolvedValue([testRecord]);
      const mockDbService = {} as DatabaseService;

      const result = await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(result[0].testStatus).toEqual('Success');
    });

    it('uses the VIN query if only a VIN is passed', async () => {
      const event = { vinNumber: '1234' };
      const rowDataPacket = { result: 'Success' } as TestRecord;
      jest.spyOn(databaseService, 'getTestResultsByVin').mockResolvedValue([rowDataPacket]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(databaseService.getTestResultsByVin).toHaveBeenCalled();
    });

    it('uses the vehicle and test query if a vehicle Id and a test id are passed', async () => {
      const event = { testnumber: '123165446' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      jest.spyOn(databaseService, 'getTestResultsByTestId').mockResolvedValue([rowDataPacket]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, testQueryFunctionFactory, mockDbService);

      expect(databaseService.getTestResultsByTestId).toHaveBeenCalled();
    });
  });
});
