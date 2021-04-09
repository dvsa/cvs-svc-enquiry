import VehicleEvent from '../interfaces/VehicleEvent';
import { validateVehicleEvent, validateResultsEvent } from '../utils/validationService';
import vehicleQueryFunctionFactory from '../app/vehicleQueryFunctionFactory';
import testQueryFunctionFactory from '../app/testQueryFunctionFactory';
import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleDetails from '../interfaces/queryResults/technical/vehicleDetails';
import TestRecord from '../interfaces/queryResults/test/testRecord';

const getVehicleDetails = async (
  event: VehicleEvent,
  queryFuncFactory: typeof vehicleQueryFunctionFactory,
  dbService: DatabaseService,
): Promise<VehicleDetails> => {
  validateVehicleEvent(event);
  const query = queryFuncFactory(event);
  return query(dbService, event);
};

const getResultsDetails = async (
  event: ResultsEvent,
  queryFuncFactory: typeof testQueryFunctionFactory,
  dbService: DatabaseService,
): Promise<TestRecord[]> => {
  validateResultsEvent(event);
  const query = queryFuncFactory(event);
  const result = await query(dbService, event);

  return result[0];
};

export { getVehicleDetails, getResultsDetails };
