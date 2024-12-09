import { dateFormat } from '../../../constants';

const baseQuery = `
  SELECT v.id, JSON_OBJECT(
    'system_number', v.system_number,
    'vin', v.vin,
    'vrm_trm', v.vrm_trm,
    'trailer_id',v.trailer_id,
    'createdAt', DATE_FORMAT(v.createdAt, '${dateFormat}')
  ) result
  FROM vehicle v`;

const VEHICLE_DETAILS_VRM_QUERY = `${baseQuery} WHERE v.vrm_trm = ?`;
const VEHICLE_DETAILS_VIN_QUERY = `${baseQuery} WHERE v.vin = ?`;
const VEHICLE_DETAILS_TRAILER_ID_QUERY = `${baseQuery} WHERE v.trailer_id = ?`;

export { VEHICLE_DETAILS_VRM_QUERY, VEHICLE_DETAILS_VIN_QUERY, VEHICLE_DETAILS_TRAILER_ID_QUERY };
