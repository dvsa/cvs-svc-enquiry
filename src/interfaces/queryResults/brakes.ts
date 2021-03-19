interface Brakes {
  brakeCodeOriginal: string | null;
  brakeCode: string | null;
  dataTrBrakeOne: string | null;
  dataTrBrakeTwo: string | null;
  dataTrBrakeThree: string | null;
  retarderBrakeOne: string | null;
  retarderBrakeTwo: string | null;
  dtpNumber: string | null;
  loadSensingValve: boolean | null;
  antilockBrakingSystem: boolean | null;
  serviceBrakeForceA: number | null;
  secondaryBrakeForceA: number | null;
  parkingBrakeForceA: number | null;
  serviceBrakeForceB: number | null;
  secondaryBrakeForceB: number | null;
  parkingBrakeForceB: number | null;
}

export default Brakes;
