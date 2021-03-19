import { FieldPacket, RowDataPacket } from 'mysql2';
import {
  VEHICLE_DETAILS_VRM_QUERY,
  VEHICLE_DETAILS_VIN_QUERY,
  VEHICLE_DETAILS_TRAILER_ID_QUERY,
  RESULTS_QUERY,
} from '../contants';
import DatabaseServiceInterface from '../interfaces/DatabaseService';
import ResultsEvent from '../interfaces/ResultsEvent';
import VehicleEvent from '../interfaces/VehicleEvent';

function getVehicleDetailsByVrm(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  return databaseService.get(VEHICLE_DETAILS_VRM_QUERY, [event.VehicleRegMark]);
}

function getVehicleDetailsByVin(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  return databaseService.get(VEHICLE_DETAILS_VIN_QUERY, [event.vinNumber]);
}

function getVehicleDetailsByTrailerId(
  databaseService: DatabaseServiceInterface,
  event: VehicleEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  return databaseService.get(VEHICLE_DETAILS_TRAILER_ID_QUERY, [event.trailerId]);
}

function getResultsByVehicleId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  return databaseService.get(RESULTS_QUERY, [event.vehicle]);
}

function getResultsByVehicleIdAndTestId(
  databaseService: DatabaseServiceInterface,
  event: ResultsEvent,
): Promise<[RowDataPacket[], FieldPacket[]]> {
  return databaseService.get(RESULTS_QUERY, [event.vehicle, event.test_id]);
}

export {
  getVehicleDetailsByVrm,
  getVehicleDetailsByVin,
  getVehicleDetailsByTrailerId,
  getResultsByVehicleId,
  getResultsByVehicleIdAndTestId,
};
