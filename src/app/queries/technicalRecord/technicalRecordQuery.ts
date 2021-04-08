const TECHNICAL_RECORD_QUERY =
  'SELECT `t`.`id`, JSON_OBJECT(' +
  "'recordCompleteness', `t`.`recordCompleteness`, " +
  "'createdAt', `t`.`createdAt`, " +
  "'lastUpdatedAt', `t`.`lastUpdatedAt`, " +
  "'makeModel', JSON_OBJECT(" +
  "'make', `mm`.`make`, " +
  "'model', `mm`.`model`, " +
  "'chassisMake', `mm`.`chassisMake`," +
  "'chassisModel', `mm`.`chassisModel`, " +
  "'bodyMake', `mm`.`bodyMake`, " +
  "'bodyModel', `mm`.`bodyModel`," +
  "'modelLiteral', `mm`.`modelLiteral`, " +
  "'bodyTypeCode', `mm`.`bodyTypeCode`, " +
  "'bodyTypeDescription', `mm`.`bodyTypeDescription`, " +
  "'fuelPropulsionSystem', `mm`.`fuelPropulsionSystem`," +
  "'dtpCode', `mm`.`dtpCode`" +
  '),' +
  "'functionCode', `t`.`functionCode`, " +
  "'offRoad', IF(`t`.`offRoad` = 1, cast(TRUE AS json), cast(FALSE AS json)), " +
  "'numberOfWheelsDriven', `t`.`numberOfWheelsDriven`, " +
  "'emissionsLimit', `t`.`emissionsLimit`, " +
  "'departmentalVehicleMarker', IF(`t`.`departmentalVehicleMarker` = 1, cast(TRUE AS json), cast(FALSE AS json)), " +
  "'alterationMarker', IF(`t`.`alterationMarker` = 1, cast(TRUE AS json), cast(FALSE AS json)), " +
  "'vehicleClass', JSON_OBJECT(" +
  "'code', `vc`.`code`, " +
  "'description', `vc`.`description`, " +
  "'vehicleType', `vc`.`vehicleType`, " +
  "'vehicleSize', `vc`.`vehicleSize`, " +
  "'vehicleConfiguration', `vc`.`vehicleConfiguration`, " +
  "'euVehicleCategory', `vc`.`euVehicleCategory`" +
  '),' +
  "'variantVersionNumber', `t`.`variantVersionNumber`, " +
  "'grossEecWeight', `t`.`grossEecWeight`, " +
  "'trainEecWeight', `t`.`trainEecWeight`, " +
  "'maxTrainEecWeight', `t`.`maxTrainEecWeight`, " +
  "'manufactureYear', `t`.`manufactureYear`, " +
  "'regnDate', `t`.`regnDate`," +
  "'firstUseDate', `t`.`firstUseDate`, " +
  "'coifDate', `t`.`coifDate`, " +
  "'ntaNumber', `t`.`ntaNumber`, " +
  "'coifSerialNumber', `t`.`coifSerialNumber`," +
  "'coifCertifierName', `t`.`coifCertifierName`," +
  "'approvalType', `t`.`approvalType`," +
  "'approvalTypeNumber', `t`.`approvalTypeNumber`, " +
  "'variantNumber', `t`.`variantNumber`," +
  "'conversionRefNo', `t`.`conversionRefNo`, " +
  "'seatsLowerDeck', `t`.`seatsLowerDeck`, " +
  "'seatsUpperDeck', `t`.`seatsUpperDeck`, " +
  "'standingCapacity', `t`.`standingCapacity`, " +
  "'speedRestriction', `t`.`speedRestriction`, " +
  "'speedLimiterMrk', IF(`t`.`speedLimiterMrk` = 1, cast(TRUE AS json), cast(FALSE AS json)), " +
  "'tachoExemptMrk', IF(`t`.`tachoExemptMrk` = 1, cast(TRUE AS json), cast(FALSE AS json)) ," +
  "'dispensations',`t`.`dispensations`, " +
  "'remarks', `t`.`remarks`," +
  "'reasonForCreation', `t`.`reasonForCreation`, " +
  "'statusCode', `t`.`statusCode`, " +
  "'unladenWeight', `t`.`unladenWeight`, " +
  "'grossKerbWeight', `t`.`grossKerbWeight`, " +
  "'grossLadenWeight',`t`.`grossLadenWeight`, " +
  "'grossGbWeight', `t`.`grossGbWeight`, " +
  "'grossDesignWeight', `t`.`grossDesignWeight`, " +
  "'trainGbWeight', `t`.`trainGbWeight`, " +
  "'trainDesignWeight', `t`.`trainDesignWeight`, " +
  "'maxTrainGbWeight', `t`.`maxTrainGbWeight`," +
  "'maxTrainDesignWeight', `t`.`maxTrainDesignWeight`, " +
  "'maxLoadOnCoupling', `t`.`maxLoadOnCoupling`, " +
  "'frameDescription', `t`.`frameDescription`," +
  "'tyreUseCode', `t`.`tyreUseCode`, " +
  "'roadFriendly', IF(`t`.`roadFriendly` = 1, cast(TRUE AS json), cast(FALSE AS json))," +
  "'drawbarCouplingFitted', IF(`t`.`drawbarCouplingFitted` = 1, cast(TRUE AS json), cast(FALSE AS json)), " +
  "'euroStandard', `t`.`euroStandard`," +
  "'suspensionType', `t`.`suspensionType`, " +
  "'couplingType', `t`.`couplingType`, " +
  "'length', `t`.`length`," +
  "'height', `t`.`height`, " +
  "'width', `t`.`width`, " +
  "'frontAxleTo5thWheelMin', `t`.`frontAxleTo5thWheelMin`," +
  "'frontAxleTo5thWheelMax', `t`.`frontAxleTo5thWheelMax`, " +
  "'frontAxleTo5thWheelCouplingMin', `t`.`frontAxleTo5thWheelCouplingMin`, " +
  "'frontAxleTo5thWheelCouplingMax', `t`.`frontAxleTo5thWheelCouplingMax`, " +
  "'frontAxleToRearAxle', `t`.`frontAxleToRearAxle`," +
  "'rearAxleToRearTrl', `t`.`rearAxleToRearTrl`, " +
  "'couplingCenterToRearAxleMin', `t`.`couplingCenterToRearAxleMin`, " +
  "'couplingCenterToRearAxleMax', `t`.`couplingCenterToRearAxleMax`," +
  "'couplingCenterToRearTrlMin', `t`.`couplingCenterToRearTrlMin`, " +
  "'couplingCenterToRearTrlMax', `t`.`couplingCenterToRearTrlMax`, " +
  "'centreOfRearmostAxleToRearOfTrl', `t`.`centreOfRearmostAxleToRearOfTrl`, " +
  "'notes', `t`.`notes`, " +
  "'purchaserNotes', `t`.`purchaserNotes`," +
  "'manufacturerNotes', `t`.`manufacturerNotes`, " +
  "'noOfAxles', `t`.`noOfAxles`, " +
  "'brakeCode', `t`.`brakeCode`, " +
  "'dtpNumber', `t`.`brakes_dtpNumber`, " +
  "'loadSensingValve', IF(`t`.`brakes_loadSensingValve` = 1, cast(TRUE AS json), cast(FALSE AS json))," +
  "'antilockBrakingSystem', IF(`t`.`brakes_antilockBrakingSystem` = 1, cast(TRUE AS json), cast(FALSE AS json))," +
  "'updateType', `t`.`updateType`, " +
  "'numberOfSeatbelts', `t`.`numberOfSeatbelts`," +
  "'seatbeltInstallationApprovalDate', `t`.`seatbeltInstallationApprovalDate`" +
  ') result ' +
  'FROM `technical_record` `t`' +
  'JOIN `vehicle_class` `vc` on `t`.`vehicle_class_id` = `vc`.`id`' +
  'JOIN `make_model` `mm` ON `t`.`make_model_id` = `mm`.`id`' +
  'WHERE `t`.`vehicle_id` = ?';

export default TECHNICAL_RECORD_QUERY;
