import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import { getVehicleDetails, getResultsDetails } from '../../../src/domain/enquiryService';
import DatabaseService from '../../../src/interfaces/DatabaseService';
import * as databaseService from '../../../src/app/databaseService';

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
      const event = { vehicle: '1234' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByVehicleId').mockResolvedValue([[rowDataPacket], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      const result = await getResultsDetails(event, mockDbService);

      expect(result[0][0].result).toEqual('Success');
    });

    it('uses the vehicle only query if only a vehicle Id is passed', async () => {
      const event = { vehicle: '1234' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByVehicleId').mockResolvedValue([[rowDataPacket], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, mockDbService);

      expect(databaseService.getResultsByVehicleId).toHaveBeenCalled();
    });

    it('uses the vehicle and test query if a vehicle Id and a test id are passed', async () => {
      const event = { vehicle: '1234', test_id: '123165446' };
      const rowDataPacket = { result: 'Success' } as RowDataPacket;
      const fieldPacket = {} as FieldPacket;
      jest.spyOn(databaseService, 'getResultsByVehicleIdAndTestId').mockResolvedValue([[rowDataPacket], [fieldPacket]]);
      const mockDbService = {} as DatabaseService;

      await getResultsDetails(event, mockDbService);

      expect(databaseService.getResultsByVehicleIdAndTestId).toHaveBeenCalled();
    });
  });
});
