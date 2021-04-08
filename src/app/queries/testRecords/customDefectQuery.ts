const CUSTOM_DEFECT_QUERY = 'SELECT JSON_OBJECT('
  + "'referenceNumber', `c`.`referenceNumber`,"
  + "'defectName', `c`.`defectName`, "
  + "'defectNotes', `c`.`defectNotes`"
  + ')'
  + 'FROM `custom_defect` `c`'
  + 'WHERE `test_result_id` = ?;';

export default CUSTOM_DEFECT_QUERY;
