'use strict';

/**
 * GAS API 部署完成後，只修改 gasWebAppUrl。
 * 前端不得放置試算表 ID、Drive 資料夾 ID 或管理密碼。
 */
window.APP_RUNTIME_CONFIG = Object.freeze({
  gasWebAppUrl: ''
});
