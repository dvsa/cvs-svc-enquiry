const PLATING_QUERY = 'SELECT JSON_OBJECT('
  + "'plateSerialNumber', `p`.`plateSerialNumber`,"
  + "'plateIssueDate', `p`.`plateIssueDate`, "
  + "'plateReasonForIssue', `p`.`plateReasonForIssue`,"
  + "'plateIssuer', `p`.`plateIssuer`"
  + ') result'
  + 'FROM `plate` `p`'
  + 'WHERE `p`.`technical_record_id` = ?;';

export default PLATING_QUERY;
