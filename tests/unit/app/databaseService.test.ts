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
import * as testQueries from '../../../src/app/queries/testResults';

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
          .mockResolvedValueOnce([
            [
              { id: '1', result: { brakeCode: 'Test brakes' } } as RowDataPacket,
              { id: '2', result: { brakeCode: 'Test brakes 2' } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([
            [
              { id: '1', result: { axleNumber: 1 } } as RowDataPacket,
              { id: '2', result: { axleNumber: 2 } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([
            [
              { id: '1', result: { axles: 'Test axle spacing' } } as RowDataPacket,
              { id: '2', result: { axles: 'Test axle spacing 2' } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([
            [
              { id: '1', result: { plateSerialNumber: 'Test plate' } } as RowDataPacket,
              { id: '2', result: { plateSerialNumber: 'Test plate 2' } } as RowDataPacket,
            ],
            [],
          ]),
      };

      const result = await getVehicleDetailsByVin(mockDbService, event);

      expect(result.vin).toEqual(event.vinNumber);
      expect(result.technicalrecords).toHaveLength(1);
      expect(result.technicalrecords[0].functionCode).toEqual('Test tech record');
      expect(result.technicalrecords[0].psvBrakes).toHaveLength(2);
      expect(result.technicalrecords[0].psvBrakes[0].brakeCode).toEqual('Test brakes');
      expect(result.technicalrecords[0].axles).toHaveLength(2);
      expect(result.technicalrecords[0].axles[0].axleNumber).toEqual(1);
      expect(result.technicalrecords[0].axlespacing).toHaveLength(2);
      expect(result.technicalrecords[0].axlespacing[0].axles).toEqual('Test axle spacing');
      expect(result.technicalrecords[0].plates).toHaveLength(2);
      expect(result.technicalrecords[0].plates[0].plateSerialNumber).toEqual('Test plate');
    });
  });

  describe('get Test Results', () => {
    it('passes the expected SQL query to the infrastructure DB service for get by VRM', async () => {
      const event = { VehicleRegMark: '123478' };
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      await getTestResultsByVrm(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RESULTS_BY_VRM);
    });

    it('passes the expected SQL query to the infrastructure DB service for get by VIN', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      const event = { vinNumber: '123478' };

      await getTestResultsByVin(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RESULTS_BY_VIN);
    });

    it('passes the expected SQL query to the infrastructure DB service for get by test ID', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      const event = { testnumber: '23343423423' };

      await getTestResultsByTestId(mockDbService, event);

      expect(mockDbService.get.mock.calls[0][0]).toEqual(testQueries.TEST_RESULTS_BY_TEST_NUMBER);
    });

    it('does not include customDefect in the response if nothing is returned', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[], []])
          .mockResolvedValueOnce([[{ id: '1', result: { imDescription: 'Test defect' } } as RowDataPacket], []]),
      };

      const event = { testnumber: '23343423423' };

      const response = await getTestResultsByTestId(mockDbService, event);

      expect(response[0].customDefect).toEqual([]);
    });

    it('does not include defects in the response if nothing is returned', async () => {
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([[{ id: '1', result: { description: 'Test Record' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[{ id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket], []])
          .mockResolvedValueOnce([[], []]),
      };

      const event = { testnumber: '23343423423' };

      const response = await getTestResultsByTestId(mockDbService, event);

      expect(response[0].defects).toEqual([]);
    });

    it('correctly returns response if everything works', async () => {
      const event = { VehicleRegMark: '123478' };
      const mockDbService = {
        get: jest
          .fn<Promise<[RowDataPacket[], FieldPacket[]]>, [query: string, params: string[]]>()
          .mockResolvedValueOnce([
            [
              { id: '1', result: { description: 'Test Record' } } as RowDataPacket,
              { id: '2', result: { description: 'Test Record 2' } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([
            [
              { id: '1', result: { defectName: 'Custom defect' } } as RowDataPacket,
              { id: '2', result: { defectName: 'Custom defect 2' } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([
            [
              { id: '1', result: { defect: { imDescription: 'Test defect' } } } as RowDataPacket,
              { id: '2', result: { defect: { imDescription: 'Test defect 2' } } } as RowDataPacket,
            ],
            [],
          ])
          .mockResolvedValueOnce([[], []])
          .mockResolvedValueOnce([[], []]),
      };

      const response = await getTestResultsByVrm(mockDbService, event);

      expect(response).toHaveLength(2);
      expect(response[0].customDefect).toHaveLength(2);
      expect(response[0].defects).toHaveLength(2);
      expect(response[0].customDefect[0].defectName).toEqual('Custom defect');
      expect(response[0].defects[1].defect.imDescription).toEqual('Test defect 2');
    });
  });
});
