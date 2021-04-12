import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import {
  getTestResultsByVin,
  getTestResultsByTestId,
  getTestResultsByVrm,
  getVehicleDetailsByTrailerId,
  getVehicleDetailsByVin,
  getVehicleDetailsByVrm,
} from '../../../src/app/databaseService';
import * as technicalQueries from '../../../src/app/queries/technicalRecord';
import * as testQueries from '../../../src/app/queries/testRecords';

describe('Database Service', () => {
  describe('Get vehicle details', () => {
    it('passes the expected SQL query to the infrastructure DB service for get by VRM', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValue([[{ id: '', result: {} } as RowDataPacket], []]),
      };

      const event = { VehicleRegMark: 'aa11AAA' };

      await getVehicleDetailsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_VRM_QUERY);
    });

    it('passes the expected SQL query to the infrastructure DB service for get by VIN', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValue([[{ id: '', result: {} } as RowDataPacket], []]),
      };

      const event = { vinNumber: '123478' };

      await getVehicleDetailsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_VIN_QUERY);
    });

    it('passes the expected SQL query to the infrastructure DB service for get by trailer ID', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValue([[{ id: '', result: {} } as RowDataPacket], []]),
      };

      const event = { trailerId: '123478' };

      await getVehicleDetailsByTrailerId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_TRAILER_ID_QUERY);
    });

    it('correctly fills out all subsections of a response', async () => {
      const event = { vinNumber: '123478' };
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { vin: event.vinNumber } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { functionCode: 'Test tech record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { brakeCode: 'Test brakes' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { axleNumber: 1 } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { axles: 'Test axle spacing' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { plateSerialNumber: 'Test plate' } } as RowDataPacket], []]),
      };

      const result = await getVehicleDetailsByVin(mockDbService, event);

      expect(result.vin).toEqual(event.vinNumber);
      expect(result.technicalrecords).toHaveLength(1);
      expect(result.technicalrecords[0].functionCode).toEqual('Test tech record');
      expect(result.technicalrecords[0].brakes).toHaveLength(1);
      expect(result.technicalrecords[0].brakes[0].brakeCode).toEqual('Test brakes');
      expect(result.technicalrecords[0].axles).toHaveLength(1);
      expect(result.technicalrecords[0].axles[0].axleNumber).toEqual(1);
      expect(result.technicalrecords[0].axlespacing).toHaveLength(1);
      expect(result.technicalrecords[0].axlespacing[0].axles).toEqual('Test axle spacing');
      expect(result.technicalrecords[0].plates).toHaveLength(1);
      expect(result.technicalrecords[0].plates[0].plateSerialNumber).toEqual('Test plate');
    });
  });

  describe('getTestResultsByVrm', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const event = { VehicleRegMark: '123478' };
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      await getTestResultsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_VRM);
    });
  });
  describe('getTestResultsByVin', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      const event = { vinNumber: '123478' };

      await getTestResultsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_VIN);
    });
  });
  describe('getTestResultsByTestId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      const event = { testnumber: '23343423423' };

      await getTestResultsByTestId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_TEST_NUMBER);
    });
  });
});
