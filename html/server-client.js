'use strict';

(function(global) {
  const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzDn10QPub6PXuJ8AAPJtEwCP0n48_iqv3HjEsni2Ou8pXDAURWtxXWMQaUkB3C6WmT/exec';
  const REQUEST_TIMEOUT_MS = 45000;

  async function invoke(functionName, args) {
    const action = String(functionName || '').trim();

    if (!action) {
      throw new Error('缺少後端函式名稱');
    }

    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
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
        credentials: 'omit',
        signal: controller.signal
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error('後端連線失敗（HTTP ' + response.status + '）');
      }

      let result;

      try {
        result = JSON.parse(text);
      } catch (error) {
        throw new Error(
          '後端回傳格式錯誤。請確認 GAS Web App 已重新部署，且存取權限設為「任何人」。'
        );
      }

      return result;
    } catch (error) {
      if (error && error.name === 'AbortError') {
        throw new Error('後端回應逾時，請稍後再試');
      }

      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  global.GasBackend = Object.freeze({
    url: GAS_WEB_APP_URL,
    invoke: invoke
  });
})(window);
