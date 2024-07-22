interface PSVBrakes {
  id?: number;
  brakeCodeOriginal?: string;
  brakeCode?: string;
  dataTrBrakeOne?: string;
  dataTrBrakeTwo?: string;
  dataTrBrakeThree?: string;
  retarderBrakeOne?: string;
  retarderBrakeTwo?: string;
  serviceBrakeForceA?: number;
  secondaryBrakeForceA?: number;
  parkingBrakeForceA?: number;
  serviceBrakeForceB?: number;
  secondaryBrakeForceB?: number;
  parkingBrakeForceB?: number;
}

export default PSVBrakes;
