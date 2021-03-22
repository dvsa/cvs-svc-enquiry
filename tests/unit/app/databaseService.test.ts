import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import {
  getResultsByVehicleId,
  getResultsByVehicleIdAndTestId,
  getVehicleDetailsByTrailerId,
  getVehicleDetailsByVin,
  getVehicleDetailsByVrm,
} from '../../../src/app/databaseService';
import * as queries from '../../../src/contants';

describe('Database Service', () => {
  describe('getVehicleDetailsByVrm', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { VehicleRegMark: 'aa11AAA' };

      await getVehicleDetailsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(queries.VEHICLE_DETAILS_VRM_QUERY);
    });
  });
  describe('getVehicleDetailsByVin', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vinNumber: '123478' };

      await getVehicleDetailsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(queries.VEHICLE_DETAILS_VIN_QUERY);
    });
  });
  describe('getVehicleDetailsByTrailerId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { trailerId: '123478' };

      await getVehicleDetailsByTrailerId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(queries.VEHICLE_DETAILS_TRAILER_ID_QUERY);
    });
  });
  describe('getResultsByVehicleId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vehicle: '123478' };

      await getResultsByVehicleId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(queries.RESULTS_QUERY);
    });
  });
  describe('getResultsByVehicleIdAndTestId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vehicle: '123478', test_id: '23343423423' };

      await getResultsByVehicleIdAndTestId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(queries.RESULTS_QUERY);
    });
  });
});
