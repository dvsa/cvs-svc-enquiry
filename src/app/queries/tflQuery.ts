export const TFL_QUERY = `
SELECT 
    VRM,
    VIN,
    SerialNumberOfCertificate,
    CertificationModificationType,
    TestStatus,
    PMEuropeanEmissionClassificationCode,
    ValidFromDate,
    ExpiryDate,
    IssuedBy,
    IssueDate
FROM tfl_view
WHERE ValidFromDate >= STR_TO_DATE(?, '%d/%m/%Y %h:%i:%s');`;
