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
import EvlFeedData from '../interfaces/queryResults/evlFeedData';
import TflFeedData from '../interfaces/queryResults/tflFeedData';
import tflFeedQueryFunctionFactory from '../app/tflFeedQueryFunctionFactory';
import { FeedName } from '../interfaces/FeedTypes';

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

const getFeedDetails = async (
  queryFuncFactory: typeof evlFeedQueryFunctionFactory | typeof tflFeedQueryFunctionFactory,
  feedName: FeedName,
  dbService: DatabaseService,
  event: EvlEvent = null,
): Promise<EvlFeedData[] | TflFeedData[]> => {
  const query = queryFuncFactory(event);
  return query(dbService, feedName, event);
};

export { getVehicleDetails, getResultsDetails, getFeedDetails };
