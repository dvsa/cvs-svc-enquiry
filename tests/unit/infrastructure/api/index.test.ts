import supertest from 'supertest';
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

    it('returns a 405 if the method is not supported', async () => {
      const resultPost = await supertest(app).post('/enquiry/vehicle?vinNumber=123456789');

      expect(resultPost.status).toEqual(405);

      const resultPut = await supertest(app).put('/enquiry/vehicle?vinNumber=123456789');

      expect(resultPut.status).toEqual(405);

      const resultPatch = await supertest(app).patch('/enquiry/vehicle?vinNumber=123456789');

      expect(resultPatch.status).toEqual(405);

      const resultDelete = await supertest(app).delete('/enquiry/vehicle?vinNumber=123456789');

      expect(resultDelete.status).toEqual(405);
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

      it('returns a 405 if the method is not supported', async () => {
        const resultPost = await supertest(app).post('/enquiry/vehicle?vinNumber=123456789');

        expect(resultPost.status).toEqual(405);

        const resultPut = await supertest(app).put('/enquiry/vehicle?vinNumber=123456789');

        expect(resultPut.status).toEqual(405);

        const resultPatch = await supertest(app).patch('/enquiry/vehicle?vinNumber=123456789');

        expect(resultPatch.status).toEqual(405);

        const resultDelete = await supertest(app).delete('/enquiry/vehicle?vinNumber=123456789');

        expect(resultDelete.status).toEqual(405);
      });
    });

    describe('Results enquiry', () => {
      it('returns the db query result if there are no errors', async () => {
        const resultDetails = {
          testStatus: 'Success',
        } as TestRecord;
        jest.spyOn(enquiryService, 'getResultsDetails').mockResolvedValue([resultDetails]);
        const result = await supertest(app).get('/enquiry/results?vinNumber=123456789');
        const resultContent = JSON.parse(result.text) as [TestRecord];

        expect(resultContent[0].testStatus).toEqual('Success');
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

      it('returns a 405 if the method is not supported', async () => {
        const resultPost = await supertest(app).post('/enquiry/results?vinNumber=123456789');

        expect(resultPost.status).toEqual(405);

        const resultPut = await supertest(app).put('/enquiry/results?vinNumber=123456789');

        expect(resultPut.status).toEqual(405);

        const resultPatch = await supertest(app).patch('/enquiry/results?vinNumber=123456789');

        expect(resultPatch.status).toEqual(405);

        const resultDelete = await supertest(app).delete('/enquiry/results?vinNumber=123456789');

        expect(resultDelete.status).toEqual(405);
      });
    });
  });
});
