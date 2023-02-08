export const TFL_QUERY = 'SELECT `v`.`vrm_trm`, `v`.`vin`, `c`.`certificateNumber`, `c`.`modificationTypeUsed`, `c`.`testStatus`, `c`.`fuel_emission_id`,`c`.`createdAt`, `c`.`lastUpdatedAt`, `c`.`createdBy_Id`, `c`.`firstUseDate` FROM `vehicle` `v`, `test_result` `c` LIMIT 100;';
// TODO: This is totally wrong and needs updating when data have completed the work for this query
