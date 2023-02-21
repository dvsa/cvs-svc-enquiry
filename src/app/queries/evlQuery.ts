const EVL_QUERY = `
SELECT testExpiryDate, vrm_trm, certificateNumber
FROM (
    SELECT testExpiryDate, vrm_trm, certificateNumber
    FROM evl_view
) as SubQ
`;

const EVL_VRM_QUERY = `${EVL_QUERY} WHERE vrm_trm = ?;`;

export { EVL_QUERY, EVL_VRM_QUERY };
