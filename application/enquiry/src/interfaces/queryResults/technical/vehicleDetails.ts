import { RowDataPacket } from 'mysql2';
import TechnicalRecord from './technicalRecord';

interface VehicleDetails extends RowDataPacket {
  system_number: string;
  vrm_trm: string;
  trailer_id: string;
  vin: string;
  technicalrecords: TechnicalRecord[];
}

export default VehicleDetails;
