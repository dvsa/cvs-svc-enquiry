import InvalidIdentifierError from '../../../src/errors/InvalidIdentifierError';
import ParametersError from '../../../src/errors/ParametersError';
import { validateVehicleEvent, validateResultsEvent } from '../../../src/utils/validationService';

describe('Validation Service', () => {
  describe('validateVehicleEvent', () => {
    it('throws an error if there are no identifiers', () => {
      expect(() => validateVehicleEvent({})).toThrow(Error);
    });

    it('throws an error if there are too many identifiers (VRM and VIN)', () => {
      expect(() => validateVehicleEvent({ VehicleRegMark: 'GL10RFE', vinNumber: '123534567' })).toThrow(
        ParametersError,
      );
    });

    it('throws an error if there are too many identifiers (VRM and Trailer ID)', () => {
      expect(() => validateVehicleEvent({ VehicleRegMark: 'GL10RFE', trailerId: '123534567' })).toThrow(
        ParametersError,
      );
    });

    it('throws an error if there are too many identifiers (Trailer ID and VIN)', () => {
      expect(() => validateVehicleEvent({ trailerId: '123456789', vinNumber: '123534567' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (all)', () => {
      expect(() => validateVehicleEvent({ VehicleRegMark: 'GL10RFE', vinNumber: '123534567', trailerId: '123456789' })).toThrow(ParametersError);
    });

    it('returns true if there are no problems(VRM)', () => {
      expect(validateVehicleEvent({ VehicleRegMark: 'AA9' })).toEqual(true);
    });

    it('returns true if there are no problems(VIN)', () => {
      expect(validateVehicleEvent({ vinNumber: '123456798' })).toEqual(true);
    });

    it('returns true if there are no problems(Trailer ID)', () => {
      expect(validateVehicleEvent({ trailerId: '123456789' })).toEqual(true);
    });

    it('rejects a invalid plate', () => {
      const plate = 'A!11AAA';

      expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidIdentifierError);
    });
  });

  describe('validateResultsEvent', () => {
    it('throws an error if the vin parameter is empty', () => {
      expect(() => validateResultsEvent({ vinNumber: '' })).toThrow();
    });

    it('throws an error if the vrm parameter is empty', () => {
      expect(() => validateResultsEvent({ VehicleRegMark: '' })).toThrow();
    });

    it('throws an error if the trailer_id parameter is empty', () => {
      expect(() => validateResultsEvent({ trailerId: '' })).toThrow();
    });

    it('throws an error if the test_id parameter is empty', () => {
      expect(() => validateResultsEvent({ testnumber: '' })).toThrow();
    });

    it('throws an error if there are too many identifiers (VRM and VIN)', () => {
      expect(() => validateResultsEvent({ VehicleRegMark: 'GL10RFE', vinNumber: '123534567' })).toThrow(
        ParametersError,
      );
    });

    it('throws an error if there are too many identifiers (VRM and test number)', () => {
      expect(() => validateResultsEvent({ VehicleRegMark: 'GL10RFE', testnumber: '123534567' })).toThrow(
        ParametersError,
      );
    });

    it('throws an error if there are too many identifiers (VRM and trailer id)', () => {
      expect(() => validateResultsEvent({ VehicleRegMark: 'GL10RFE', trailerId: '2345678' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (trailerId and VIN)', () => {
      expect(() => validateResultsEvent({ trailerId: '2345678', vinNumber: '123534567' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (test number and VIN)', () => {
      expect(() => validateResultsEvent({ testnumber: '123456789', vinNumber: '123534567' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (test number and trailerId)', () => {
      expect(() => validateResultsEvent({ testnumber: '123456789', trailerId: '2345678' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (3 out of 4)', () => {
      expect(() => validateResultsEvent({ VehicleRegMark: 'GL10RFE', vinNumber: '123534567', testnumber: '123456789' })).toThrow(ParametersError);
    });

    it('throws an error if there are too many identifiers (all)', () => {
      expect(() => validateResultsEvent({
        VehicleRegMark: 'GL10RFE',
        vinNumber: '123534567',
        trailerId: '2345678',
        testnumber: '123456789',
      })).toThrow(ParametersError);
    });

    it('rejects a invalid identifier', () => {
      expect(() => validateResultsEvent({ vinNumber: 'sdfsd78879!' })).toThrow(InvalidIdentifierError);
    });
  });
});
