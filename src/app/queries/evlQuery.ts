const EVL_QUERY = `SELECT testExpiryDate, vrm_trm, certificateNumber FROM evl_view`;

const EVL_VRM_QUERY = `${EVL_QUERY} AND vrm_trm = ?;`;

export { EVL_QUERY, EVL_VRM_QUERY };
