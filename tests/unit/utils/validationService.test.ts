import InvalidNumberplateError from '../../../src/errors/InvalidNumberplateError';
import { validateVehicleEvent, validateResultsEvent } from '../../../src/utils/validationService';

describe('Validation Service', () => {
  describe('validateVehicleEvent', () => {
    it('throws an error if there are no identifiers', () => {
      expect(() => validateVehicleEvent({})).toThrow(Error);
    });

    it('throws an error if there are too many identifiers', () => {
      expect(() => validateVehicleEvent({ VehicleRegMark: 'GL10RFE', vinNumber: '123534567' })).toThrow(Error);
    });
    describe('VRM validation', () => {
      it('validates a pre-1932 plate with one number', () => {
        const plate = 'AA9';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a pre-1932 plate with two numbers', () => {
        const plate = 'AA95';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a pre-1932 plate with three numbers', () => {
        const plate = 'AA967';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a pre-1932 plate with four numbers', () => {
        const plate = 'AA9285';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a 1932 to 1963 plate', () => {
        const plate = 'abc345';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a 1963 to 1982 plate', () => {
        const plate = 'abc345T';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a 1983 to 2001 plate', () => {
        const plate = 'a678tof';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a current plate', () => {
        const plate = 'aa34gfd';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('validates a prefix Q plate', () => {
        const plate = 'Q123ATR';

        expect(validateVehicleEvent({ VehicleRegMark: plate })).toEqual(true);
      });

      it('rejects a invalid plate', () => {
        const plate = 'This is not a numberplate';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects a suffix Q plate', () => {
        const plate = 'AAA123Q';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects an I in the prefix of a current plate', () => {
        const plate = 'IA56AAA';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects an Q in the prefix of a current plate', () => {
        const plate = 'QA56AAA';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects an I in the prefix of a prefix plate', () => {
        const plate = 'I356AAA';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects an O in the prefix of a prefix plate', () => {
        const plate = 'O356AAA';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });

      it('rejects an U in the prefix of a prefix plate', () => {
        const plate = 'U356AAA';

        expect(() => validateVehicleEvent({ VehicleRegMark: plate })).toThrow(InvalidNumberplateError);
      });
    });
  });

  describe('validateResultsEvent', () => {
    it('throws an error if there is vehicle parameter is empty', () => {
      expect(() => validateResultsEvent({ vehicle: '' })).toThrow();
    });
  });
});
