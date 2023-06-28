import supertest from 'supertest';
import { app } from '../../../../src/infrastructure/api';
import * as enquiryService from '../../../../src/domain/enquiryService';
import DatabaseService from '../../../../src/infrastructure/databaseService';
import VehicleDetails from '../../../../src/interfaces/queryResults/technical/vehicleDetails';
import DatabaseServiceInterface from '../../../../src/interfaces/DatabaseService';
import ParametersError from '../../../../src/errors/ParametersError';
import TestResult from '../../../../src/interfaces/queryResults/test/testResult';
import NotFoundError from '../../../../src/errors/NotFoundError';
import EvlFeedData from '../../../../src/interfaces/queryResults/evlFeedData';
import * as upload from '../../../../src/infrastructure/s3BucketService';
import TflFeedData from '../../../../src/interfaces/queryResults/tflFeedData';

// TODO Define Mock strategy
describe('API', () => {
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('GET', () => {
    it("should return '{ok: true}' when hitting '/' route", async () => {
      const result = await supertest(app).get('/v1/enquiry/');
      const resultContent = JSON.parse(result.text) as { ok: boolean };

      expect(result.status).toEqual(200);
      expect(resultContent).toHaveProperty('ok');
      expect(resultContent.ok).toEqual(true);
    });

    it(`should return '{version: ${process.env.API_VERSION}}' when hitting '/version' route`, async () => {
      const result = await supertest(app).get('/v1/enquiry/version');
      const resultContent = JSON.parse(result.text) as { version: string };

      expect(result.status).toEqual(200);
      expect(resultContent).toHaveProperty('version');
      expect(resultContent.version).toEqual(process.env.API_VERSION);
    });

    it('returns a 404 if the method is not supported', async () => {
      const resultPost = await supertest(app).post('/v1/enquiry/not-a-route');

      expect(resultPost.status).toEqual(404);
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
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockResolvedValue(vehicleDetails as VehicleDetails);
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');
        const resultContent = JSON.parse(result.text) as VehicleDetails;

        expect(resultContent.vin).toEqual('vin1');
      });

      it('returns the error message if there is an error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(result.text).toEqual('This is an error');
      });

      it('sets the status to 400 for a parameters error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new ParametersError('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(400);
      });

      it('sets the status to 404 for a not found error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new NotFoundError());
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(404);
      });

      it('sets the status to 500 for a generic error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(500);
      });

      it('sets the status to 500 for a secrets error', async () => {
        process.env.IS_OFFLINE = 'true';
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getVehicleDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(result.status).toEqual(500);
      });

      it('returns a 405 if the method is not supported', async () => {
        const resultPost = await supertest(app).post('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(resultPost.status).toEqual(405);

        const resultPut = await supertest(app).put('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(resultPut.status).toEqual(405);

        const resultPatch = await supertest(app).patch('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(resultPatch.status).toEqual(405);

        const resultDelete = await supertest(app).delete('/v1/enquiry/vehicle?vinNumber=123456789');

        expect(resultDelete.status).toEqual(405);
      });
    });

    describe('Results enquiry', () => {
      it('returns the db query result if there are no errors', async () => {
        const resultDetails = {
          testStatus: 'Success',
        } as TestResult;
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getResultsDetails').mockResolvedValue([resultDetails]);
        const result = await supertest(app).get('/v1/enquiry/testResults?vinNumber=123456789');
        const resultContent = JSON.parse(result.text) as [TestResult];

        expect(resultContent[0].testStatus).toEqual('Success');
      });

      it('returns the error message if there is an error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/testResults?vinNumber=123456789');

        expect(result.text).toEqual('This is an error');
      });

      it('sets the status to 400 for a parameters error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new ParametersError('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/testResults?vinNumber=123456789');

        expect(result.status).toEqual(400);
      });

      it('sets the status to 404 for a not found error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new NotFoundError('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/testResults?vinNumber=123456789');

        expect(result.status).toEqual(404);
      });

      it('sets the status to 500 for a generic error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getResultsDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/testResults?vinNumber=123456789');

        expect(result.status).toEqual(500);
      });

      it('returns a 405 if the method is not supported', async () => {
        const resultPost = await supertest(app).post('/v1/enquiry/testResults?vinNumber=123456789');

        expect(resultPost.status).toEqual(405);

        const resultPut = await supertest(app).put('/v1/enquiry/testResults?vinNumber=123456789');

        expect(resultPut.status).toEqual(405);

        const resultPatch = await supertest(app).patch('/v1/enquiry/testResults?vinNumber=123456789');

        expect(resultPatch.status).toEqual(405);

        const resultDelete = await supertest(app).delete('/v1/enquiry/testResults?vinNumber=123456789');

        expect(resultDelete.status).toEqual(405);
      });
    });

    describe('EVL Feed', () => {
      it('returns the db query result if there are no errors', async () => {
        const evlFeedData: EvlFeedData = {
          certificateNumber: '123',
          testExpiryDate: '2020/01/20',
          vrm_trm: '123',
        };
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(upload, 'uploadToS3').mockImplementation((_data, _fileName, callback) => callback());
        jest.spyOn(enquiryService, 'getFeedDetails').mockResolvedValue([evlFeedData]);
        const result = await supertest(app).get('/v1/enquiry/evl');
        expect(result.status).toEqual(200);
      });

      it('returns the error message if there is an error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/evl');

        expect(result.text).toEqual('Error Generating EVL Feed Data: This is an error');
      });

      it('sets the status to 400 for a parameters error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new ParametersError('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/evl');

        expect(result.status).toEqual(400);
      });

      it('sets the status to 404 for a not found error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new NotFoundError('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/evl');

        expect(result.status).toEqual(404);
      });

      it('sets the status to 500 for a generic error', async () => {
        DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
        jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new Error('This is an error'));
        const result = await supertest(app).get('/v1/enquiry/evl');

        expect(result.status).toEqual(500);
      });
    });
  });

  describe('TFL Feed', () => {
    it('returns the db query result if there are no errors', async () => {
      const tflFeedData: TflFeedData = {
        VRM: '12345',
        VIN: '56789',
        CertificationModificationType: 'CeRt1234',
        PMEuropeanEmissionClassificationCode: 'type 1',
        TestStatus: 'submitted, done',
        ValidFromDate: '123',
        ExpiryDate: 'now',
        IssueDate: 'before "they said"',
        IssuedBy: 'some person',
      };
      DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
      jest.spyOn(upload, 'uploadToS3').mockImplementation((_data, _fileName, callback) => callback());
      jest.spyOn(enquiryService, 'getFeedDetails').mockResolvedValue([tflFeedData]);
      const result = await supertest(app).get('/v1/enquiry/tfl');
      expect(result.status).toEqual(200);
    });

    it('returns the error message if there is an error', async () => {
      DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
      jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new Error('This is an error'));
      const result = await supertest(app).get('/v1/enquiry/tfl');

      expect(result.text).toEqual('Error Generating TFL Feed Data: This is an error');
    });

    it('sets the status to 400 for a parameters error', async () => {
      DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
      jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new ParametersError('This is an error'));
      const result = await supertest(app).get('/v1/enquiry/tfl');

      expect(result.status).toEqual(400);
    });

    it('sets the status to 404 for a not found error', async () => {
      DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
      jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new NotFoundError('This is an error'));
      const result = await supertest(app).get('/v1/enquiry/tfl');

      expect(result.status).toEqual(404);
    });

    it('sets the status to 500 for a generic error', async () => {
      DatabaseService.build = jest.fn().mockResolvedValue({} as DatabaseServiceInterface);
      jest.spyOn(enquiryService, 'getFeedDetails').mockRejectedValue(new Error('This is an error'));
      const result = await supertest(app).get('/v1/enquiry/tfl');

      expect(result.status).toEqual(500);
    });
  });
});
