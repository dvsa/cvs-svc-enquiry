export const ANTS_QUERY = `
SELECT 
    vrm_trm,
    make,
    model,
    wheelplan,
    test_date,
    weight_before_test,
    weight_after_test,
    DOE_reference,
    tech_record_date
FROM vw_dvla_ants
WHERE test_date >= STR_TO_DATE(?, '%d/%m/%Y %T')
ORDER BY test_date ASC;`;
