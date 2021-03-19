import Axles from './axles';
import Brakes from './brakes';

enum RecordType {
  current = 'current',
  provisional = 'provisional',
}

interface TechnicalRecord {
  recordtype: RecordType | null;
  createdAt: string | null;
  lastUpdatedAt: string | null;
  functionCode: string | null;
  offRoad: boolean | null;
  numberOfWheelsDriven: number | null;
  emissionsLimit: string | null;
  departmentalVehicleMarker: number | null;
  alterationMarker: number | null;
  variantVersionMarker: string | null;
  grossEecWeight: number | null;
  trainEecWeight: number | null;
  maxTrainEecWeight: number | null;
  manufactureYear: string | null;
  regnDate: string | null;
  firstUseDate: string | null;
  coifDate: string | null;
  ntaNumber: string | null;
  coifSerialNumber: string | null;
  coifCertifierName: string | null;
  conversionRefNo: string | null;
  seatsLowerDeck: number | null;
  seatsUpperDeck: number | null;
  standingCapacity: number | null;
  speedRestriction: number | null;
  speedLimiterMrk: number | null;
  tachoExemptionMrk: number | null;
  dispensations: string | null;
  remarks: string | null;
  reasonForCreation: string | null;
  statusCode: string | null;
  unladenWeight: number | null;
  grossKerbWeight: number | null;
  grossLadenWeight: number | null;
  grossGbWeight: number | null;
  grossDesignWeight: number | null;
  trainGbWeight: number | null;
  trainDesignWeight: number | null;
  maxTrainGbWeight: number | null;
  maxTrainDesignWeight: number | null;
  maxLoadOnCoupling: number | null;
  frameDescription: string | null;
  tyreUseCode: string | null;
  roadFriendly: boolean | null;
  drawbarCouplingFitted: boolean | null;
  euroStandard: string | null;
  suspensionType: string | null;
  couplingType: string | null;
  length: number | null;
  height: number | null;
  width: number | null;
  frontAxleTo5thWheelMin: number | null;
  frontAxleTo5thWheelMax: number | null;
  frontAxleTo5thWheelCouplingMin: number | null;
  frontAxleTo5thWheelCouplingMax: number | null;
  frontAxleToRearAxle: number | null;
  rearAxleToRearTrl: number | null;
  couplingCenterToRearAxleMin: number | null;
  couplingCenterToRearAxleMax: number | null;
  couplingCenterToRearTrlMin: number | null;
  couplingCenterToRearTrlMax: number | null;
  centreOfRearmostAxleToRearOfTrl: number | null;
  notes: string | null;
  noOfAxles: number | null;
  brakeCode: string | null;
  numberOfSeatbelts: string | null;
  seatbeltInstallationApprovalDate: string | null;
  axles: Axles[];
  brakes: Brakes;
}

export default TechnicalRecord;
