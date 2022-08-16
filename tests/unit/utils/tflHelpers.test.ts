import { processTFLFeedData, escapeString } from '../../../src/utils/tflHelpers';

describe('tfl helper functions', () => {
  describe('process feed data function', () => {
    it('should update all strings on TFL feed data', () => {
      const input = {
        vrm_trm: '12345',
        vin: '56789',
        certificateNumber: 'CeRt1234',
        modificationTypeUsed: 'type 1',
        testStatus: 'submitted, done',
        fuel_emission_id: '123',
        createdAt: 'now',
        lastUpdatedAt: 'before "they said"',
        createdBy_Id: 'some person',
        firstUseDate: 'not today',
      };
      const result = processTFLFeedData(input);
      const expectedResult = {
        vrm_trm: '12345',
        vin: '56789',
        certificateNumber: 'CERT1234',
        modificationTypeUsed: 'TYPE 1',
        testStatus: '"SUBMITTED, DONE"',
        fuel_emission_id: '123',
        createdAt: 'NOW',
        lastUpdatedAt: '"BEFORE ""THEY SAID"""',
        createdBy_Id: 'SOME PERSON',
        firstUseDate: 'NOT TODAY',
      };
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('escape string function', () => {
    it('takes a string and upcases it', () => {
      const input = 'string';
      const result = escapeString(input);
      expect(result).toEqual('STRING');
    });

    it('takes a number and upcases it', () => {
      const input = 12345;
      const result = escapeString(input);
      expect(result).toEqual('12345');
    });

    it('takes a string with a comma and adds quote marks', () => {
      const input = 'This,string';
      const result = escapeString(input);
      expect(result).toEqual('"THIS,STRING"');
    });

    it('takes a string with a quotes and adds quote marks and escapes them', () => {
      const input = 'This "string"';
      const result = escapeString(input);
      expect(result).toEqual('"THIS ""STRING"""');
    });

    it('takes a string with a comma and " and adds quote marks and escapes them', () => {
      const input = 'This, "string"';
      const result = escapeString(input);
      expect(result).toEqual('"THIS, ""STRING"""');
    });

    it('takes an empty string', () => {
      const input = '';
      const result = escapeString(input);
      expect(result).toEqual('');
    });

    it('takes a null', () => {
      const input = null;
      const result = escapeString(input);
      expect(result).toEqual('NULL');
    });
  });
});
