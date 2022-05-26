import VehicleEvent from '../interfaces/VehicleEvent';
import { validateVehicleEvent, validateResultsEvent } from '../utils/validationService';
import evlFeedQueryFunctionFactory from '../app/evlFeedQueryFunctionFactory';
import vehicleQueryFunctionFactory from '../app/vehicleQueryFunctionFactory';
import testResultsQueryFunctionFactory from '../app/testResultsQueryFunctionFactory';
import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import EvlEvent from '../interfaces/EvlEvent';
import VehicleDetails from '../interfaces/queryResults/technical/vehicleDetails';
import TestResult from '../interfaces/queryResults/test/testResult';
import EvlFeedData from '../interfaces/queryResults/evlFeedData'

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

const getEvlFeedDetails = async (
  event: EvlEvent,
  queryFuncFactory: typeof evlFeedQueryFunctionFactory,
  dbService: DatabaseService,
): Promise<EvlFeedData[]> => {
  const query = queryFuncFactory(event);

  return query(dbService, event)
}

export { getVehicleDetails, getResultsDetails, getEvlFeedDetails };
