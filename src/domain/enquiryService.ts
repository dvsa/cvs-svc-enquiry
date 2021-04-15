import VehicleEvent from '../interfaces/VehicleEvent';
import { validateVehicleEvent, validateResultsEvent } from '../utils/validationService';
import vehicleQueryFunctionFactory from '../app/vehicleQueryFunctionFactory';
import testResultsQueryFunctionFactory from '../app/testResultsQueryFunctionFactory';
import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleDetails from '../interfaces/queryResults/technical/vehicleDetails';
import TestResult from '../interfaces/queryResults/test/testResult';

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
  queryFuncFactory: typeof testResultsQueryFunctionFactory,
  dbService: DatabaseService,
): Promise<TestResult[]> => {
  validateResultsEvent(event);
  const query = queryFuncFactory(event);

  return query(dbService, event);
};

export { getVehicleDetails, getResultsDetails };
