'use strict';

/**
 * GitHub Pages 前端連接 GAS JSON API。
 * 前端不得放置試算表 ID、Drive 資料夾 ID 或管理密碼。
 */
window.APP_RUNTIME_CONFIG = Object.freeze({
  gasWebAppUrl: 'https://script.google.com/macros/s/AKfycbzohEAuUplqyu0iZOwu2RxdnwwFf6MJptlYHHnw5TvDyUgLswS_VVVBPQRedWO1hTw/exec',
  adminGasWebAppUrl: 'https://script.google.com/macros/s/AKfycbzDn10QPub6PXuJ8AAPJtEwCP0n48_iqv3HjEsni2Ou8pXDAURWtxXWMQaUkB3C6WmT/exec',
  expectedApiContractVersion: '1.1.0',
  assetVersion: '20260727-v01321-fix12-rc4'
});
