import VehicleEvent from '../interfaces/VehicleEvent';
import { validateVehicleEvent, validateResultsEvent } from '../utils/validationService';
import queryFunctionFactory from '../app/queryFunctionFactory';
import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import { getResultsByVehicleId, getResultsByVehicleIdAndTestId } from '../app/databaseService';
import VehicleDetails from '../interfaces/queryResults/vehicleDetails';
import TestRecord from '../interfaces/queryResults/testRecord';

const getVehicleDetails = async (
  event: VehicleEvent,
  queryFuncFactory: typeof queryFunctionFactory,
  dbService: DatabaseService,
): Promise<VehicleDetails> => {
  // Validate incoming event
  validateVehicleEvent(event);
  // Choose appropriate function to call for the event
  const query = queryFuncFactory(event);
  // Make DB request
  const result = await query(dbService, event);
  // Convert results into JSON
  return JSON.parse(JSON.stringify(result)) as VehicleDetails;
  // Return results
  // return result;
};

const getResultsDetails = async (event: ResultsEvent, dbService: DatabaseService): Promise<TestRecord> => {
  // Validate incoming event
  validateResultsEvent(event);
  // Choose appropriate function to call for the event
  // Make DB request
  const result = event.test_id
    ? await getResultsByVehicleIdAndTestId(dbService, event)
    : await getResultsByVehicleId(dbService, event);
  // Convert results into JSON
  // Return results
  // return result;
  return JSON.parse(JSON.stringify(result)) as TestRecord;
};

export { getVehicleDetails, getResultsDetails };
