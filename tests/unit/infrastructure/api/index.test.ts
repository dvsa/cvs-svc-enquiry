import supertest from 'supertest';
import { app } from '../../../../src/infrastructure/api';
import * as enquiryService from '../../../../src/domain/enquiryService';
import VehicleDetails from '../../../../src/interfaces/queryResults/vehicleDetails';

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
    });
  });
});
