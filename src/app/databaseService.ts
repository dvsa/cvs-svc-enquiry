import { FieldPacket, RowDataPacket } from 'mysql2';
import * as technicalQueries from './queries/technicalRecord';
import * as testQueries from './queries/testRecords';
import DatabaseServiceInterface from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';
import VehicleDetails from '../interfaces/queryResults/technical/vehicleDetails';
import TechnicalRecord from '../interfaces/queryResults/technical/technicalRecord';
import PSVBrakes from '../interfaces/queryResults/technical/psvBrakes';
import Axles from '../interfaces/queryResults/technical/axles';
import AxleSpacing from '../interfaces/queryResults/technical/axleSpacing';
import Plate from '../interfaces/queryResults/technical/plate';

async function getTechnicalRecordDetails(
  technicalRecordQueryResult: TechnicalRecordQueryResult,
  databaseService: DatabaseServiceInterface,
): Promise<TechnicalRecord> {
  const technicalRecord = technicalRecordQueryResult.result;
  const [brakes] = await databaseService.get(technicalQueries.BRAKE_QUERY, [technicalRecordQueryResult.id]);
  const [axles] = await databaseService.get(technicalQueries.AXLE_QUERY, [technicalRecordQueryResult.id]);
  const [axleSpacing] = await databaseService.get(technicalQueries.AXLE_SPACING_QUERY, [technicalRecordQueryResult.id]);
  const [plating] = await databaseService.get(technicalQueries.PLATING_QUERY, [technicalRecordQueryResult.id]);

  technicalRecord.brakes = brakes.map((brake: BrakeQueryResult) => brake.result);
  technicalRecord.axles = axles.map((axle: AxlesQueryResult) => axle.result);
  technicalRecord.axlespacing = axleSpacing.map((axlespacing: AxleSpacingQueryResult) => axlespacing.result);
  technicalRecord.plates = plating.map((plate: PlatesQueryResult) => plate.result);

  return technicalRecord;
}

async function getTechnicalRecords(vehicleId, databaseService: DatabaseServiceInterface): Promise<TechnicalRecord[]> {
  const [results] = await databaseService.get(technicalQueries.TECHNICAL_RECORD_QUERY, [vehicleId]);
  const technicalRecords = Promise.all(
    results.map((result) => getTechnicalRecordDetails(result as TechnicalRecordQueryResult, databaseService)),
  );

  return technicalRecords;
}

async function getVehicleDetails(
  vehicleDetailsQueryResult: [RowDataPacket[], FieldPacket[]],
  databaseService: DatabaseServiceInterface,
) {
  const vehicleDetailsResult = vehicleDetailsQueryResult[0][0] as VehicleQueryResult;
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
    event.vinNumber,
  ]);
  return getVehicleDetails(vehicleDetailsQueryResult, databaseService);
}

function getTestResultsByVrm(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by VRM');
  return databaseService.get(testQueries.TEST_RECORD_BY_VRM, [event.VehicleRegMark]);
}

function getTestResultsByVin(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by VIN');
  return databaseService.get(testQueries.TEST_RECORD_BY_VIN, [event.vinNumber]);
}

function getTestResultsByTestId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  console.info('Using get by Test ID');
  return databaseService.get(testQueries.TEST_RECORD_BY_TEST_NUMBER, [event.testnumber]);
}

export {
  getVehicleDetailsByVrm,
  getVehicleDetailsByVin,
  getVehicleDetailsByTrailerId,
  getTestResultsByVrm as getResultsByVrm,
  getTestResultsByVin as getResultsByVin,
  getTestResultsByTestId as getResultsByTestId,
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
