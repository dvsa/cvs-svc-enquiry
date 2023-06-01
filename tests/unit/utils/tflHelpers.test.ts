import TflFeedData from '../../../src/interfaces/queryResults/tflFeedData';
import { processTFLFeedData, escapeString } from '../../../src/utils/tflHelpers';

describe('tfl helper functions', () => {
  describe('process feed data function', () => {
    it('should update all strings on TFL feed data', () => {
      const input: TflFeedData = {
        VRM: '12345',
        VIN: '56789',
        SerialNumberOfCertificate: 'CeRt1234',
        CertificationModificationType: 'type 1',
        TestStatus: 'submitted, done',
        PMEuropeanEmissionClassificationCode: '123',
        ValidFromDate: 'now',
        ExpiryDate: 'before "they said"',
        IssuedBy: 'some person',
        IssueDate: 'not today',
      };
      const result = processTFLFeedData(input);
      const expectedResult: TflFeedData = {
        VRM: '12345',
        VIN: '56789',
        SerialNumberOfCertificate: 'CERT1234',
        CertificationModificationType: 'TYPE 1',
        TestStatus: '"SUBMITTED, DONE"',
        PMEuropeanEmissionClassificationCode: '123',
        ValidFromDate: 'NOW',
        ExpiryDate: '"BEFORE ""THEY SAID"""',
        IssuedBy: 'SOME PERSON',
        IssueDate: 'NOT TODAY',
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
