import Tyre from './tyre';

interface Axles {
  axleNumber?: number;
  parkingBrakeMrk?: boolean;
  kerbWeight?: number;
  ladenWeight?: number;
  gbWeight?: number;
  eecWeight?: number;
  designWeight?: number;
  tyreSize?: string;
  plyRating?: string;
  fitmentCode?: string;
  dataTrAxles?: number;
  speedCategorySymbol?: string;
  tyreCode?: number;
  brakeActuator?: number;
  leverLength?: number;
  springBrakeParking?: boolean;
  tyres?: Tyre[];
  dtpNumber?: string;
  loadSensingValve?: number;
  antilockBrakingSystem?: number;
}

export default Axles;
