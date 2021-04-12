import DatabaseService from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import { getTestResultsByVrm, getTestResultsByVin, getTestResultsByTestId } from './databaseService';
import TestRecord from '../interfaces/queryResults/test/testRecord';

export default (
  event: ResultsEvent,
): ((databaseService: DatabaseService, event: ResultsEvent) => Promise<TestRecord[]>) => {
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
