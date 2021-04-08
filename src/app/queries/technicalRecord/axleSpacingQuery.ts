const AXLE_SPACING_QUERY =
  'SELECT JSON_OBJECT(' +
  "'axles', `a`.`axles`, " +
  "'value', `a`.`value`" +
  ') result' +
  'FROM `axle_spacing` `a`' +
  'WHERE `a`.`technical_record_id` = ?;';

export default AXLE_SPACING_QUERY;
