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
WHERE IssueDateTime >= STR_TO_DATE(?, '%d/%m/%Y %T')
ORDER BY IssueDateTime ASC;`;
