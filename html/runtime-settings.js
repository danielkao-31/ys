'use strict';

/**
 * GitHub Pages 前端連接 GAS JSON API。
 * 前端不得放置試算表 ID、Drive 資料夾 ID 或管理密碼。
 */
window.APP_RUNTIME_CONFIG = Object.freeze({
  gasWebAppUrl: 'https://script.google.com/macros/s/AKfycbwP3NSPi1CXfUeaMkLj_bvae3kQgCrP0-8QYfrA4EmWAemTqMIBJxrjGzcBG2uDjPOI/exec',
  adminGasWebAppUrl: 'https://script.google.com/macros/s/AKfycbzDn10QPub6PXuJ8AAPJtEwCP0n48_iqv3HjEsni2Ou8pXDAURWtxXWMQaUkB3C6WmT/exec',
  expectedApiContractVersion: '1.1.0',
  assetVersion: '20260728-btest-rc5'
});
