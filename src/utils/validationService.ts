import InvalidNumberplateError from '../errors/InvalidNumberplateError';
import ParametersError from '../errors/ParametersError';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';

const allPeriodsRegex = /(^[A-HJ-PR-Z]{2}[0-9]{2}\s?[A-HJ-PR-Z]{3}$)|(^[A-HJ-NP-TV-Y][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-HJ-NPR-TV-Y]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)/;

function validateVrm(vrm: string) {
  const plateToTest = vrm.replace(/\s+/g, '').toUpperCase();

  if (allPeriodsRegex.exec(plateToTest) !== null) {
    return true;
  }

  throw new InvalidNumberplateError();
}

const validateVehicleEvent = (event: VehicleEvent): boolean => {
  if (!event.VehicleRegMark && !event.vinNumber && !event.trailerId) {
    throw new ParametersError('No parameter defined');
  }

  if (
    (event.VehicleRegMark !== undefined && event.vinNumber !== undefined) ||
    (event.VehicleRegMark !== undefined && event.trailerId !== undefined) ||
    (event.vinNumber !== undefined && event.trailerId !== undefined) ||
    (event.VehicleRegMark !== undefined && event.vinNumber !== undefined && event.trailerId !== undefined)
  ) {
    throw new ParametersError('Too many parameters defined');
  }

  if (event.VehicleRegMark) {
    validateVrm(event.VehicleRegMark);
  }

  return true;
};

const validateResultsEvent = (event: ResultsEvent): boolean => {
  if (!event.vehicle) {
    throw new ParametersError('No vehicle parameter');
  }

  return true;
};

export { validateVehicleEvent, validateResultsEvent };
