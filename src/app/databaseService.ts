import { RowDataPacket } from 'mysql2';
import * as technicalQueries from './queries/technicalRecord';
import * as testResultsQueries from './queries/testResults';
import { EVL_QUERY, EVL_VRM_QUERY } from './queries/evlQuery';
import DatabaseServiceInterface, { QueryOutput } from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';
import VehicleDetails from '../interfaces/queryResults/technical/vehicleDetails';
import TechnicalRecord from '../interfaces/queryResults/technical/technicalRecord';
import PSVBrakes from '../interfaces/queryResults/technical/psvBrakes';
import Axles from '../interfaces/queryResults/technical/axles';
import AxleSpacing from '../interfaces/queryResults/technical/axleSpacing';
import Plate from '../interfaces/queryResults/technical/plate';
import TestResult from '../interfaces/queryResults/test/testResult';
import CustomDefect from '../interfaces/queryResults/test/customDefect';
import TestDefect from '../interfaces/queryResults/test/testDefect';
import EvlFeedData from '../interfaces/queryResults/evlFeedData';
import NotFoundError from '../errors/NotFoundError';
import EvlEvent from '../interfaces/EvlEvent';
import logger from '../utils/logger';
import TflFeedData from '../interfaces/queryResults/tflFeedData';
import { TFL_QUERY } from './queries/tflQuery';
import { FeedName } from '../interfaces/FeedTypes';
import { getItemFromS3, readOrCreateIfNotExists } from '../infrastructure/s3BucketService';

async function getTechnicalRecordDetails(
  technicalRecordQueryResult: TechnicalRecordQueryResult,
  databaseService: DatabaseServiceInterface,
): Promise<TechnicalRecord> {
  const technicalRecord = technicalRecordQueryResult.result;
  const [[brakes], [axles], [axleSpacing], [plating]] = await Promise.all([
    databaseService.get(technicalQueries.BRAKE_QUERY, [technicalRecordQueryResult.id]),
    databaseService.get(technicalQueries.AXLE_QUERY, [technicalRecordQueryResult.id]),
    databaseService.get(technicalQueries.AXLE_SPACING_QUERY, [technicalRecordQueryResult.id]),
    databaseService.get(technicalQueries.PLATING_QUERY, [technicalRecordQueryResult.id]),
  ]);

  technicalRecord.psvBrakes = brakes.map((brake: BrakeQueryResult) => brake.result);
  technicalRecord.axles = axles.map((axle: AxlesQueryResult) => axle.result);
  technicalRecord.axlespacing = axleSpacing.map((axlespacing: AxleSpacingQueryResult) => axlespacing.result);
  technicalRecord.plates = plating.map((plate: PlatesQueryResult) => plate.result);

  return technicalRecord;
}

async function getTechnicalRecords(vehicleId, databaseService: DatabaseServiceInterface): Promise<TechnicalRecord[]> {
  const [results] = await databaseService.get(technicalQueries.TECHNICAL_RECORD_QUERY, [vehicleId]);
  const technicalRecords = Promise.all(
    results.map((result: TechnicalRecordQueryResult) => getTechnicalRecordDetails(result, databaseService)),
  );

  return technicalRecords;
}

async function getVehicleDetails(vehicleDetailsQueryResult: QueryOutput, databaseService: DatabaseServiceInterface) {
  const vehicleDetailsResult = vehicleDetailsQueryResult[0][0] as VehicleQueryResult;

  if (
    vehicleDetailsResult === undefined ||
    vehicleDetailsResult.id === undefined ||
    vehicleDetailsResult.result === undefined
  ) {
    throw new NotFoundError('Vehicle was not found');
  }

  const vehicleId = vehicleDetailsResult.id;
  const vehicleDetails = vehicleDetailsResult.result;

  vehicleDetails.technicalrecords = await getTechnicalRecords(vehicleId, databaseService);

  return vehicleDetails;
}

async function getVehicleDetailsByVrm(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<VehicleDetails> {
  console.info('Using get by VRM');
  const vehicleDetailsQueryResult = await databaseService.get(technicalQueries.VEHICLE_DETAILS_VRM_QUERY, [
    event.VehicleRegMark,
  ]);

  return getVehicleDetails(vehicleDetailsQueryResult, databaseService);
}

async function getVehicleDetailsByVin(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<VehicleDetails> {
  console.info('Using get by VIN');
  const vehicleDetailsQueryResult = await databaseService.get(technicalQueries.VEHICLE_DETAILS_VIN_QUERY, [
    event.vinNumber,
  ]);
  return getVehicleDetails(vehicleDetailsQueryResult, databaseService);
}

async function getVehicleDetailsByTrailerId(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<VehicleDetails> {
  console.info('Using get by Trailer ID');
  const vehicleDetailsQueryResult = await databaseService.get(technicalQueries.VEHICLE_DETAILS_TRAILER_ID_QUERY, [
    event.trailerId,
  ]);
  return getVehicleDetails(vehicleDetailsQueryResult, databaseService);
}

async function hydrateTestResult(
  id: string,
  testResult: TestResult,
  databaseService: DatabaseServiceInterface,
): Promise<TestResult> {
  const [[customDefects], [defects]] = await Promise.all([
    databaseService.get(testResultsQueries.CUSTOM_DEFECT_QUERY, [id]),
    databaseService.get(testResultsQueries.TEST_DEFECT_QUERY, [id]),
  ]);

  if (customDefects.length > 0) {
    testResult.customDefect = customDefects.map((customDefect: CustomDefectQueryResult) => customDefect.result);
  } else {
    testResult.customDefect = [];
  }

  if (defects.length > 0) {
    testResult.defects = defects.map((defect: TestDefectQueryResult) => defect.result);
  } else {
    testResult.defects = [];
  }

  return testResult;
}

async function getTestResultDetails(
  queryResult: QueryOutput,
  databaseService: DatabaseServiceInterface,
): Promise<TestResult> {
  const testResultQueryResult = queryResult[0][0] as TestResultQueryResult;

  if (
    testResultQueryResult === undefined ||
    testResultQueryResult.id === undefined ||
    testResultQueryResult.result === undefined
  ) {
    throw new NotFoundError('Test not found');
  }

  const testId = testResultQueryResult.id;
  const testResult = testResultQueryResult.result;

  return hydrateTestResult(testId, testResult, databaseService);
}

async function getTestResultsDetails(
  queryResult: QueryOutput,
  databaseService: DatabaseServiceInterface,
): Promise<TestResult[]> {
  const testResultQueryResults = queryResult[0] as TestResultQueryResult[];

  if (testResultQueryResults === undefined || testResultQueryResults.length === 0) {
    throw new NotFoundError('No tests found');
  }

  return Promise.all(
    testResultQueryResults.map((testResultQueryResult: TestResultQueryResult) => {
      const testId = testResultQueryResult.id;
      const testResult = testResultQueryResult.result;

      return hydrateTestResult(testId, testResult, databaseService);
    }),
  );
}

async function getTestResultsByVrm(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<TestResult[]> {
  console.info('Using get by VRM');
  const queryResult = await databaseService.get(testResultsQueries.TEST_RESULTS_BY_VRM, [event.VehicleRegMark]);

  return getTestResultsDetails(queryResult, databaseService);
}

async function getTestResultsByVin(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<TestResult[]> {
  console.info('Using get by VIN');
  const queryResult = await databaseService.get(testResultsQueries.TEST_RESULTS_BY_VIN, [event.vinNumber]);

  return getTestResultsDetails(queryResult, databaseService);
}

async function getTestResultsByTrailerId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<TestResult[]> {
  console.info('Using get by TrailerId');
  const queryResult = await databaseService.get(testResultsQueries.TEST_RESULTS_BY_TRAILER_ID, [event.trailerId]);

  return getTestResultsDetails(queryResult, databaseService);
}

async function getTestResultsByTestId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<TestResult[]> {
  console.info('Using get by Test ID');
  const queryResult = await databaseService.get(testResultsQueries.TEST_RESULTS_BY_TEST_NUMBER, [event.testnumber]);
  const result = await getTestResultDetails(queryResult, databaseService);

  return [result];
}

function getEvlFeedByVrmDetails(queryResult: QueryOutput): EvlFeedData {
  const evlFeedQueryResult = queryResult[0][0] as EvlFeedData;
  if (evlFeedQueryResult === undefined) {
    throw new NotFoundError('Test not found');
  }

  return evlFeedQueryResult;
}

function getFeedDetails(queryResult: QueryOutput, feedName: FeedName): EvlFeedData[] | TflFeedData[] {
  const feedQueryResults: EvlFeedData[] | TflFeedData[] =
    feedName === FeedName.EVL ? (queryResult[0][1] as EvlFeedData[]) : (queryResult[0] as TflFeedData[]);
  if (feedQueryResults === undefined || feedQueryResults.length === 0) {
    throw new NotFoundError('No tests found');
  }

  return feedQueryResults;
}

async function getEvlFeedByVrm(databaseService: DatabaseServiceInterface, event: EvlEvent): Promise<EvlFeedData[]> {
  logger.info('Using getEvlFeedByVrm');
  logger.debug(`calling database for vrm: ${event.vrm_trm} with query ${EVL_VRM_QUERY}`);
  const queryResult = await databaseService.get(EVL_VRM_QUERY, [event.vrm_trm]);
  const result = getEvlFeedByVrmDetails(queryResult);
  logger.debug(`result from database: ${result.vrm_trm}, ${result.certificateNumber}, ${result.testExpiryDate}`);
  return [result];
}

const getQueryMap: { [key in FeedName]: string } = {
  EVL: EVL_QUERY,
  TFL: TFL_QUERY,
};

function getDateInQueryFormat(date: Date): string {
  return `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
}

async function getLastTFLFileDate(): Promise<string> {
  const fileName = 'TFL_LATEST_VALID_FROM_DATE.txt';
  const latestDate = await readOrCreateIfNotExists(fileName, new Date().toISOString());
  return getDateInQueryFormat(new Date(latestDate));
}

async function getFeed(
  databaseService: DatabaseServiceInterface,
  feedName: FeedName,
): Promise<EvlFeedData[] | TflFeedData[]> {
  logger.info(`Using get${feedName}Feed`);
  // eslint-disable-next-line security/detect-object-injection
  const query = getQueryMap[feedName];
  logger.debug(`calling database with ${feedName} query ${query}`);
  const parameter = feedName === FeedName.TFL ? [await getLastTFLFileDate()] : [];
  const queryResult = await databaseService.get(query, parameter);
  const result = getFeedDetails(queryResult, feedName);
  logger.debug(`result from database: ${JSON.stringify(result)}`);
  return result;
}

export {
  getVehicleDetailsByVrm,
  getVehicleDetailsByVin,
  getVehicleDetailsByTrailerId,
  getTestResultsByVrm,
  getTestResultsByVin,
  getTestResultsByTrailerId,
  getTestResultsByTestId,
  getEvlFeedByVrm,
  getEvlFeedByVrmDetails,
  getFeed,
};

interface VehicleQueryResult extends RowDataPacket {
  id: string;
  result: VehicleDetails;
}

interface TechnicalRecordQueryResult extends RowDataPacket {
  id: string;
  result: TechnicalRecord;
}

interface BrakeQueryResult extends RowDataPacket {
  id: string;
  result: PSVBrakes;
}

interface AxlesQueryResult extends RowDataPacket {
  id: string;
  result: Axles;
}

interface AxleSpacingQueryResult extends RowDataPacket {
  id: string;
  result: AxleSpacing;
}

interface PlatesQueryResult extends RowDataPacket {
  id: string;
  result: Plate;
}

interface TestResultQueryResult extends RowDataPacket {
  id: string;
  result: TestResult;
}

interface TestDefectQueryResult extends RowDataPacket {
  id: string;
  result: TestDefect;
}

interface CustomDefectQueryResult extends RowDataPacket {
  id: string;
  result: CustomDefect;
}
