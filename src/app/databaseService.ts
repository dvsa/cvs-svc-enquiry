import { FieldPacket, RowDataPacket } from 'mysql2';
import * as technicalQueries from './queries/technicalRecord';
import * as testQueries from './queries/testRecords';
import DatabaseServiceInterface from '../interfaces/DatabaseService';
import VehicleDetails from '../interfaces/queryResults/vehicleDetails';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';

// async function getVehicleDetails(vehicleId, databaseService: DatabaseServiceInterface) {
//   const [results] = await databaseService.get(technicalQueries.TECHNICAL_RECORD_QUERY, [vehicleId]);
//   const technicalRecordId = (results[0] as unknown) as string;
//   const technicalRecord = results[1];
//   const brakes = await databaseService.get(technicalQueries.BRAKE_QUERY, [technicalRecordId]);
//   const axles = await databaseService.get(technicalQueries.AXLE_QUERY, [technicalRecordId]);
//   const axleSpacing = await databaseService.get(technicalQueries.AXLE_SPACING_QUERY, [technicalRecordId]);

//   technicalRecord.brakes = brakes;
//   technicalRecord.axles = axles;
//   technicalRecord.axleSpacing = axleSpacing;

//   return technicalRecord;
// }

function getVehicleDetailsByVrm(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[VehicleDetails[], FieldPacket[]]> {
  console.info('Using get by VRM');
  return databaseService.get(technicalQueries.VEHICLE_DETAILS_VRM_QUERY, [event.VehicleRegMark]) as Promise<
  [VehicleDetails[], FieldPacket[]]
  >;
}

function getVehicleDetailsByVin(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[VehicleDetails[], FieldPacket[]]> {
  console.info('Using get by VIN');
  return databaseService.get(technicalQueries.VEHICLE_DETAILS_VIN_QUERY, [event.vinNumber]) as Promise<
  [VehicleDetails[], FieldPacket[]]
  >;
}

function getVehicleDetailsByTrailerId(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[VehicleDetails[], FieldPacket[]]> {
  console.info('Using get by Trailer ID');
  return databaseService.get(technicalQueries.VEHICLE_DETAILS_TRAILER_ID_QUERY, [event.trailerId]) as Promise<
  [VehicleDetails[], FieldPacket[]]
  >;
}

function getResultsByVrm(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by VRM');
  return databaseService.get(testQueries.TEST_RECORD_BY_VRM, [event.vrm]);
}

function getResultsByVin(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by VIN');
  return databaseService.get(testQueries.TEST_RECORD_BY_VIN, [event.vin]);
}

function getResultsByTestId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by Test ID');
  return databaseService.get(testQueries.TEST_RECORD_BY_TEST_NUMBER, [event.test_id]);
}

export {
  getVehicleDetailsByVrm,
  getVehicleDetailsByVin,
  getVehicleDetailsByTrailerId,
  getResultsByVrm,
  getResultsByVin,
  getResultsByTestId,
};
