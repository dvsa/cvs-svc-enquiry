import { RowDataPacket } from 'mysql2';

interface TestRecord extends RowDataPacket {
  technical_record_id: number;
  vehicle_id: number;
  fuel_emission_id: number;
  test_station_id: number;
  tester_id: number;
  preparer_id: number;
  vehicle_class_id: number;
  test_type_id: number;
  testStatus: number;
}

export default TestRecord;
