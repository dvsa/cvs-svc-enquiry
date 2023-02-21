const EVL_QUERY = `
SET @prev := '';
SELECT testExpiryDate, vrm_trm, certificateNumber
FROM (
    SELECT testExpiryDate, vrm_trm, certificateNumber, IF(@prev <> vrm_trm, @rn:=0,@rn) AS row_number_over_partition, @prev:=vrm_trm, @rn:=@rn+1 AS rn
    FROM evl_view
) as SubQ
WHERE row_number_over_partition = 0
`;

const EVL_VRM_QUERY = `${EVL_QUERY} AND vrm_trm = ?;`;

export { EVL_QUERY, EVL_VRM_QUERY };
