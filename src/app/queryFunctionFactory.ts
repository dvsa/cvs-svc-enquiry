import VehicleEvent from '../interfaces/VehicleEvent';
import { getVehicleDetailsByVrm, getVehicleDetailsByVin, getVehicleDetailsByTrailerId } from './databaseService';

export default (event: VehicleEvent) => {
  if (event.vinNumber) {
    return getVehicleDetailsByVin;
  }
  if (event.VehicleRegMark) {
    return getVehicleDetailsByVrm;
  }
  return getVehicleDetailsByTrailerId;
};
