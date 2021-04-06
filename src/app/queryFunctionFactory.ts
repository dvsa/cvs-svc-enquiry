import { FieldPacket } from 'mysql2/promise';
import DatabaseService from '../interfaces/DatabaseService';
import VehicleDetails from '../interfaces/queryResults/vehicleDetails';
import VehicleEvent from '../interfaces/VehicleEvent';
import { getVehicleDetailsByVrm, getVehicleDetailsByVin, getVehicleDetailsByTrailerId } from './databaseService';

export default (
  event: VehicleEvent,
): ((databaseService: DatabaseService, event: VehicleEvent) => Promise<[VehicleDetails[], FieldPacket[]]>
  ) => {
  if (event.vinNumber) {
    console.info('Using getVehicleDetailsByVin');

    return getVehicleDetailsByVin;
  }
  if (event.VehicleRegMark) {
    console.info('Using getVehicleDetailsByVrm');

    return getVehicleDetailsByVrm;
  }

  console.info('Using getVehicleDetailsByTrailerId');
  return getVehicleDetailsByTrailerId;
};
