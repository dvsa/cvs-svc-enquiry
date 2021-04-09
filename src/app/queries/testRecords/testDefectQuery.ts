const TEST_DEFECT_QUERY = 'SELECT JSON_OBJECT('
  + "'defect', JSON_OBJECT("
  + "'imNumber', `d`.`imNumber`, "
  + "'imDescription', `d`.`imDescription`, "
  + "'itemNumber', `d`.`itemNumber`,"
  + "'itemDescription', `d`.`itemDescription`, "
  + "'deficiencyRef', `d`.`deficiencyRef`,"
  + "'deficiencyId', `d`.`deficiencyId`, "
  + "'deficiencySubId', `d`.`deficiencySubId`, "
  + "'deficiencyCategory', `d`.`deficiencyCategory`, "
  + "'deficiencyText', `d`.`deficiencyText`, "
  + "'stdForProhibition', IF (`d`.`stdForProhibition` = 1, cast(TRUE AS json), cast(FALSE AS json))"
  + '),'
  + "'location', JSON_OBJECT("
  + "'vertical', `l`.`vertical`, "
  + "'horizontal', `l`.`horizontal`, "
  + "'lateral', `l`.`lateral`, 'longitudinal', `l`.`longitudinal`, "
  + "'rowNumber', `l`.`rowNumber`, "
  + "'seatNumber', `l`.`seatNumber`, "
  + "'axleNumber', `l`.`axleNumber`"
  + '),'
  + "'notes', `t`.`notes`, "
  + "'prs', IF(`t`.`prs` = 1, cast(TRUE AS json), cast(FALSE AS json)),"
  + "'prohibitionIssued', IF(`t`.`prohibitionIssued` = 1, cast(TRUE AS json), cast(FALSE AS json))"
  + ') result'
  + 'FROM test_defect t'
  + 'JOIN `defect` `d` on `d`.`id` = `t`.`defect_id`'
  + 'JOIN `location` `l` on `l`.`id` = `t`.`location_id`'
  + 'WHERE `test_result_id` = ?;';

export default TEST_DEFECT_QUERY;
