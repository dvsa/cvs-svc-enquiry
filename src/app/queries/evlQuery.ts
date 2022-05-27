const EVL_QUERY = 'SELECT `testExpiryDate`, `vrm_trm`, `certificateNumber` FROM `evl_feed`';

const EVL_VRM_QUERY = `${EVL_QUERY} WHERE \`v\`.\`vrm_trm\` = ?`;

export { EVL_QUERY, EVL_VRM_QUERY };
