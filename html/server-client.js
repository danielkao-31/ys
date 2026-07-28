'use strict';

(function(global) {
  const DEFAULT_REQUEST_TIMEOUT_MS = 90 * 1000;
  const LONG_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
  const LONG_RUNNING_ACTIONS = new Set([
    'adminRunDailyHotDataReconciliation',
    'adminRunWeeklyArchive',
    'adminRunArchiveCleanup',
    'adminPreviewFix12DataRepairs',
    'adminRunFix12DataRepairBatch',
    'adminEnsureDataMaintenanceTriggers',
    'adminRunV0131Migration',
    'adminResumeV0131Migration',
    'adminPauseV0131Migration',
    'adminStartV0131Finalization',
    'adminVerifyV0131Migration',
    'adminResetV0132Migration',
    'adminVerifyArchiveBatch',
    'adminGetArchiveManifest',
    'adminResumeArchiveBatch',
    'adminPreviewSpecialTaskCsv',
    'adminConfirmSpecialTaskResults',
    'adminSendSpecialTaskRewards'
  ]);
  let compatibilityPromise = null;
  let compatibilityUrl = '';

  function isAdminAction_(action) {
    return String(action || '').indexOf('admin') === 0;
  }

  function getApiUrl_(action) {
    const config = global.APP_RUNTIME_CONFIG || {};
    const publicUrl = String(config.gasWebAppUrl || '').trim();

    if (!isAdminAction_(action)) {
      return publicUrl;
    }

    const adminUrl = String(config.adminGasWebAppUrl || '').trim();
    if (adminUrl) {
      return adminUrl;
    }

    return config.allowSharedAdminEndpoint === true ? publicUrl : '';
  }

  function validateApiUrl_(url, action) {
    if (!url) {
      throw new Error('尚未設定對應的 GAS Web App /exec 網址');
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)) {
      throw new Error('GAS Web App 網址格式錯誤，必須使用完整的 /exec 網址');
    }

    if (isAdminAction_(action)) {
      const config = global.APP_RUNTIME_CONFIG || {};
      const publicUrl = String(config.gasWebAppUrl || '').trim();

      if (
        publicUrl &&
        url === publicUrl &&
        config.allowSharedAdminEndpoint !== true
      ) {
        throw new Error('管理 API 必須使用獨立的受限制 GAS Web App /exec 網址');
      }
    }
  }

  function getRequestTimeoutMs_(action) {
    return LONG_RUNNING_ACTIONS.has(action)
      ? LONG_REQUEST_TIMEOUT_MS
      : DEFAULT_REQUEST_TIMEOUT_MS;
  }

  function getExpectedApiContractVersion_() {
    const config = global.APP_RUNTIME_CONFIG || {};
    return String(config.expectedApiContractVersion || '').trim();
  }

  function getSemverMajor_(value) {
    const match = String(value || '').trim().match(/^(?:v)?(\d+)(?:\.|$)/);
    return match ? Number(match[1]) : -1;
  }

  function isApiContractCompatible_(actualVersion, expectedVersion, supportedRange) {
    const actualMajor = getSemverMajor_(actualVersion);
    const expectedMajor = getSemverMajor_(expectedVersion);

    if (actualMajor < 0 || expectedMajor < 0 || actualMajor !== expectedMajor) {
      return false;
    }

    const minVersion = String(supportedRange && supportedRange.MIN || '').trim();
    const maxVersion = String(supportedRange && supportedRange.MAX || '').trim();
    if (minVersion && getSemverMajor_(minVersion) !== expectedMajor) return false;
    if (maxVersion && getSemverMajor_(maxVersion) !== expectedMajor) return false;

    return true;
  }

  function createCompatibilityError_(actualVersion, expectedVersion) {
    const error = new Error(
      'API 契約不相容：目前後端契約是 ' +
      (actualVersion || '未知版本') +
      '，前端需要相容於 ' +
      expectedVersion +
      '。請依部署順序先更新後端契約，再重新整理頁面。'
    );
    error.code = 'API_CONTRACT_MISMATCH';
    return error;
  }

  function ensureApiCompatibility_(url) {
    const expectedVersion = getExpectedApiContractVersion_();

    if (!expectedVersion) {
      return Promise.resolve();
    }

    if (compatibilityPromise && compatibilityUrl === url) {
      return compatibilityPromise;
    }

    compatibilityUrl = url;

    const controller = typeof global.AbortController === 'function'
      ? new global.AbortController()
      : null;
    let timedOut = false;
    let timeoutId = 0;
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      credentials: 'omit'
    };

    if (controller) {
      requestOptions.signal = controller.signal;
    }

    const requestPromise = fetch(
      url + '?health=' + encodeURIComponent(expectedVersion),
      requestOptions
    );
    const timeoutPromise = new Promise(function(resolve, reject) {
      timeoutId = global.setTimeout(function() {
        timedOut = true;

        if (controller) {
          controller.abort();
        }

        reject(createTimeoutError_());
      }, DEFAULT_REQUEST_TIMEOUT_MS);
    });

    compatibilityPromise = Promise.race([requestPromise, timeoutPromise])
      .then(async function(response) {
        if (!response.ok) {
          throw new Error('無法確認後端版本（HTTP ' + response.status + '）');
        }

        const result = JSON.parse(await response.text());
        const health = result && result.data || {};
        const actualVersion = String(health.apiContractVersion || '').trim();
        const supportedRange = health.supportedFrontendApiContract || {};

        if (!isApiContractCompatible_(actualVersion, expectedVersion, supportedRange)) {
          throw createCompatibilityError_(actualVersion, expectedVersion);
        }
      })
      .catch(function(error) {
        compatibilityPromise = null;

        if (timedOut || (error && error.name === 'AbortError')) {
          throw createTimeoutError_();
        }

        if (error && (error.name === 'TypeError' || /failed to fetch/i.test(String(error.message || '')))) {
          throw new Error('無法連線到 GAS Web App。請確認前端使用的是目前部署中的 /exec 網址。');
        }

        throw error;
      })
      .finally(function() {
        if (timeoutId) {
          global.clearTimeout(timeoutId);
        }
      });

    return compatibilityPromise;
  }

  function createTimeoutError_() {
    const error = new Error(
      '伺服器回應逾時。後端操作可能已完成，請重新讀取資料確認後再決定是否重試。'
    );
    error.code = 'REQUEST_TIMEOUT';
    error.isTimeout = true;
    return error;
  }

  async function invoke(functionName, args) {
    const action = String(functionName || '').trim();
    const url = getApiUrl_(action);

    if (!action) {
      throw new Error('缺少後端函式名稱');
    }

    validateApiUrl_(url, action);
    await ensureApiCompatibility_(url);

    const timeoutMs = getRequestTimeoutMs_(action);
    const controller = typeof global.AbortController === 'function'
      ? new global.AbortController()
      : null;
    let timedOut = false;
    let timeoutId = 0;

    const requestOptions = {
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
    };

    if (controller) {
      requestOptions.signal = controller.signal;
    }

    const requestPromise = fetch(url, requestOptions)
      .then(async function(response) {
        return {
          response: response,
          text: await response.text()
        };
      });
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = global.setTimeout(() => {
        timedOut = true;

        if (controller) {
          controller.abort();
        }

        reject(createTimeoutError_());
      }, timeoutMs);
    });

    let result;

    try {
      result = await Promise.race([requestPromise, timeoutPromise]);
    } catch (error) {
      if (timedOut || (error && error.name === 'AbortError')) {
        throw createTimeoutError_();
      }

      if (error && (error.name === 'TypeError' || /failed to fetch/i.test(String(error.message || '')))) {
        throw new Error('無法連線到 GAS Web App。請確認前端使用的是目前部署中的 /exec 網址。');
      }

      throw error;
    } finally {
      if (timeoutId) {
        global.clearTimeout(timeoutId);
      }
    }

    if (!result.response.ok) {
      throw new Error('後端連線失敗（HTTP ' + result.response.status + '）');
    }

    try {
      return JSON.parse(result.text);
    } catch (error) {
      throw new Error(isAdminAction_(action)
        ? '管理後端回傳格式錯誤。請確認目前 GAS Web App 已重新部署，並使用完整的 /exec 網址。'
        : '使用者後端回傳格式錯誤。請確認公開 GAS Web App 已重新部署，且使用的是完整 /exec 網址。');
    }
  }

  global.GasBackend = Object.freeze({
    get url() {
      return getApiUrl_();
    },
    invoke: invoke
  });
})(window);
