import supertest from 'supertest';
import { FieldPacket } from 'mysql2/promise';
import { app } from '../../../../src/infrastructure/api';
import * as enquiryService from '../../../../src/domain/enquiryService';
import VehicleDetails from '../../../../src/interfaces/queryResults/vehicleDetails';
import ParametersError from '../../../../src/errors/ParametersError';
import TestRecord from '../../../../src/interfaces/queryResults/testRecord';

// TODO Define Mock strategy
describe('API', () => {
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('GET', () => {
    it("should return '{ok: true}' when hitting '/' route", async () => {
      const result = await supertest(app).get('/');
      const resultContent = JSON.parse(result.text) as { ok: boolean };

      expect(result.status).toEqual(200);
      expect(resultContent).toHaveProperty('ok');
      expect(resultContent.ok).toEqual(true);
    });

    it(`should return '{version: ${process.env.API_VERSION}}' when hitting '/version' route`, async () => {
      const result = await supertest(app).get('/version');
      const resultContent = JSON.parse(result.text) as { version: string };

      expect(result.status).toEqual(200);
      expect(resultContent).toHaveProperty('version');
      expect(resultContent.version).toEqual(process.env.API_VERSION);
    });

    describe('Vehicle enquiry', () => {
      it('returns the db query result if there are no errors', async () => {
        const vehicleDetails = {
          system_number: '1',
          vrm_trm: 'aa11aaa',
          trailer_id: '123456789',
          vin: 'vin1',
          technicalrecords: [],
        };
        jest.spyOn(enquiryService, 'getVehicleDetails').mockResolvedValue(vehicleDetails as VehicleDetails);
        const result = await supertest(app).get('/enquiry/vehicle?vinNumber=123456789');
        const resultContent = JSON.parse(result.text) as VehicleDetails;

        expect(resultContent.vin).toEqual('vin1');
      });

      it('returns the error message if there is an error', async () => {
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/enquiry/vehicle?vinNumber=123456789');

        expect(result.text).toEqual('This is an error');
      });

      it('sets the status to 400 for a parameters error', async () => {
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new ParametersError('This is an error'));
        const result = await supertest(app).get('/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(400);
      });

      it('sets the status to 500 for a generic error', async () => {
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(500);
      });
    });

    describe('Results enquiry', () => {
      it('returns the db query result if there are no errors', async () => {
        const resultDetails = {
          technical_record_id: 1,
          vehicle_id: 2,
          fuel_emission_id: 3,
          test_station_id: 4,
          tester_id: 5,
          preparer_id: 6,
          vehicle_class_id: 7,
          test_type_id: 8,
          testStatus: 9,
        } as TestRecord;
        const fieldPacket = {} as FieldPacket;
        jest.spyOn(enquiryService, 'getResultsDetails').mockResolvedValue([[resultDetails], [fieldPacket]]);
        const result = await supertest(app).get('/enquiry/results?vinNumber=123456789');
        const resultContent = JSON.parse(result.text) as [TestRecord];

        expect(resultContent[0].technical_record_id).toEqual(1);
      });

      it('returns the error message if there is an error', async () => {
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/enquiry/results?vinNumber=123456789');

        expect(result.text).toEqual('This is an error');
      });

      it('sets the status to 400 for a parameters error', async () => {
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new ParametersError('This is an error'));
        const result = await supertest(app).get('/enquiry/results?vinNumber=123456789');

        expect(result.status).toEqual(400);
      });

      it('sets the status to 500 for a generic error', async () => {
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/enquiry/results?vinNumber=123456789');

        expect(result.status).toEqual(500);
      });
    });
  });
});
