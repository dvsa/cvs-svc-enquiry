import { dateFormat } from '../../../constants';

const queryBody = 'SELECT tr.id, JSON_OBJECT('
  + "'fuelEmission', JSON_OBJECT("
  + "'modTypeCode', fe.modTypeCode, "
  + "'description', fe.description, "
  + "'emissionStandard', fe.emissionStandard, "
  + "'fuelType', fe.fuelType"
  + '), '
  + "'test_station', JSON_OBJECT("
  + "'pNumber', ts.pNumber,"
  + "'name', ts.name,"
  + "'type', ts.type"
  + '),'
  + "'tester', JSON_OBJECT("
  + "'staffId', t.staffId, "
  + "'name', t.name, "
  + "'email_address', t.email_address"
  + '),'
  + "'preparer', JSON_OBJECT("
  + "'preparerId', p.preparerId, "
  + "'name', p.name"
  + '), '
  + "'vehicle_class', JSON_OBJECT("
  + "'code', vc.code, "
  + "'description', vc.description, "
  + "'vehicleType', vc.vehicleType,"
  + "'vehicleSize', vc.vehicleSize, "
  + "'vehicleConfiguration', vc.vehicleConfiguration,"
  + "'euVehicleCategory', vc.euVehicleCategory"
  + '), '
  + "'testType', JSON_OBJECT("
  + "'testTypeClassification', tt.testTypeClassification, "
  + "'testTypeName', tt.testTypeName"
  + '), '
  + "'testStatus', testStatus, "
  + "'reasonForCancellation', reasonForCancellation, "
  + "'numberOfSeats', numberOfSeats, "
  + "'odometerReading', odometerReading,"
  + "'odometerReadingUnits', odometerReadingUnits,"
  + "'countryOfRegistration', countryOfRegistration,"
  + "'noOfAxles', noOfAxles, "
  + "'regnDate', regnDate, "
  + "'firstUseDate', firstUseDate, "
  + `'createdAt', DATE_FORMAT(tr.createdAt, '${dateFormat}'), `
  + `'lastUpdatedAt', DATE_FORMAT(tr.lastUpdatedAt, '${dateFormat}'), `
  + "'testCode', testCode, "
  + "'testNumber', testNumber,"
  + "'certificateNumber', certificateNumber, "
  + "'secondaryCertificateNumber', secondaryCertificateNumber, "
  + "'testExpiryDate', testExpiryDate, "
  + "'testAnniversaryDate', testAnniversaryDate,"
  + `'testTypeStartTimestamp', DATE_FORMAT(tr.testTypeStartTimestamp, '${dateFormat}'), `
  + `'testTypeEndTimestamp', DATE_FORMAT(tr.testTypeEndTimestamp, '${dateFormat}'), `
  + "'numberOfSeatbeltsFitted', numberOfSeatbeltsFitted, "
  + "'lastSeatbeltInstallationCheckDate', lastSeatbeltInstallationCheckDate,"
  + "'seatbeltInstallationCheckDate', IF(tr.seatbeltInstallationCheckDate = 1, cast(TRUE AS json), cast(FALSE AS json)), "
  + "'testResult', testResult,"
  + "'reasonForAbandoning', reasonForAbandoning, "
  + "'additionalNotesRecorded', additionalNotesRecorded,"
  + "'additionalCommentsForAbandon', additionalCommentsForAbandon, "
  + "'particulateTrapFitted', particulateTrapFitted, "
  + "'particulateTrapSerialNumber', particulateTrapSerialNumber,"
  + "'modificationTypeUsed', modificationTypeUsed, "
  + "'smokeTestKLimitApplied', smokeTestKLimitApplied,"
  + "'createdById', i.identityId, "
  + "'lastUpdatedById', i2.identityId"
  + ') result'
  + ' FROM test_result tr'
  + ' JOIN vehicle v on tr.vehicle_id = v.id'
  + ' JOIN vehicle_class vc on tr.vehicle_class_id = vc.id'
  + ' JOIN fuel_emission fe on tr.fuel_emission_id = fe.id'
  + ' JOIN test_station ts on tr.test_station_id = ts.id'
  + ' JOIN tester t on tr.tester_id = t.id'
  + ' JOIN preparer p on tr.preparer_id = p.id'
  + ' JOIN test_type tt on tr.test_type_id = tt.id'
  + ' LEFT JOIN identity i on tr.createdBy_Id = i.id'
  + ' LEFT JOIN identity i2 on tr.lastUpdatedBy_Id = i2.id';

const TEST_RESULTS_BY_VIN = `${queryBody} WHERE v.vin = ?`;
const TEST_RESULTS_BY_VRM = `${queryBody} WHERE v.vrm_trm = ?`;
const TEST_RESULTS_BY_TEST_NUMBER = `${queryBody} WHERE tr.testNumber = ?`;

export { TEST_RESULTS_BY_VIN, TEST_RESULTS_BY_VRM, TEST_RESULTS_BY_TEST_NUMBER };
