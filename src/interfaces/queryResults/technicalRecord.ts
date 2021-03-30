import Axles from './axles';
import Brakes from './brakes';
import MakeModel from './makeModel';
import VehicleClass from './vehicleClass';

enum RecordType {
  current = 'current',
  provisional = 'provisional',
}

interface TechnicalRecord {
  recordtype?: RecordType;
  createdAt?: string;
  lastUpdatedAt?: string;
  functionCode?: string;
  offRoad?: boolean;
  numberOfWheelsDriven?: number;
  emissionsLimit?: string;
  departmentalVehicleMarker?: number;
  alterationMarker?: number;
  variantVersionMarker?: string;
  grossEecWeight?: number;
  trainEecWeight?: number;
  maxTrainEecWeight?: number;
  manufactureYear?: string;
  regnDate?: string;
  firstUseDate?: string;
  coifDate?: string;
  ntaNumber?: string;
  coifSerialNumber?: string;
  coifCertifierName?: string;
  approvalType?: string;
  approvalTypeNumber?: string;
  variantNumber?: string;
  conversionRefNo?: string;
  seatsLowerDeck?: number;
  seatsUpperDeck?: number;
  standingCapacity?: number;
  speedRestriction?: number;
  speedLimiterMrk?: number;
  tachoExemptionMrk?: number;
  dispensations?: string;
  remarks?: string;
  reasonForCreation?: string;
  statusCode?: string;
  unladenWeight?: number;
  grossKerbWeight?: number;
  grossLadenWeight?: number;
  grossGbWeight?: number;
  grossDesignWeight?: number;
  trainGbWeight?: number;
  trainDesignWeight?: number;
  maxTrainGbWeight?: number;
  maxTrainDesignWeight?: number;
  maxLoadOnCoupling?: number;
  frameDescription?: string;
  tyreUseCode?: string;
  roadFriendly?: boolean;
  drawbarCouplingFitted?: boolean;
  euroStandard?: string;
  suspensionType?: string;
  couplingType?: string;
  length?: number;
  height?: number;
  width?: number;
  frontAxleTo5thWheelMin?: number;
  frontAxleTo5thWheelMax?: number;
  frontAxleTo5thWheelCouplingMin?: number;
  frontAxleTo5thWheelCouplingMax?: number;
  frontAxleToRearAxle?: number;
  rearAxleToRearTrl?: number;
  couplingCenterToRearAxleMin?: number;
  couplingCenterToRearAxleMax?: number;
  couplingCenterToRearTrlMin?: number;
  couplingCenterToRearTrlMax?: number;
  centreOfRearmostAxleToRearOfTrl?: number;
  notes?: string;
  purchaserNotes?: string;
  manufacturerNotes?: string;
  noOfAxles?: number;
  brakeCode?: string;
  numberOfSeatbelts?: string;
  seatbeltInstallationApprovalDate?: string;
  axles?: Axles[];
  brakes?: Brakes[];
  makeModel?: MakeModel;
  vehicleClass?: VehicleClass;
}

export default TechnicalRecord;
