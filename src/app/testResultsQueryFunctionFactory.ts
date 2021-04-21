import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import { getTestResultsByVrm, getTestResultsByVin, getTestResultsByTestId } from './databaseService';
import TestResult from '../interfaces/queryResults/test/testResult';

export default (
  event: ResultsEvent,
): ((databaseService: DatabaseService, event: ResultsEvent) => Promise<TestResult[]>
  ) => {
  if (event.vinNumber) {
    console.info('Using getTestResultsByVin');

    return getTestResultsByVin;
  }
  if (event.VehicleRegMark) {
    console.info('Using getTestResultsByVrm');

    return getTestResultsByVrm;
  }

  console.info('Using getTestResultsByTestId');
  return getTestResultsByTestId;
};
