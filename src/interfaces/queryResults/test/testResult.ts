import { RowDataPacket } from 'mysql2';
import CustomDefect from './customDefect';
import FuelEmission from './fuelEmission';
import TestDefect from './testDefect';
import Tester from './tester';
import TestStation from './testStation';
import TestType from './testType';
import VehicleClass from '../vehicleClass';

interface TestResult extends RowDataPacket {
  testStatus?: string;
  reasonForCancellation?: string;
  numberOfSeats?: number;
  odometerReading?: number;
  odometerReadingUnits?: string;
  countryOfRegistration?: string;
  noOfAxles?: number;
  regndate?: string;
  firstUsedate?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  testCode?: string;
  testNumber?: string;
  certificateNumber?: string;
  secondaryCertificateNumber?: string;
  testExpiryDate?: string;
  testAnniversaryDate?: string;
  testDateStartTimestamp?: string;
  testDateEndTimestamp?: string;
  numberOfSeatbeltsFitted?: number;
  lastSeatbeltInstallationCheckDate?: string;
  seatbeltInstallationCheckDate?: string;
  testResult?: string;
  reasonForAbandoning?: string;
  additionalNotesRecorded?: string;
  additionalCommentsForAbandon?: string;
  particulateTrapFitted?: string;
  particulateTrapSerialNumber?: string;
  modificationDateUsed?: string;
  smokeTestKLimitApplied?: string;
  createdById?: string;
  createdByName?: string;
  lastUpdatedById?: string;
  lastUpdatedByName?: string;
  fuelEmission?: FuelEmission;
  testStation?: TestStation;
  tester?: Tester;
  vehicleClass?: VehicleClass;
  testType?: TestType;
  defects?: TestDefect[];
  customDefect?: CustomDefect[];
}

export default TestResult;