const AXLE_QUERY = 'SELECT `a`.`id`, JSON_OBJECT('
  + "'tyre', JSON_OBJECT("
  + "'tyreSize', `t`.`tyreSize`,"
  + "'plyRating', `t`.`plyRating`,"
  + "'fitmentCode', `t`.`fitmentCode`,"
  + "'dataTrAxles', `t`.`dataTrAxles`, "
  + "'speedCategorySymbol', `t`.`speedCategorySymbol`, "
  + "'tyreCode', `t`.`tyreCode`"
  + '), '
  + "'axleNumber', `a`.`axleNumber`, "
  + "'parkingBrakeMrk', IF(`a`.`parkingBrakeMrk` = 1, cast(TRUE AS json), cast(FALSE AS json)), "
  + "'kerbWeight', `a`.`kerbWeight`,"
  + "'ladenWeight', `a`.`ladenWeight`,"
  + "'gbWeight', `a`.`gbWeight`, "
  + "'eecWeight', `a`.`eecWeight`,"
  + "'designWeight', `a`.`designWeight`, "
  + "'brakeActuator', `a`.`brakeActuator`, "
  + "'leverLength', `a`.`leverLength`, "
  + "'springBrakeParking', IF(`a`.`springBrakeParking` = 1, cast(TRUE AS json), cast(FALSE AS json))"
  + ') result'
  + ' FROM `axles` `a`'
  + ' JOIN `tyre` t on `a`.`tyre_id` = `t`.`id`'
  + ' WHERE technical_record_id = ?;';

export default AXLE_QUERY;
