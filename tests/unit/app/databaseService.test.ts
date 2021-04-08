import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import {
  getResultsByVin,
  getResultsByTestId,
  getResultsByVrm,
  getVehicleDetailsByTrailerId,
  getVehicleDetailsByVin,
  getVehicleDetailsByVrm,
} from '../../../src/app/databaseService';
import * as technicalQueries from '../../../src/app/queries/technicalRecord';
import * as testQueries from '../../../src/app/queries/testRecords';

describe('Database Service', () => {
  describe('getVehicleDetailsByVrm', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { VehicleRegMark: 'aa11AAA' };

      await getVehicleDetailsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_VRM_QUERY);
    });
  });
  describe('getVehicleDetailsByVin', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vinNumber: '123478' };

      await getVehicleDetailsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_VIN_QUERY);
    });
  });
  describe('getVehicleDetailsByTrailerId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { trailerId: '123478' };

      await getVehicleDetailsByTrailerId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(technicalQueries.VEHICLE_DETAILS_TRAILER_ID_QUERY);
    });
  });

  describe('getResultsByVrm', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vrm: '123478' };

      await getResultsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_VRM);
    });
  });
  describe('getResultsByVin', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { vin: '123478', test_id: '23343423423' };

      await getResultsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_VIN);
    });
  });
  describe('getResultsByTestId', () => {
    it('passes the expected SQL query to the infrastructure DB service', async () => {
      const mockDbService = {
        get: jest.fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>(),
      };

      const event = { test_id: '23343423423' };

      await getResultsByTestId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RECORD_BY_TEST_NUMBER);
    });
  });
});
