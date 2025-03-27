export const ANTS_QUERY = `
SELECT 
    vrm_trm,
    make,
    model,
    wheelplan,
    DATE_FORMAT(test_date,'%d-%m-%Y') test_date,
    weight_before_test,
    weight_after_test,
    DOE_reference,
    DATE_FORMAT(tech_record_date,'%d-%m-%Y') tech_record_date
FROM vw_dvla_ants
WHERE test_date >= STR_TO_DATE(?, '%d/%m/%Y %T')
ORDER BY test_date ASC;`;
