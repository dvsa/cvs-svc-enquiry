import InvalidIdentifierError from '../errors/InvalidIdentifierError';
import ParametersError from '../errors/ParametersError';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';

const basicRegex = /^[a-zA-Z0-9]+$/;

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

  if (
    basicRegex.exec(event.VehicleRegMark) !== null &&
    basicRegex.exec(event.vinNumber) !== null &&
    basicRegex.exec(event.trailerId) !== null
  ) {
    return true;
  }

  throw new InvalidIdentifierError();
};

const validateResultsEvent = (event: ResultsEvent): boolean => {
  if (!event.vrm && !event.vin && !event.test_id) {
    throw new ParametersError('No parameter defined');
  }

  if (
    (event.vrm !== undefined && event.vin !== undefined) ||
    (event.vrm !== undefined && event.test_id !== undefined) ||
    (event.vin !== undefined && event.test_id !== undefined) ||
    (event.vrm !== undefined && event.vin !== undefined && event.test_id !== undefined)
  ) {
    throw new ParametersError('Too many parameters defined');
  }

  if (
    basicRegex.exec(event.vrm) !== null &&
    basicRegex.exec(event.vin) !== null &&
    basicRegex.exec(event.test_id) !== null
  ) {
    return true;
  }

  throw new InvalidIdentifierError();
};

export { validateVehicleEvent, validateResultsEvent };
