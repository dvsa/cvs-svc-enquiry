const BRAKE_QUERY =
  'SELECT JSON_OBJECT(' +
  "'brakeCodeOriginal', `p`.`brakeCodeOriginal`," +
  "'brakeCode', `p`.`brakeCode`," +
  "'dataTrBrakeOne', `p`.`dataTrBrakeOne`," +
  "'dataTrBrakeTwo', `p`.`dataTrBrakeTwo`," +
  "'dataTrBrakeThree', `p`.`dataTrBrakeThree`," +
  "'retarderBrakeOne', `p`.`retarderBrakeOne`," +
  "'retarderBrakeTwo', `p`.`retarderBrakeTwo`," +
  "'serviceBrakeForceA', `p`.`serviceBrakeForceA`," +
  "'secondaryBrakeForceA', `p`.`secondaryBrakeForceA`," +
  "'parkingBrakeForceA', `p`.`parkingBrakeForceA`," +
  "'serviceBrakeForceB', `p`.`serviceBrakeForceB`," +
  "'secondaryBrakeForceB', `p`.`secondaryBrakeForceB`," +
  "'parkingBrakeForceB', `p`.`parkingBrakeForceB`" +
  ') result' +
  ' FROM `psv_brakes` `p`' +
  ' WHERE technical_record_id = ?;';

export default BRAKE_QUERY;
