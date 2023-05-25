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
WHERE ValidFromDate >= STR_TO_DATE(?, '%d/%m/%Y %h:%i:%s');
`;
