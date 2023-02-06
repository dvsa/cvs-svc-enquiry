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
    (event.VehicleRegMark !== undefined && event.vinNumber !== undefined)
    || (event.VehicleRegMark !== undefined && event.trailerId !== undefined)
    || (event.vinNumber !== undefined && event.trailerId !== undefined)
    || (event.VehicleRegMark !== undefined && event.vinNumber !== undefined && event.trailerId !== undefined)
  ) {
    throw new ParametersError('Too many parameters defined');
  }

  if (
    basicRegex.exec(event.VehicleRegMark) !== null
    && basicRegex.exec(event.vinNumber) !== null
    && basicRegex.exec(event.trailerId) !== null
  ) {
    return true;
  }

  throw new InvalidIdentifierError();
};

const validateResultsEvent = (event: ResultsEvent): boolean => {
  if (!event.VehicleRegMark && !event.vinNumber && !event.trailerId && !event.testnumber) {
    throw new ParametersError('No parameter defined');
  }

  if (
    (event.VehicleRegMark !== undefined && event.vinNumber !== undefined)
    || (event.VehicleRegMark !== undefined && event.trailerId !== undefined)
    || (event.VehicleRegMark !== undefined && event.testnumber !== undefined)
    || (event.vinNumber !== undefined && event.trailerId !== undefined)
    || (event.vinNumber !== undefined && event.testnumber !== undefined)
    || (event.trailerId !== undefined && event.testnumber !== undefined)
    || (event.VehicleRegMark !== undefined && event.vinNumber !== undefined && event.trailerId !== undefined)
    || (event.VehicleRegMark !== undefined && event.vinNumber !== undefined && event.testnumber !== undefined)
    || (event.VehicleRegMark !== undefined && event.trailerId !== undefined && event.testnumber !== undefined)
    || (event.vinNumber !== undefined && event.trailerId !== undefined && event.testnumber !== undefined)
    || (event.VehicleRegMark !== undefined && event.vinNumber !== undefined && event.trailerId !== undefined && event.testnumber !== undefined)
  ) {
    throw new ParametersError('Too many parameters defined');
  }

  if (
    basicRegex.exec(event.VehicleRegMark) !== null
    && basicRegex.exec(event.vinNumber) !== null
    && basicRegex.exec(event.trailerId) !== null
    && basicRegex.exec(event.testnumber) !== null
  ) {
    return true;
  }

  throw new InvalidIdentifierError();
};

export { validateVehicleEvent, validateResultsEvent };
