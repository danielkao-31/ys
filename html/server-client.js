'use strict';

(function(global) {
  function getApiUrl_() {
    const config = global.APP_RUNTIME_CONFIG || {};
    return String(config.gasWebAppUrl || '').trim();
  }

  function validateApiUrl_(url) {
    if (!url) {
      throw new Error('尚未設定 GAS Web App /exec 網址');
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)) {
      throw new Error('GAS Web App 網址格式錯誤，必須使用完整的 /exec 網址');
    }
  }

  async function invoke(functionName, args) {
    const action = String(functionName || '').trim();
    const url = getApiUrl_();

    if (!action) {
      throw new Error('缺少後端函式名稱');
    }

    validateApiUrl_(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: JSON.stringify({
        action: action,
        args: Array.isArray(args) ? args : []
      }),
      redirect: 'follow',
      cache: 'no-store',
      credentials: 'omit'
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error('後端連線失敗（HTTP ' + response.status + '）');
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('後端回傳格式錯誤。請確認 GAS Web App 已重新部署，且存取權限設為「任何人」。');
    }
  }

  global.GasBackend = Object.freeze({
    get url() {
      return getApiUrl_();
    },
    invoke: invoke
  });
})(window);
