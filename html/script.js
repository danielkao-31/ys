const STORAGE_KEY = 'yct_current_player';
  const MESSAGE_SUPPRESSION_RETRY_KEY = 'yct_message_suppression_retry';
  const ASSET_BASE_URL = 'https://raw.githubusercontent.com/danielkao-31/ys/main';
  const ASSET_VERSION = '20260723-v01313';
  const IMAGE_FALLBACK_DATA_URL =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<rect width="160" height="160" rx="28" fill="#fff6df"/>' +
      '<path d="M40 70h80v46H40z" fill="#f1c464" stroke="#9a7359" stroke-width="8"/>' +
      '<path d="M48 55h64c10 0 18 8 18 18H30c0-10 8-18 18-18z" fill="#f8dc86" stroke="#9a7359" stroke-width="8"/>' +
      '<rect x="70" y="63" width="20" height="53" rx="7" fill="#d97b7b"/>' +
      '<text x="80" y="142" text-anchor="middle" font-size="14" font-family="Arial" fill="#86624e">圖片載入中</text>' +
      '</svg>'
    );
  const IMAGE_ASSETS = (() => {
    const assets = {
      appBgMobile: ASSET_BASE_URL + '/UI/app-bg-cute-v4.png',
      appBgDesktop: ASSET_BASE_URL + '/UI/app-bg-cute-v4.png',
      heroMobile: ASSET_BASE_URL + '/UI/hero-journey-cute-v4.png',
      heroDesktop: ASSET_BASE_URL + '/UI/hero-journey-cute-v4.png',
      journeyMobile: ASSET_BASE_URL + '/UI/journey-map-cute-v4.png',
      journeyDesktop: ASSET_BASE_URL + '/UI/journey-map-cute-v4.png',
      gameCamp: ASSET_BASE_URL + '/UI/board-panel-cute-v4.png',
      gamePanel: ASSET_BASE_URL + '/UI/quest-panel-cute-v4.png',
      iconPrayerLink: ASSET_BASE_URL + '/UI/icon-prayer-link.png',
      iconGrowth: ASSET_BASE_URL + '/UI/icon-growth.png',
      systemAnnouncement: ASSET_BASE_URL + '/Cute_Icons/Cute_Icon_07.png',
      specialTaskInProgress: ASSET_BASE_URL + '/Cute_Icons/Cute_Icon_01.png',
      specialTaskCompleted: ASSET_BASE_URL + '/Cute_Icons/Cute_Icon_03.png',
      fallbackChest: IMAGE_FALLBACK_DATA_URL
    };

    for (let i = 1; i <= 8; i += 1) {
      const id = String(i).padStart(2, '0');
      const chestUrl = ASSET_BASE_URL + '/Chest_Assets/Chest_' + id + '.png';

      assets['chest' + id + 'Close'] = chestUrl;
      assets['chest' + id + 'Open'] = chestUrl;
    }

    return assets;
  })();
  const SESSION_ERROR_CODES = [
    'SESSION_EXPIRED',
    'SESSION_INVALID',
    'ACCOUNT_DISABLED',
    'SESSION_REVOKED'
  ];
  const SESSION_TOKEN_ARG_APIS = [
    'getHomeDashboard',
    'getHomeSyncState',
    'getPlayerMessageCenter',
    'getMyVitalGroups',
    'getDailyPracticeStatus',
    'getDailyPracticeHistory',
    'getMeetingPracticeStatus',
    'getMeetingPracticeHistory',
    'getMyFootprintDashboard',
    'getPrayerRequests',
    'getPrayerCarousel',
    'getMyPrayerRequests',
    'getPlayerProfile',
    'getGroupJourney',
    'getGroupJourneyList',
    'getPlayerChestCollection',
    'getMyGroupContributionSummary',
    'getGrowthSummary'
  ];
  const SESSION_PAYLOAD_APIS = [
    'updatePlayerAvatar',
    'markPlayerMessageRead',
    'suppressPlayerMessageToday',
    'updateMyAccount',
    'updateMyPassword',
    'createVitalGroup',
    'joinVitalGroupByInviteCode',
    'switchPrimaryVitalGroup',
    'leaveVitalGroup',
    'createGroupPost',
    'updateGroupPost',
    'deleteGroupPost',
    'submitDailyPractice',
    'submitMeetingPractice',
    'searchPrayerRequests',
    'createPrayerRequest',
    'getPrayerRequestDetail',
    'respondPrayerRequest',
    'getMyPrayerRequestDetail',
    'updatePrayerRequest',
    'closePrayerRequest',
    'claimPlayerChestReward',
    'advancePlayerCycle'
  ];

  const CACHE_DEFAULT_TTL_MS = 5 * 60 * 1000;
  const CACHE_POLICIES = {
    dashboard: 90 * 1000,
    dailyPractice: 2 * 60 * 1000,
    meetingPractice: 2 * 60 * 1000,
    practiceHistory: 2 * 60 * 1000,
    journey: 2 * 60 * 1000,
    groupJourneyList: 2 * 60 * 1000,
    contribution: 2 * 60 * 1000,
    growth: 2 * 60 * 1000,
    chestSummary: 2 * 60 * 1000,
    chestCollection: 2 * 60 * 1000,
    chestSettingsForPlayer: 5 * 60 * 1000,
    prayerList: 60 * 1000,
    myPrayers: 60 * 1000,
    accountProfile: 3 * 60 * 1000,
    groupInfo: 3 * 60 * 1000
  };
  const HOME_SYNC_POLL_MS = 60 * 1000;
  const SERVER_READ_CALL_TIMEOUT_MS = 60 * 1000;
  const SERVER_MUTATION_APIS = new Set([
    'loginPlayer', 'registerPlayer', 'logoutPlayer', 'updatePlayerAvatar', 'markPlayerMessageRead',
    'suppressPlayerMessageToday', 'updateMyAccount', 'updateMyPassword',
    'createVitalGroup', 'joinVitalGroupByInviteCode', 'switchPrimaryVitalGroup',
    'leaveVitalGroup', 'createGroupPost', 'updateGroupPost', 'deleteGroupPost',
    'submitDailyPractice', 'submitMeetingPractice', 'createPrayerRequest',
    'respondPrayerRequest', 'updatePrayerRequest', 'closePrayerRequest',
    'claimPlayerChestReward', 'advancePlayerCycle'
  ]);
  const PENDING_MUTATION_TTL_MS = 24 * 60 * 60 * 1000;
  const TAIPEI_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;

  const JOURNEY_CHAPTERS = [
    { key: 'faith', title: '信心' },
    { key: 'virtue', title: '美德' },
    { key: 'knowledge', title: '知識' },
    { key: 'selfControl', title: '節制' },
    { key: 'endurance', title: '忍耐' },
    { key: 'godliness', title: '敬虔' },
    { key: 'brotherlyAffection', title: '弟兄相愛' },
    { key: 'love', title: '愛' }
  ];

  /*
   * 前端只保留欄位對應，不保存任務名稱、積分或確認文字。
   * 實際顯示內容全部由後端 SystemSettings → taskConfig 注入，
   * 避免前後端各自硬編碼一套設定。
   */
  const PRACTICE_CONFIG = {
    morning: {
      field: 'morningRevival',
      title: '',
      description: '',
      reward: ''
    },
    bible: {
      field: 'bibleReading',
      title: '',
      description: '',
      reward: ''
    },
    prayer: {
      field: 'prayer',
      title: '',
      description: '',
      reward: ''
    },
    book: {
      field: 'bookPursuit',
      title: '',
      description: '',
      reward: ''
    }
  };

  const WEEKLY_TASK_CONFIG = {
    outreachVisit: {
      field: 'outreachVisit',
      title: '',
      description: '',
      reward: ''
    },
    smallGroup: {
      field: 'smallGroup',
      title: '',
      description: '',
      reward: ''
    },
    prayerMeeting: {
      field: 'prayerMeeting',
      title: '',
      description: '',
      reward: ''
    },
    lordDayMeeting: {
      field: 'lordDayMeeting',
      title: '',
      description: '',
      reward: ''
    }
  };


  function applyTaskConfiguration_(taskConfig) {
    taskConfig = taskConfig || {};
    const daily = taskConfig.daily || {};
    const meeting = taskConfig.meeting || {};

    Object.keys(PRACTICE_CONFIG).forEach((type) => {
      const source = daily[type] || {};
      const config = PRACTICE_CONFIG[type];

      config.title = String(source.title || '').trim();
      config.description = String(source.description || '').trim();

      const score = Math.max(0, Number(source.score || 0));
      config.reward = String(source.reward || '').trim() ||
        (
          type === 'morning'
            ? '合作取得 +' + score
            : '個人貢獻 +' + score
        );
    });

    Object.keys(WEEKLY_TASK_CONFIG).forEach((type) => {
      const source = meeting[type] || {};
      const config = WEEKLY_TASK_CONFIG[type];

      config.title = String(source.title || '').trim();
      config.description = String(source.description || '').trim();

      const score = Math.max(0, Number(source.score || 0));
      config.reward = String(source.reward || '').trim() ||
        (
          type === 'outreachVisit'
            ? '合作取得 +' + score
            : '個人貢獻 +' + score
        );
    });

    const cardTargets = {
      morning: ['#homeMorningBtn', '#dailyMorningBtn'],
      bible: ['#homeBibleBtn', '#dailyBibleBtn'],
      prayer: ['#homePrayerPracticeBtn', '#dailyPrayerBtn'],
      book: ['#homeBookBtn', '#dailyBookBtn'],
      outreachVisit: ['#homeOutreachVisitBtn'],
      smallGroup: ['#homeWeeklySmallGroupBtn'],
      prayerMeeting: ['#homeWeeklyPrayerMeetingBtn'],
      lordDayMeeting: ['#homeWeeklyLordDayBtn']
    };

    Object.keys(cardTargets).forEach((type) => {
      const config =
        PRACTICE_CONFIG[type] ||
        WEEKLY_TASK_CONFIG[type];

      if (!config) {
        return;
      }

      cardTargets[type].forEach((selector) => {
        const card = document.querySelector(selector);

        if (!card) {
          return;
        }

        const title = card.querySelector('strong');
        const reward = card.querySelector('small');

        if (title) {
          title.textContent = config.title;
        }

        if (reward) {
          reward.textContent = config.reward;
        }
      });
    });
  }

  const state = {
    currentPlayer: null,
    sessionToken: '',
    sessionInvalidated: false,
    currentCycleId: '',
    cache: {},
    groups: [],
    dailyRecord: null,
    weeklyTaskRecord: null,
    groupJourney: null,
    homePrayerItems: [],
    homeGroupPosts: [],
    homeGroupMemberCount: 0,
    chestSummary: null,
    messageCenter: createEmptyMessageCenterState_(),
    messageCenterFilter: 'ANNOUNCEMENT',
    selectedMessageKey: '',
    messageCenterAutoOpenedKey: '',
    pendingMessageCenterSuppressions: new Map(),
    messageCenterSuppressionFlushInFlight: new Set(),
    messageCenterSuppressionRetryAttempts: new Map(),
    messageCenterSuppressionRetryTimer: null,
    prayerCarouselItems: [],
    explorePrayerItems: [],
    myPrayerItems: [],
    vitalGroups: [],
    selectedPracticeType: '',
    selectedWeeklyTaskType: '',
    pendingDailyRequestId: '',
    pendingWeeklyRequestId: '',
    pendingPrayerResponseRequestIds: {},
    pendingGroupCreateRequestId: '',
    pendingGroupCreateSignature: '',
    pendingGroupPostCreateRequestId: '',
    pendingGroupPostCreateSignature: '',
    pendingPrayerCreateRequestId: '',
    pendingPrayerCreateSignature: '',
    selectedPrayer: null,
    selectedMyPrayerDetail: null,
    selectedPrayerForEdit: null,
    selectedChestDetail: null,
    pendingConfirm: null,
    registrationAreaOptions: [],
    registerAvatar: null,
    avatarModal: null,
    editingGroupPostId: '',
    prayerTimers: {},
    groupPostTimer: null,
    dismissedCycleAdvancePrompts: {},
    imageLoadQueue: [],
    activeImageLoads: 0,
    imageCache: {},
    businessDate: '',
    homeSyncToken: '',
    homeSyncCheckInFlight: false,
    crossDayRefreshTimer: null,
    homeSyncTimer: null
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    applySavedTheme();
    preloadCriticalBackgrounds_();
    bindEvents();
    initRegisterAvatar();
    hydrateExistingImages_();
    initializeAppLifecycleRefresh_();
    restoreSession();
  }

  function getTaipeiBusinessDate_() {
    return new Date(
      Date.now() + TAIPEI_UTC_OFFSET_MS
    ).toISOString().slice(0, 10);
  }

  function getMillisecondsUntilNextTaipeiMidnight_() {
    const now = Date.now();
    const taipeiNow = new Date(now + TAIPEI_UTC_OFFSET_MS);
    const nextMidnightTaipeiAsUtc = Date.UTC(
      taipeiNow.getUTCFullYear(),
      taipeiNow.getUTCMonth(),
      taipeiNow.getUTCDate() + 1,
      0,
      0,
      0,
      0
    );
    const targetUtc =
      nextMidnightTaipeiAsUtc -
      TAIPEI_UTC_OFFSET_MS;

    return Math.max(
      1000,
      targetUtc - now + 250
    );
  }

  function scheduleNextTaipeiMidnightRefresh_() {
    if (state.crossDayRefreshTimer) {
      window.clearTimeout(state.crossDayRefreshTimer);
    }

    state.crossDayRefreshTimer = window.setTimeout(() => {
      handleBusinessDateBoundary_();
      scheduleNextTaipeiMidnightRefresh_();
    }, getMillisecondsUntilNextTaipeiMidnight_());
  }

  function handleBusinessDateBoundary_() {
    const currentDate = getTaipeiBusinessDate_();
    const previousDate = String(state.businessDate || '');

    if (!previousDate) {
      state.businessDate = currentDate;
      return false;
    }

    if (previousDate === currentDate) {
      return false;
    }

    state.businessDate = currentDate;
    state.homeSyncToken = '';

    /*
     * 跨日後所有前端資料快取立即失效。
     * 不只首頁：每日紀錄、聚會週期、訊息中心與旅程資料都重新以新日期取得。
     */
    clearAllAppCache_();
    state.dailyRecord = createEmptyDailyRecord();
    state.weeklyTaskRecord = createEmptyWeeklyTaskRecord();

    if (
      state.currentPlayer &&
      state.currentPlayer.playerId &&
      state.sessionToken
    ) {
      refreshDashboard(false);
    }

    return true;
  }

  function checkHomeSyncState_() {
    if (
      state.homeSyncCheckInFlight ||
      !state.sessionToken ||
      !state.currentPlayer ||
      !state.currentPlayer.playerId ||
      document.visibilityState === 'hidden'
    ) {
      return;
    }

    state.homeSyncCheckInFlight = true;

    callServer('getHomeSyncState')
      .then((res) => {
        if (!isSuccess(res) || !res.data) {
          return;
        }

        const data = res.data || {};
        const serverBusinessDate = String(
          data.businessDate || ''
        ).trim();

        if (
          serverBusinessDate &&
          serverBusinessDate !==
            String(state.businessDate || '')
        ) {
          state.businessDate = serverBusinessDate;
          state.homeSyncToken = '';
          clearAllAppCache_();
          refreshDashboard(false);
          return;
        }

        const nextToken = String(data.token || '').trim();

        if (!nextToken) {
          return;
        }

        if (!state.homeSyncToken) {
          state.homeSyncToken = nextToken;
          return;
        }

        if (nextToken !== state.homeSyncToken) {
          state.homeSyncToken = nextToken;
          invalidateCache_('dashboard');
          invalidateCaches_([
            'journey',
            'groupJourneyList',
            'contribution',
            'growth',
            'chestSummary',
            'chestCollection',
            'accountProfile'
          ]);
          refreshDashboard(false);
        }
      })
      .catch(() => {})
      .finally(() => {
        state.homeSyncCheckInFlight = false;
      });
  }

  function handleAppResume_() {
    const crossedDate = handleBusinessDateBoundary_();

    if (!crossedDate) {
      checkHomeSyncState_();
    }
  }

  function initializeAppLifecycleRefresh_() {
    state.businessDate = getTaipeiBusinessDate_();

    scheduleNextTaipeiMidnightRefresh_();

    if (state.homeSyncTimer) {
      window.clearInterval(state.homeSyncTimer);
    }

    state.homeSyncTimer = window.setInterval(
      checkHomeSyncState_,
      HOME_SYNC_POLL_MS
    );

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleAppResume_();
      }
    });

    window.addEventListener('pageshow', handleAppResume_);
    window.addEventListener('focus', handleAppResume_);
  }


  function preloadCriticalBackgrounds_() {
    const root = document.documentElement;
    const backgroundAssets = [
      ['--asset-bg-mobile', 'appBgMobile'],
      ['--asset-bg-desktop', 'appBgDesktop'],
      ['--asset-hero-mobile', 'heroMobile'],
      ['--asset-hero-desktop', 'heroDesktop'],
      ['--asset-journey-mobile', 'journeyMobile'],
      ['--asset-journey-desktop', 'journeyDesktop'],
      ['--asset-game-camp', 'gameCamp'],
      ['--asset-game-panel', 'gamePanel'],
      ['--asset-chest-hero', 'chest01Close']
    ];

    backgroundAssets.forEach(([cssVar, key]) => {
      loadManagedImage_(key, IMAGE_ASSETS[key])
        .then((url) => {
          root.style.setProperty(cssVar, 'url("' + url + '")');
        })
        .catch(() => {
          if (key.indexOf('chest') === 0) {
            root.style.setProperty(cssVar, 'url("' + IMAGE_FALLBACK_DATA_URL + '")');
          }
        });
    });
  }

  function hydrateExistingImages_(root) {
    const scope = root || document;

    Array.from(scope.querySelectorAll('img[src], img[data-managed-url]')).forEach((img) => {
      const managedUrl = img.dataset.managedUrl || '';
      const url = managedUrl || img.getAttribute('src') || '';

      if (!url || (!managedUrl && url.indexOf('data:') === 0)) {
        return;
      }

      setManagedImageSource_(img, url, img.dataset.imageKey || url);
    });
  }

  function getChestImageAssetKey_(chestId, isOpen) {
    const match = String(chestId || '').match(/Chest_(\d{2})/);
    const id = match ? match[1] : '01';

    return 'chest' + id + (isOpen ? 'Open' : 'Close');
  }

  function getChestImageUrl_(chest, isOpen) {
    const key = getChestImageAssetKey_(
      chest && chest.chestId,
      !!isOpen
    );
    const configuredUrl = String(chest && chest.imageUrl || '').trim();

    return configuredUrl || IMAGE_ASSETS[key] || IMAGE_FALLBACK_DATA_URL;
  }

  function setManagedImageSource_(img, url, key, options) {
    if (!img || !url) {
      return Promise.resolve('');
    }

    options = options || {};
    const fallbackUrl =
      Object.prototype.hasOwnProperty.call(options, 'fallbackUrl')
        ? options.fallbackUrl
        : IMAGE_FALLBACK_DATA_URL;

    img.classList.add('managed-image-loading');
    img.classList.remove('managed-image-fallback');
    img.removeAttribute('src');

    return loadManagedImage_(key || url, url)
      .then((loadedUrl) => {
        img.src = loadedUrl;
        img.classList.remove('managed-image-loading');
        img.classList.remove('managed-image-fallback');
        return loadedUrl;
      })
      .catch((error) => {
        console.warn('[image-load-failed]', {
          key: key || url,
          url: url,
          retryCount: 2,
          error: error && error.message ? error.message : String(error || '')
        });
        if (typeof options.onFallback === 'function') {
          options.onFallback(error);
        }

        if (fallbackUrl) {
          img.src = fallbackUrl;
        } else {
          img.removeAttribute('src');
        }

        img.classList.remove('managed-image-loading');
        if (fallbackUrl) {
          img.classList.add('managed-image-fallback');
        }
        return fallbackUrl;
      });
  }

  function setAvatarImageSource_(image, placeholder, url, key) {
    if (!image || !placeholder) {
      return;
    }

    url = String(url || '').trim();
    key = String(key || url || '').trim();

    if (!url) {
      image.classList.add('hidden');
      image.removeAttribute('src');
      placeholder.classList.remove('hidden');
      return;
    }

    let retryCount = 0;

    const applySource = () => {
      const targetUrl = buildRetryImageUrl_(url, retryCount);

      image.onload = () => {
        image.classList.remove('hidden');
        placeholder.classList.add('hidden');
      };

      image.onerror = () => {
        if (retryCount < 2) {
          retryCount += 1;
          window.setTimeout(applySource, 350 + retryCount * 220);
          return;
        }

        console.warn('[image-load-failed]', {
          key: key,
          url: url,
          retryCount: retryCount,
          error: 'avatar-load-failed'
        });
        image.classList.add('hidden');
        image.removeAttribute('src');
        placeholder.classList.remove('hidden');
      };

      image.classList.remove('managed-image-loading');
      image.classList.remove('managed-image-fallback');
      image.classList.remove('hidden');
      placeholder.classList.add('hidden');
      image.src = targetUrl;
    };

    applySource();
  }

  function loadManagedImage_(key, url) {
    key = String(key || url || '').trim();
    url = String(url || '').trim();

    if (!url) {
      return Promise.reject(new Error('缺少圖片網址'));
    }

    state.imageCache = state.imageCache || {};

    if (state.imageCache[key] && state.imageCache[key].status === 'loaded') {
      return Promise.resolve(state.imageCache[key].url);
    }

    if (state.imageCache[key] && state.imageCache[key].promise) {
      return state.imageCache[key].promise;
    }

    const promise = enqueueImageLoad_(() => loadImageWithRetry_(key, url, 0))
      .then((loadedUrl) => {
        state.imageCache[key] = {
          status: 'loaded',
          url: loadedUrl
        };

        return loadedUrl;
      })
      .catch((error) => {
        delete state.imageCache[key];
        throw error;
      });

    state.imageCache[key] = {
      status: 'loading',
      promise: promise
    };

    return promise;
  }

  function enqueueImageLoad_(loader) {
    return new Promise((resolve, reject) => {
      state.imageLoadQueue.push({
        loader: loader,
        resolve: resolve,
        reject: reject
      });

      runImageLoadQueue_();
    });
  }

  function runImageLoadQueue_() {
    const maxConcurrent = 5;

    while (
      state.activeImageLoads < maxConcurrent &&
      state.imageLoadQueue.length
    ) {
      const task = state.imageLoadQueue.shift();
      state.activeImageLoads += 1;

      Promise.resolve()
        .then(task.loader)
        .then(task.resolve)
        .catch(task.reject)
        .finally(() => {
          state.activeImageLoads = Math.max(0, state.activeImageLoads - 1);
          runImageLoadQueue_();
        });
    }
  }

  function loadImageWithRetry_(key, url, retryCount) {
    const targetUrl = buildRetryImageUrl_(url, retryCount);

    return loadSingleImage_(targetUrl)
      .catch((error) => {
        if (retryCount >= 2) {
          console.warn('[image-load-failed]', {
            key: key,
            url: url,
            retryCount: retryCount,
            error: error && error.message ? error.message : String(error || '')
          });
          throw error;
        }

        return wait_(350 + retryCount * 220)
          .then(() => loadImageWithRetry_(key, url, retryCount + 1));
      });
  }

  function buildRetryImageUrl_(url, retryCount) {
    if (!retryCount || url.indexOf('data:') === 0) {
      return url;
    }

    const separator = url.indexOf('?') === -1 ? '?' : '&';

    return url + separator + 'v=' + encodeURIComponent(ASSET_VERSION) +
      '&retry=' + retryCount;
  }

  function loadSingleImage_(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const decoded = img.decode ? img.decode() : Promise.resolve();

        decoded
          .catch(() => null)
          .then(() => resolve(url));
      };
      img.onerror = () => reject(new Error('圖片載入失敗'));
      img.src = url;
    });
  }

  function wait_(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function bindEvents() {
    $('#loginForm').addEventListener('submit', handleLogin);
    $('#openRegisterBtn').addEventListener('click', openRegisterModal);
    $('#registerForm').addEventListener('submit', handleRegister);
    $('#registerCareDistrict').addEventListener(
      'change',
      handleRegisterCareDistrictChange
    );
    $('#registerAvatarGender').addEventListener('change', randomizeRegisterAvatar);
    $('#registerPrevAvatarBtn').addEventListener('click', () => stepRegisterAvatar(-1));
    $('#registerRandomAvatarBtn').addEventListener('click', randomizeRegisterAvatar);
    $('#registerNextAvatarBtn').addEventListener('click', () => stepRegisterAvatar(1));

    $('#homeAvatarBtn').addEventListener('click', () => openMessageCenter_({ refresh: true }));
    $('#refreshMessageCenterBtn').addEventListener('click', refreshMessageCenter_);
    $('#messageCenterSelector').addEventListener('change', handleMessageCenterSelectorChange_);
    $('#messageCenterSuppressToday').addEventListener('change', handleMessageCenterSuppressChange_);
    $$('.message-center-tab').forEach((button) => {
      button.addEventListener('click', () => {
        state.messageCenterFilter = button.dataset.messageCenterTab || 'ANNOUNCEMENT';
        state.selectedMessageKey = '';
        renderMessageCenter_();
        markCurrentMessageRead_(false);
      });
    });
    $('#refreshHomeBtn').addEventListener('click', () => {
      invalidateCache_('dashboard');
      refreshDashboard(true);
    });
    $('#logoutBtn').addEventListener('click', openLogoutConfirm);

    $('#goPrayerBtn').addEventListener('click', () => showView('prayer'));
    $('#goMyBtn').addEventListener('click', () => showView('my'));

    $('#openGroupJourneyBtn').addEventListener('click', openGroupJourneyListModal);
    $('#homeJourneyNodes').addEventListener('click', openGroupJourneyListModal);
    $('#openChestCollectionBtn').addEventListener('click', openChestCollectionModal);

    $('#homeMorningBtn').addEventListener('click', () => openPracticeModal('morning'));
    $('#homeBibleBtn').addEventListener('click', () => openPracticeModal('bible'));
    $('#homePrayerPracticeBtn').addEventListener('click', () => openPracticeModal('prayer'));
    $('#homeBookBtn').addEventListener('click', () => openPracticeModal('book'));

    /*
     * 每日操練獨立頁按鈕已不在目前前台版面中。
     * 保留相容綁定：若未來重新加入按鈕才掛上事件，
     * 不可因找不到這四個節點而中斷後續的本週紀錄與關閉視窗事件。
     */
    const dailyPracticeButtons = [
      ['#dailyMorningBtn', 'morning'],
      ['#dailyBibleBtn', 'bible'],
      ['#dailyPrayerBtn', 'prayer'],
      ['#dailyBookBtn', 'book']
    ];

    dailyPracticeButtons.forEach(([selector, type]) => {
      const button = $(selector);

      if (button) {
        button.addEventListener('click', () => openPracticeModal(type));
      }
    });

    $('#practiceSubmitBtn').addEventListener('click', submitPracticeModal);

    /*
     * 本週任務按鈕使用 data-weekly-task 綁定，避免舊版 HTML 的按鈕 id
     * 與新版不完全一致時，造成整個前端事件中斷。
     */
    $$('[data-weekly-task]').forEach((button) => {
      const type = String(button.dataset.weeklyTask || '').trim();

      if (WEEKLY_TASK_CONFIG[type]) {
        button.addEventListener('click', () => openWeeklyTaskModal(type));
      }
    });

    const weeklyTaskSubmitButton = $('#weeklyTaskSubmitBtn');

    if (weeklyTaskSubmitButton) {
      weeklyTaskSubmitButton.addEventListener('click', submitWeeklyTaskModal);
    }

    $('#refreshPrayerBtn').addEventListener('click', () => {
      invalidateCache_('prayerList');
      loadPrayerPage(true);
    });
    $('#openPrayerExploreBtn').addEventListener('click', openPrayerExploreModal);
    $('#openPrayerCreateBtn').addEventListener('click', openPrayerCreateModal);
    $('#openPrayerMineBtn').addEventListener('click', openMyPrayerModal);

    $('#prayerCreateForm').addEventListener('submit', submitPrayerCreate);
    $('#searchPrayerBtn').addEventListener('click', searchPrayerRequests);
    $('#prayerOwnerKeyword').addEventListener('keydown', handlePrayerSearchEnter);
    $('#prayerKeyword').addEventListener('keydown', handlePrayerSearchEnter);

    $('#prayerEditForm').addEventListener('submit', submitPrayerEdit);
    $('#openGroupPostModalBtn').addEventListener('click', openGroupPostModal);
    $('#homeGroupPostForm').addEventListener('submit', submitHomeGroupPost);
    $('#cancelGroupPostEditBtn').addEventListener('click', resetGroupPostEditor);
    $('#myGroupPostList').addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-group-post]');
      const deleteButton = event.target.closest('[data-delete-group-post]');

      if (editButton) {
        startEditGroupPost(editButton.dataset.editGroupPost || '');
        return;
      }

      if (!deleteButton) {
        return;
      }

      deleteMyGroupPost(deleteButton.dataset.deleteGroupPost || '');
    });
    $('#prayerCarousel').addEventListener('click', handleDynamicPrayerOpen);
    $('#prayerExploreList').addEventListener('click', handleDynamicPrayerOpen);
    $('#myPrayerList').addEventListener('click', handleMyPrayerListClick);

    $('#prayerDetailActions').addEventListener('click', handlePrayerDetailAction);
    $('#myPrayerDetailActions').addEventListener('click', handleMyPrayerDetailAction);

    $('#myAvatarBtn').addEventListener('click', openAvatarModal);
    $('#openAvatarBtn').addEventListener('click', openAvatarModal);
    $('#myRefreshBtn').addEventListener('click', refreshMyPage);
    $('#openGrowthModalBtn').addEventListener('click', openGroupContributionModal);
    $('#openPracticeHistoryBtn').addEventListener('click', openAllPracticeHistoryModal);
    $('#openVitalGroupsBtn').addEventListener('click', openVitalGroupsModal);
    $('#openAccountSettingsBtn').addEventListener('click', openAccountSettingsModal);
    $('#openLogoutConfirmBtn').addEventListener('click', openLogoutConfirm);

    $('#avatarGenderSelect').addEventListener('change', randomizeAvatarModal);
    $('#avatarPrevBtn').addEventListener('click', () => stepAvatarModal(-1));
    $('#avatarRandomBtn').addEventListener('click', randomizeAvatarModal);
    $('#avatarNextBtn').addEventListener('click', () => stepAvatarModal(1));
    $('#avatarSaveBtn').addEventListener('click', saveAvatarModal);
    $('#createVitalGroupForm').addEventListener('submit', handleCreateVitalGroup);
    $('#joinVitalGroupForm').addEventListener('submit', handleJoinVitalGroup);
    $('#vitalGroupsList').addEventListener('click', handleVitalGroupListClick);
    $('#accountProfileForm').addEventListener('submit', handleAccountProfile);
    $('#changePasswordForm').addEventListener('submit', handleChangePassword);

    $('#confirmModalSubmitBtn').addEventListener('click', executePendingConfirm);

    $('#navHomeBtn').addEventListener('click', () => showView('home'));
    $('#navPrayerBtn').addEventListener('click', () => showView('prayer'));
    $('#navMyBtn').addEventListener('click', () => showView('my'));

    $$('[data-theme-choice]').forEach((button) => {
      button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
    });

    $$('.modal-close-btn').forEach((button) => {
      button.addEventListener('click', () => closeModal(button.dataset.closeModal));
    });

    $$('.back-view-btn').forEach((button) => {
      button.addEventListener('click', () => showView(button.dataset.view || 'home'));
    });

    $('#infoModalContent').addEventListener('click', handleInfoModalContentClick);
    $('#chestClaimRewardBtn').addEventListener('click', claimSelectedChestReward);
  }

  function restoreSession() {
    const stored = readStoredSession();

    if (!stored.sessionToken) {
      showAuth();
      return;
    }

    /*
     * 舊流程：verifyPlayerSession → showView(home) → getHomeDashboard。
     * 同一個開頁流程連續送出兩次後端請求，且兩次都驗證 Session。
     * 現在直接取得首頁資料；getHomeDashboard 本身已完成 Session 驗證。
     */
    state.sessionToken = stored.sessionToken;
    state.sessionInvalidated = false;

    setLoading(true, '正在載入旅程…');

    loadInitialAppData_()
      .then((res) => {
        if (!isSuccess(res) || !res.data || !res.data.player) {
          clearCurrentSession();
          showAuth();
          setLoading(false);
          return;
        }

        const data = res.data || {};

        enterHomeWithDashboard_(data);
      })
      .catch((error) => {
        clearCurrentSession();
        showInitialLoadError_(getErrorMessage(error));
      });
  }

  function loadInitialAppData_() {
    return callServer('getHomeDashboard');
  }

  function enterHomeWithDashboard_(data) {
    data = data || {};

    state.currentPlayer = data.player;
    state.currentCycleId = data.cycleId ||
      (data.cycle && data.cycle.cycleId) ||
      '';
    persistCurrentPlayer();

    state.homeSyncToken = String(data.syncToken || '').trim();
    state.businessDate = String(
      data.businessDate || getTaipeiBusinessDate_()
    ).trim();

    if (data.taskConfig) {
      applyTaskConfiguration_(data.taskConfig);
    }

    setCache_('dashboard', data);
    showView('home', {
      skipDataLoad: true
    });
    renderDashboardData_(data);
    setLoading(false);
    window.setTimeout(retryPendingMessageCenterSuppression_, 0);
  }

  function showInitialLoadError_(message) {
    const safeMessage = message || '資料載入失敗，請重新整理或稍後再試';

    showAuth();
    setLoadingError_(
      safeMessage,
      '重新載入',
      () => window.location.reload()
    );
  }

  function readStoredSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);

      return {
        sessionToken: String(parsed.sessionToken || '').trim(),
        savedAt: parsed.savedAt || '',
        playerId: parsed.playerId || ''
      };

    } catch (error) {
      return {};
    }
  }

  function showAuth() {
    closeAllModals();
    hideAllViews();
    $('#authView').classList.remove('hidden');
    $('#bottomNav').classList.add('hidden');
  }

  function hideAllViews() {
    [
      'authView',
      'homeView',
      'prayerView',
      'myView'
    ].forEach((id) => {
      $('#' + id).classList.add('hidden');
    });
  }

  function showView(name, options) {
    options = options || {};

    if (!state.currentPlayer || !state.currentPlayer.playerId) {
      showAuth();
      return;
    }

    closeAllModals();
    hideAllViews();

    const viewId = {
      home: 'homeView',
      prayer: 'prayerView',
      my: 'myView'
    }[name] || 'homeView';

    $('#' + viewId).classList.remove('hidden');
    $('#bottomNav').classList.remove('hidden');

    setNavActive(name);
    window.scrollTo(0, 0);

    if (name === 'home' && !options.skipDataLoad) {
      refreshDashboard(true);
    }

    if (name === 'prayer' && !options.skipDataLoad) {
      loadPrayerPage(true);
    }

    if (name === 'my' && !options.skipDataLoad) {
      refreshMyPage();
    }
  }

  function setNavActive(name) {
    const map = {
      home: '#navHomeBtn',
      prayer: '#navPrayerBtn',
      my: '#navMyBtn'
    };

    Object.values(map).forEach((selector) => {
      $(selector).classList.remove('active');
    });

    if (map[name]) {
      $(map[name]).classList.add('active');
    }
  }

  function openModal(id) {
    $('#' + id).classList.remove('hidden');
  }

  function closeModal(id) {
    if (!id) {
      return;
    }

    if (id === 'messageCenterModal') {
      // 先同步保存本機重試資料，並立即啟動非同步後端寫入。
      // GAS JSON API 呼叫本身不阻塞 UI，因此視窗仍會立即關閉；
      // 同時避免 setTimeout 尚未執行就重新整理而漏送請求。
      stagePendingMessageCenterSuppressionForRetry_();
      flushPendingMessageCenterSuppression_();
    }

    $('#' + id).classList.add('hidden');

    if (id === 'confirmModal') {
      state.pendingConfirm = null;
    }
  }

  function closeAllModals() {
    const messageCenterModal = $('#messageCenterModal');
    const shouldFlushMessageCenterSuppression =
      !!messageCenterModal && !messageCenterModal.classList.contains('hidden');

    if (shouldFlushMessageCenterSuppression) {
      stagePendingMessageCenterSuppressionForRetry_();
      flushPendingMessageCenterSuppression_();
    }

    $$('.modal-layer').forEach((modal) => {
      modal.classList.add('hidden');
    });

    state.pendingConfirm = null;
  }

  function handleLogin(event) {
    event.preventDefault();

    const playerName = $('#loginName').value.trim();
    const passwordCode = $('#loginPassword').value.trim();

    if (!playerName || !passwordCode) {
      showAuthMessage(!playerName ? '請輸入登入帳號' : '請輸入登入密碼');
      return;
    }

    setLoading(true, '正在載入旅程…');

    callServer('loginPlayer', playerName, passwordCode)
      .then((res) => {
        if (!isSuccess(res)) {
          setLoading(false);
          showAuthMessage(getResponseError(res, '登入失敗'));
          return null;
        }

        state.sessionToken = String(res.data.sessionToken || '').trim();
        state.sessionInvalidated = false;
        state.currentPlayer = res.data.player;
        persistCurrentPlayer();

        $('#loginPassword').value = '';
        return loadInitialAppData_();
      })
      .then((dashboardRes) => {
        if (!dashboardRes) {
          return;
        }

        if (!isSuccess(dashboardRes) || !dashboardRes.data || !dashboardRes.data.player) {
          clearCurrentSession();
          showAuth();
          showAuthMessage(getResponseError(dashboardRes, '首頁資料讀取失敗'));
          setLoading(false);
          return;
        }

        enterHomeWithDashboard_(dashboardRes.data);

        if (state.currentPlayer && state.currentPlayer.passwordMustChange) {
          openAccountSettingsModal();
          setResultMessage(
            '#accountSettingsMessage',
            '此帳號目前使用臨時密碼，請先修改登入密碼後再繼續操作。'
          );
        }
      })
      .catch((error) => {
        showAuth();
        showAuthMessage(getErrorMessage(error));
        setLoading(false);
      });
  }

  function initRegisterAvatar() {
    state.registerAvatar = buildRandomAvatar('male');
    renderRegisterAvatar();
  }

  function openRegisterModal() {
    $('#registerName').value = '';
    $('#registerLoginName').value = '';
    $('#registerPassword').value = '';
    $('#registerBirthYear').value = '';
    $('#registerAvatarGender').value = 'male';

    state.registrationAreaOptions = [];
    renderRegisterAreaSelectors('', '');

    state.registerAvatar = buildRandomAvatar('male');

    renderRegisterAvatar();
    setResultMessage('#registerMessage', '', false);

    openModal('registerModal');
    loadRegistrationAreaOptions();
  }

  function loadRegistrationAreaOptions() {
    const districtSelect = $('#registerCareDistrict');
    const careAreaSelect = $('#registerCareArea');

    districtSelect.disabled = true;
    careAreaSelect.disabled = true;

    callServer('getRegistrationAreaOptions')
      .then((res) => {
        if (!isSuccess(res)) {
          throw new Error(
            getResponseError(res, '讀取照顧區與大區資料失敗')
          );
        }

        const districts =
          res.data && Array.isArray(res.data.districts)
            ? res.data.districts
            : [];

        if (!districts.length) {
          throw new Error(
            'AreaMappings 沒有可用的照顧區與大區資料'
          );
        }

        state.registrationAreaOptions = districts;
        renderRegisterAreaSelectors('', '');
      })
      .catch((error) => {
        state.registrationAreaOptions = [];
        renderRegisterAreaSelectors('', '');

        setResultMessage(
          '#registerMessage',
          getErrorMessage(error)
        );
      });
  }

  function handleRegisterCareDistrictChange() {
    renderRegisterAreaSelectors(
      $('#registerCareDistrict').value,
      ''
    );
  }

  function renderRegisterAreaSelectors(
    selectedDistrict,
    selectedCareArea
  ) {
    const districtSelect = $('#registerCareDistrict');
    const careAreaSelect = $('#registerCareArea');

    const districts = Array.isArray(state.registrationAreaOptions)
      ? state.registrationAreaOptions
      : [];

    setRegisterSelectOptions(
      districtSelect,
      districts.map((district) => ({
        value: district.careDistrict,
        label: district.careDistrict
      })),
      districts.length
        ? '請選擇照顧區'
        : '讀取照顧區中...',
      selectedDistrict
    );

    districtSelect.disabled = !districts.length;

    const activeDistrict = districts.find((district) => {
      return district.careDistrict === districtSelect.value;
    });

    const careAreas = activeDistrict &&
      Array.isArray(activeDistrict.careAreas)
        ? activeDistrict.careAreas
        : [];

    setRegisterSelectOptions(
      careAreaSelect,
      careAreas.map((area) => ({
        value: area.careArea,
        label: area.careArea
      })),
      activeDistrict
        ? '請選擇大區'
        : '請先選擇照顧區',
      selectedCareArea
    );

    careAreaSelect.disabled = !activeDistrict;
  }

  function setRegisterSelectOptions(
    select,
    options,
    placeholder,
    selectedValue
  ) {
    select.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);

    options.forEach((item) => {
      const option = document.createElement('option');
      option.value = String(item.value || '');
      option.textContent = String(item.label || '');
      select.appendChild(option);
    });

    const value = String(selectedValue || '');
    const exists = options.some((item) => {
      return String(item.value || '') === value;
    });

    select.value = exists ? value : '';
  }



  function randomizeRegisterAvatar() {
    state.registerAvatar = buildRandomAvatar(
      $('#registerAvatarGender').value
    );

    renderRegisterAvatar();
  }

  function stepRegisterAvatar(delta) {
    const gender = $('#registerAvatarGender').value;
    state.registerAvatar = buildSteppedAvatar(
      gender,
      state.registerAvatar && state.registerAvatar.avatarNo,
      delta
    );

    renderRegisterAvatar();
  }

  function renderRegisterAvatar() {
    const avatar = state.registerAvatar;

    if (!avatar) {
      return;
    }

    setManagedImageSource_(
      $('#registerAvatarPreview'),
      avatar.avatarUrl,
      'registerAvatar:' + avatar.avatarGender + ':' + avatar.avatarNo
    );
    $('#registerAvatarInfo').textContent =
      getGenderLabel(avatar.avatarGender) +
      '｜第 ' +
      avatar.avatarNo +
      ' 號';
  }

  function handleRegister(event) {
    event.preventDefault();

    const avatar = state.registerAvatar;
    const birthYearText = $('#registerBirthYear').value.trim();
    const currentYear = new Date().getFullYear();

    const payload = {
      careDistrict: $('#registerCareDistrict').value.trim(),
      careArea: $('#registerCareArea').value.trim(),
      loginName: $('#registerLoginName').value.trim(),
      passwordCode: $('#registerPassword').value.trim(),
      displayName: $('#registerName').value.trim(),
      playerName: $('#registerName').value.trim(),
      birthYear: birthYearText,
      avatarGender: avatar && avatar.avatarGender,
      avatarNo: avatar && avatar.avatarNo
    };

    if (!payload.careDistrict || !payload.careArea) {
      setResultMessage(
        '#registerMessage',
        '請選擇照顧區與大區'
      );
      return;
    }

    if (!payload.loginName) {
      setResultMessage('#registerMessage', '請輸入帳號');
      return;
    }

    if (!/^[A-Za-z0-9]{3,32}$/.test(payload.loginName)) {
      setResultMessage(
        '#registerMessage',
        '帳號限 3 至 32 個英文字母或數字'
      );
      return;
    }

    if (!payload.passwordCode) {
      setResultMessage('#registerMessage', '請輸入密碼');
      return;
    }

    if (
      !payload.displayName ||
      payload.displayName.length < 2 ||
      payload.displayName.length > 20
    ) {
      setResultMessage(
        '#registerMessage',
        '真實姓名需為 2 至 20 個字'
      );
      return;
    }

    if (
      !/^\d{4}$/.test(birthYearText) ||
      Number(birthYearText) < 1900 ||
      Number(birthYearText) > currentYear
    ) {
      setResultMessage(
        '#registerMessage',
        '請輸入正確的出生年份（西元）'
      );
      return;
    }

    setLoading(true, '正在載入旅程…');

    callServer('registerPlayer', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          setLoading(false);
          setResultMessage(
            '#registerMessage',
            getResponseError(res, '註冊失敗')
          );
          return;
        }

        state.sessionToken = String(res.data.sessionToken || '').trim();
        state.sessionInvalidated = false;
        state.currentPlayer = res.data.player;
        persistCurrentPlayer();

        closeModal('registerModal');
        return loadInitialAppData_();
      })
      .then((dashboardRes) => {
        if (!dashboardRes) {
          return;
        }

        if (!isSuccess(dashboardRes) || !dashboardRes.data || !dashboardRes.data.player) {
          clearCurrentSession();
          showAuth();
          setResultMessage(
            '#authMessage',
            getResponseError(dashboardRes, '首頁資料讀取失敗')
          );
          setLoading(false);
          return;
        }

        enterHomeWithDashboard_(dashboardRes.data);

        if (state.currentPlayer && state.currentPlayer.passwordMustChange) {
          openAccountSettingsModal();
          setResultMessage(
            '#accountSettingsMessage',
            '此帳號目前使用臨時密碼，請先修改登入密碼後再繼續操作。'
          );
        }
      })
      .catch((error) => {
        setResultMessage('#registerMessage', getErrorMessage(error));
        setLoading(false);
      });
  }

  function createEmptyMessageCenterState_() {
    return {
      announcements: [],
      specialTasks: [],
      rewardNotifications: [],
      hasBadge: false,
      shouldAutoOpen: false,
      suppressAutoOpenToday: false,
      defaultMessageType: '',
      defaultMessageId: '',
      currentDate: ''
    };
  }

  function normalizeMessageCenterData_(data) {
    const center = Object.assign(createEmptyMessageCenterState_(), data || {});

    center.announcements = Array.isArray(center.announcements)
      ? center.announcements
      : [];
    center.specialTasks = Array.isArray(center.specialTasks)
      ? center.specialTasks
      : [];
    center.rewardNotifications = Array.isArray(center.rewardNotifications)
      ? center.rewardNotifications
      : [];

    return center;
  }

  function applyMessageCenterData_(data, allowAutoOpen) {
    state.messageCenter = normalizeMessageCenterData_(data);

    // 後端背景寫入尚未完成時，先套用本機已確認的「今日不再顯示」。
    // 這可避免使用者關閉訊息後立即重新整理，訊息因後端狀態尚未落盤而再次跳出。
    applyQueuedMessageCenterSuppressionLocally_();
    renderHomeMessageBadge_();

    if (allowAutoOpen) {
      maybeAutoOpenMessageCenter_();
    }
  }

  function renderHomeMessageBadge_() {
    const badge = $('#homeMessageBadge');

    if (!badge) {
      return;
    }

    badge.classList.remove('hidden');
  }

  function maybeAutoOpenMessageCenter_() {
    const center = state.messageCenter || createEmptyMessageCenterState_();

    if (!center.shouldAutoOpen || !center.defaultMessageId) {
      return;
    }

    const defaultMessage = findMessageCenterItem_(
      center.defaultMessageType,
      center.defaultMessageId
    );

    if (!defaultMessage) {
      return;
    }

    const key = buildMessageCenterItemKey_(defaultMessage);

    if (!key || state.messageCenterAutoOpenedKey === key) {
      return;
    }

    state.messageCenterAutoOpenedKey = key;
    state.selectedMessageKey = key;
    state.messageCenterFilter = defaultMessage.messageType || 'ANNOUNCEMENT';
    renderMessageCenter_();
    openModal('messageCenterModal');
    markSelectedMessageRead_(defaultMessage, true);
  }

  function openMessageCenter_(options) {
    options = options || {};

    if (!state.currentPlayer) {
      return;
    }

    if (!options.refresh) {
      selectDefaultMessageCenterItem_();
      renderMessageCenter_();
      openModal('messageCenterModal');
      markCurrentMessageRead_(false);
      return;
    }

    setLoading(true, '更新訊息中心...');

    callServer('getPlayerMessageCenter')
      .then((res) => {
        if (!isSuccess(res)) {
          window.alert(getResponseError(res, '訊息中心讀取失敗'));
          openModal('messageCenterModal');
          return;
        }

        applyMessageCenterData_(res.data, false);
        selectDefaultMessageCenterItem_();
        renderMessageCenter_();
        openModal('messageCenterModal');
        markCurrentMessageRead_(false);
      })
      .catch((error) => {
        window.alert(getErrorMessage(error));
        openModal('messageCenterModal');
      })
      .finally(() => setLoading(false));
  }

  function refreshMessageCenter_() {
    openMessageCenter_({ refresh: true });
  }

  function selectDefaultMessageCenterItem_() {
    const center = state.messageCenter || createEmptyMessageCenterState_();
    const firstAnnouncement = (center.announcements || [])[0] || null;
    const preferred = findMessageCenterItem_(
      center.defaultMessageType,
      center.defaultMessageId
    );
    const fallback = firstAnnouncement ||
      preferred ||
      (center.specialTasks || [])[0] ||
      (center.rewardNotifications || [])[0] ||
      null;

    state.selectedMessageKey = fallback
      ? buildMessageCenterItemKey_(fallback)
      : '';
    state.messageCenterFilter = fallback
      ? fallback.messageType
      : 'ANNOUNCEMENT';
  }

  function getAllMessageCenterItems_() {
    const center = state.messageCenter || createEmptyMessageCenterState_();
    const items = []
      .concat(center.rewardNotifications || [])
      .concat(center.specialTasks || [])
      .concat(center.announcements || []);

    return items.sort((a, b) => {
      const aTime = String(a.updatedAt || a.publishedAt || '');
      const bTime = String(b.updatedAt || b.publishedAt || '');
      return bTime.localeCompare(aTime);
    });
  }

  function getFilteredMessageCenterItems_() {
    const filter = state.messageCenterFilter || 'ANNOUNCEMENT';
    return getAllMessageCenterItems_().filter((item) => {
      return item.messageType === filter;
    });
  }

  function buildMessageCenterItemKey_(message) {
    if (!message) {
      return '';
    }

    return [
      String(message.messageType || ''),
      String(message.messageId || ''),
      String(Number(message.messageVersion || 1))
    ].join('::');
  }

  function findMessageCenterItem_(messageType, messageId) {
    return getAllMessageCenterItems_().find((item) => {
      return String(item.messageType || '') === String(messageType || '') &&
        String(item.messageId || '') === String(messageId || '');
    }) || null;
  }

  function getSelectedMessageCenterItem_() {
    const key = String(state.selectedMessageKey || '');

    if (!key) {
      return null;
    }

    return getAllMessageCenterItems_().find((item) => {
      return buildMessageCenterItemKey_(item) === key;
    }) || null;
  }

  function hasMessageCenterTabAlert_(messageType) {
    const center = state.messageCenter || createEmptyMessageCenterState_();
    const collections = {
      ANNOUNCEMENT: center.announcements || [],
      SPECIAL_TASK: center.specialTasks || [],
      REWARD_NOTIFICATION: center.rewardNotifications || []
    };

    return (collections[messageType] || []).some((message) => {
      if (!message.isRead) {
        return true;
      }

      if (messageType !== 'REWARD_NOTIFICATION') {
        return false;
      }

      return String(message.rewardStatus || '').trim() === 'NOTIFIED';
    });
  }

  function renderMessageCenter_() {
    $$('.message-center-tab').forEach((button) => {
      const messageType = button.dataset.messageCenterTab || 'ANNOUNCEMENT';
      button.classList.toggle(
        'active',
        messageType === state.messageCenterFilter
      );
      button.classList.toggle(
        'has-alert',
        hasMessageCenterTabAlert_(messageType)
      );
    });

    const items = getFilteredMessageCenterItems_();
    const empty = $('#messageCenterEmpty');
    const layout = $('#messageCenterLayout');
    const selectorRow = $('#messageCenterSelectorRow');
    const selector = $('#messageCenterSelector');

    if (!items.length) {
      state.selectedMessageKey = '';
      selector.innerHTML = '';
      selectorRow.classList.add('hidden');
      empty.classList.remove('hidden');
      layout.classList.add('hidden');
      clearMessageCenterDetail_();
      return;
    }

    empty.classList.add('hidden');
    layout.classList.remove('hidden');

    const selected = getSelectedMessageCenterItem_();
    const selectedVisible = selected && items.some((item) => {
      return buildMessageCenterItemKey_(item) === buildMessageCenterItemKey_(selected);
    });

    if (!selectedVisible) {
      state.selectedMessageKey = buildMessageCenterItemKey_(items[0]);
    }

    selector.innerHTML = items.map((item) => {
      const key = buildMessageCenterItemKey_(item);
      const readText = item.isRead ? '已讀' : '未讀';
      const label = [item.title || '未命名訊息', readText]
        .filter(Boolean)
        .join('｜');

      return '<option value="' + escapeHtml(key) + '">' +
        escapeHtml(label) +
        '</option>';
    }).join('');
    selector.value = state.selectedMessageKey;
    selectorRow.classList.toggle('hidden', items.length <= 1);

    renderMessageCenterDetail_(getSelectedMessageCenterItem_());
  }

  function handleMessageCenterSelectorChange_(event) {
    state.selectedMessageKey = event.target.value || '';
    renderMessageCenter_();
    markCurrentMessageRead_(false);
  }

  function renderMessageCenterDetail_(message) {
    if (!message) {
      clearMessageCenterDetail_();
      return;
    }

    renderMessageCenterIcon_($('#messageCenterDetailIcon'), message);

    $('#messageCenterDetailType').textContent = getMessageCenterTypeLabel_(message.messageType);
    $('#messageCenterDetailTitle').textContent = message.title || '未命名訊息';
    $('#messageCenterDetailContent').textContent = message.content || '';

    const rewardBox = $('#messageCenterRewardBox');
    const hasReward = !!String(message.rewardText || '').trim();
    rewardBox.classList.toggle('hidden', !hasReward);
    $('#messageCenterRewardText').textContent = message.rewardText || '';

    const suppressRow = $('#messageCenterSuppressRow');
    const canSuppress = message.messageType === 'ANNOUNCEMENT' ||
      message.messageType === 'SPECIAL_TASK';
    suppressRow.classList.toggle('hidden', !canSuppress);

    const checkbox = $('#messageCenterSuppressToday');
    const suppressionRecord = buildCurrentMessageCenterSuppressionRecord_();
    const suppressionKey = buildMessageCenterSuppressionStorageKey_(suppressionRecord);
    const pendingSuppression =
      state.pendingMessageCenterSuppressions.has(suppressionKey);
    const suppressionInFlight =
      state.messageCenterSuppressionFlushInFlight.has(suppressionKey);
    checkbox.checked = !!state.messageCenter.suppressAutoOpenToday || pendingSuppression;
    checkbox.disabled = !!state.messageCenter.suppressAutoOpenToday || suppressionInFlight;
  }

  function clearMessageCenterDetail_() {
    const icon = $('#messageCenterDetailIcon');
    icon.className = 'message-center-detail-icon';
    icon.innerHTML = '';
    $('#messageCenterDetailType').textContent = '';
    $('#messageCenterDetailTitle').textContent = '';
    $('#messageCenterDetailContent').textContent = '';
    $('#messageCenterRewardBox').classList.add('hidden');
    $('#messageCenterSuppressRow').classList.add('hidden');
  }

  function getMessageCenterTypeLabel_(messageType) {
    const labels = {
      ANNOUNCEMENT: '系統公告',
      SPECIAL_TASK: '特殊任務',
      REWARD_NOTIFICATION: '任務獎勵'
    };

    return labels[messageType] || '訊息';
  }

  function getMessageCenterIconClass_(message) {
    if (!message) {
      return '';
    }

    if (message.iconType === 'completed') {
      return 'is-completed';
    }

    if (message.iconType === 'reward') {
      return 'is-reward';
    }

    return '';
  }

  function getMessageCenterIconAssetKey_(message) {
    if (!message) {
      return '';
    }

    if (message.messageType === 'ANNOUNCEMENT') {
      return 'systemAnnouncement';
    }

    if (message.messageType !== 'SPECIAL_TASK') {
      return '';
    }

    return message.iconType === 'completed'
      ? 'specialTaskCompleted'
      : 'specialTaskInProgress';
  }

  function renderMessageCenterIcon_(container, message) {
    if (!container) {
      return;
    }

    const assetKey = getMessageCenterIconAssetKey_(message);
    container.className = 'message-center-detail-icon ' + getMessageCenterIconClass_(message);
    container.innerHTML = '';

    if (assetKey) {
      container.classList.add('has-image');
      const image = document.createElement('img');
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      container.appendChild(image);
      setManagedImageSource_(image, IMAGE_ASSETS[assetKey], assetKey, {
        fallbackUrl: '',
        onFallback: () => {
          container.classList.remove('has-image');
          container.innerHTML = getMessageCenterIconSvg_(message);
        }
      });
      return;
    }

    container.innerHTML = getMessageCenterIconSvg_(message);
  }

  function getMessageCenterIconSvg_(message) {
    const type = message && message.iconType ? message.iconType : 'announcement';

    if (type === 'completed') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16.5 8.5"></path></svg>';
    }

    if (type === 'reward') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4z"></path><path d="M12 10v10M3 7h18v3H3zM12 7c-3 0-5-1.2-5-3 0-1.2.9-2 2.1-2 1.8 0 2.9 2.2 2.9 5ZM12 7c3 0 5-1.2 5-3 0-1.2-.9-2-2.1-2C13.1 2 12 4.2 12 7Z"></path></svg>';
    }

    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6"></path><circle cx="12" cy="16.5" r="1"></circle></svg>';
  }

  function markCurrentMessageRead_(autoShown) {
    const message = getSelectedMessageCenterItem_();

    if (message) {
      markSelectedMessageRead_(message, autoShown);
    }
  }

  function markSelectedMessageRead_(message, autoShown) {
    if (!message || (message.isRead && !autoShown)) {
      return;
    }

    message.isRead = true;
    message.readAt = message.readAt || new Date().toISOString();

    if (autoShown) {
      message.autoShownAt = message.autoShownAt || new Date().toISOString();
    }

    state.selectedMessageKey = buildMessageCenterItemKey_(message);
    renderMessageCenter_();

    callServer('markPlayerMessageRead', {
      messageType: message.messageType,
      messageId: message.messageId,
      messageVersion: Number(message.messageVersion || 1),
      autoShown: !!autoShown
    })
      .then((res) => {
        if (!isSuccess(res)) {
          console.error(getResponseError(res, '標記訊息已讀失敗'));
        }
      })
      .catch((error) => {
        console.error(getErrorMessage(error));
      });
  }

  function handleMessageCenterSuppressChange_(event) {
    const checkbox = event.currentTarget;
    const message = getSelectedMessageCenterItem_();

    if (!message) {
      checkbox.checked = false;
      return;
    }

    if (
      message.messageType !== 'ANNOUNCEMENT' &&
      message.messageType !== 'SPECIAL_TASK'
    ) {
      checkbox.checked = false;
      return;
    }

    if (state.messageCenter && state.messageCenter.suppressAutoOpenToday) {
      checkbox.checked = true;
      checkbox.disabled = true;
      return;
    }

    const record = buildCurrentMessageCenterSuppressionRecord_();
    const key = buildMessageCenterSuppressionStorageKey_(record);

    if (!record.playerId || !record.suppressDate) {
      checkbox.checked = false;
      return;
    }

    if (state.messageCenterSuppressionFlushInFlight.has(key)) {
      checkbox.checked = true;
      checkbox.disabled = true;
      return;
    }

    if (checkbox.checked) {
      state.pendingMessageCenterSuppressions.set(key, record);
      return;
    }

    state.pendingMessageCenterSuppressions.delete(key);
    state.messageCenterSuppressionRetryAttempts.delete(key);
    removeMessageCenterSuppressionRetry_(record);
  }

  function getMessageSuppressionDateKey_() {
    const centerDate = String(
      state.messageCenter && state.messageCenter.currentDate || ''
    ).trim();

    if (centerDate) {
      return centerDate;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return [year, month, day].join('-');
  }

  function buildCurrentMessageCenterSuppressionRecord_() {
    return {
      scope: 'MESSAGE_CENTER',
      playerId: String(state.currentPlayer && state.currentPlayer.playerId || ''),
      suppressDate: getMessageSuppressionDateKey_()
    };
  }

  function buildMessageCenterSuppressionStorageKey_(record) {
    record = record || {};

    return [
      String(record.playerId || ''),
      'MESSAGE_CENTER',
      String(record.suppressDate || '')
    ].join('::');
  }

  function readMessageCenterSuppressionRetryQueue_() {
    try {
      const raw = localStorage.getItem(MESSAGE_SUPPRESSION_RETRY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      return (Array.isArray(parsed) ? parsed : []).filter((record) => {
        return record && String(record.scope || '') === 'MESSAGE_CENTER';
      });
    } catch (error) {
      return [];
    }
  }

  function writeMessageCenterSuppressionRetryQueue_(records) {
    const unique = new Map();

    (Array.isArray(records) ? records : []).forEach((record) => {
      if (!record || String(record.scope || '') !== 'MESSAGE_CENTER') {
        return;
      }

      const key = buildMessageCenterSuppressionStorageKey_(record);
      if (key) {
        unique.set(key, record);
      }
    });

    try {
      if (!unique.size) {
        localStorage.removeItem(MESSAGE_SUPPRESSION_RETRY_KEY);
        return;
      }

      localStorage.setItem(
        MESSAGE_SUPPRESSION_RETRY_KEY,
        JSON.stringify(Array.from(unique.values()))
      );
    } catch (error) {
      console.error('暫存訊息中心今日不再顯示重試資料失敗', getErrorMessage(error));
    }
  }

  function persistMessageCenterSuppressionRetry_(record) {
    const queue = readMessageCenterSuppressionRetryQueue_();
    queue.push(record);
    writeMessageCenterSuppressionRetryQueue_(queue);
  }

  function stagePendingMessageCenterSuppressionForRetry_() {
    const playerId = String(state.currentPlayer && state.currentPlayer.playerId || '');
    const currentDate = getMessageSuppressionDateKey_();

    if (!playerId || !state.pendingMessageCenterSuppressions.size) {
      return;
    }

    state.pendingMessageCenterSuppressions.forEach((record) => {
      if (
        String(record.playerId || '') === playerId &&
        String(record.suppressDate || '') === currentDate
      ) {
        persistMessageCenterSuppressionRetry_(record);
      }
    });
  }

  function applyQueuedMessageCenterSuppressionLocally_() {
    const playerId = String(state.currentPlayer && state.currentPlayer.playerId || '');
    const center = state.messageCenter || createEmptyMessageCenterState_();
    const currentDate = String(center.currentDate || getMessageSuppressionDateKey_());

    if (!playerId || !currentDate) {
      return;
    }

    const activeQueue = readMessageCenterSuppressionRetryQueue_().filter((record) => {
      return String(record.suppressDate || '') === currentDate;
    });

    // 清除過期日期與舊版「單一訊息 suppression」資料。
    writeMessageCenterSuppressionRetryQueue_(activeQueue);

    const localRecord = activeQueue.find((record) => {
      return String(record.playerId || '') === playerId;
    });

    if (!localRecord) {
      return;
    }

    const key = buildMessageCenterSuppressionStorageKey_(localRecord);

    if (!state.pendingMessageCenterSuppressions.has(key)) {
      state.pendingMessageCenterSuppressions.set(key, localRecord);
    }

    // 「今日不再自動顯示」是整個訊息中心層級，不改動任何訊息的未讀狀態。
    center.suppressAutoOpenToday = true;
    center.shouldAutoOpen = false;
  }

  function removeMessageCenterSuppressionRetry_(record) {
    const targetKey = buildMessageCenterSuppressionStorageKey_(record);
    const queue = readMessageCenterSuppressionRetryQueue_().filter((item) => {
      return buildMessageCenterSuppressionStorageKey_(item) !== targetKey;
    });
    writeMessageCenterSuppressionRetryQueue_(queue);
  }

  function scheduleMessageCenterSuppressionRetry_() {
    if (state.messageCenterSuppressionRetryTimer || !state.sessionToken) {
      return;
    }

    state.messageCenterSuppressionRetryTimer = window.setTimeout(() => {
      state.messageCenterSuppressionRetryTimer = null;
      flushPendingMessageCenterSuppression_();
    }, 5000);
  }

  function retryPendingMessageCenterSuppression_() {
    const playerId = String(state.currentPlayer && state.currentPlayer.playerId || '');
    const currentDate = getMessageSuppressionDateKey_();

    if (!playerId || !state.sessionToken) {
      return;
    }

    const activeQueue = readMessageCenterSuppressionRetryQueue_().filter((record) => {
      return String(record.suppressDate || '') === currentDate;
    });
    writeMessageCenterSuppressionRetryQueue_(activeQueue);

    activeQueue
      .filter((record) => String(record.playerId || '') === playerId)
      .forEach((record) => {
        const key = buildMessageCenterSuppressionStorageKey_(record);

        if (!state.pendingMessageCenterSuppressions.has(key)) {
          state.pendingMessageCenterSuppressions.set(key, record);
        }
      });

    applyQueuedMessageCenterSuppressionLocally_();
    flushPendingMessageCenterSuppression_();
  }

  function markMessageCenterSuppressedLocally_(record) {
    const center = state.messageCenter || createEmptyMessageCenterState_();
    center.suppressAutoOpenToday = true;
    center.shouldAutoOpen = false;
    renderMessageCenter_();
  }

  function flushPendingMessageCenterSuppression_() {
    const playerId = String(state.currentPlayer && state.currentPlayer.playerId || '');
    const currentDate = getMessageSuppressionDateKey_();

    if (!playerId || !state.sessionToken || !state.pendingMessageCenterSuppressions.size) {
      return;
    }

    Array.from(state.pendingMessageCenterSuppressions.entries()).forEach(([key, record]) => {
      if (String(record.suppressDate || '') !== currentDate) {
        state.pendingMessageCenterSuppressions.delete(key);
        removeMessageCenterSuppressionRetry_(record);
        return;
      }

      if (
        String(record.playerId || '') !== playerId ||
        state.messageCenterSuppressionFlushInFlight.has(key)
      ) {
        return;
      }

      const attempts = Number(state.messageCenterSuppressionRetryAttempts.get(key) || 0);

      if (attempts >= 3) {
        return;
      }

      persistMessageCenterSuppressionRetry_(record);
      state.messageCenterSuppressionFlushInFlight.add(key);

      callServer('suppressPlayerMessageToday', {})
        .then((res) => {
          if (!isSuccess(res)) {
            throw new Error(getResponseError(res, '更新訊息中心今日顯示設定失敗'));
          }

          state.pendingMessageCenterSuppressions.delete(key);
          state.messageCenterSuppressionRetryAttempts.delete(key);
          removeMessageCenterSuppressionRetry_(record);
          markMessageCenterSuppressedLocally_(record);
        })
        .catch((error) => {
          const nextAttempts = attempts + 1;
          state.messageCenterSuppressionRetryAttempts.set(key, nextAttempts);
          console.error('背景儲存訊息中心今日不再顯示失敗', getErrorMessage(error));

          if (nextAttempts < 3) {
            scheduleMessageCenterSuppressionRetry_();
          }
        })
        .finally(() => {
          state.messageCenterSuppressionFlushInFlight.delete(key);
        });
    });
  }

  function openAvatarModal() {
    const player = state.currentPlayer || {};

    state.avatarModal = {
      avatarGender: normalizeAvatarGender(player.avatarGender) || 'male',
      avatarNo: Number(player.avatarNo || 0),
      avatarUrl: String(player.avatarUrl || '')
    };

    if (!state.avatarModal.avatarNo || !state.avatarModal.avatarUrl) {
      state.avatarModal = buildRandomAvatar(
        state.avatarModal.avatarGender
      );
    }

    $('#avatarGenderSelect').value = state.avatarModal.avatarGender;
    renderAvatarModal();

    setResultMessage('#avatarModalMessage', '', false);
    openModal('avatarModal');
  }

  function randomizeAvatarModal() {
    state.avatarModal = buildRandomAvatar(
      $('#avatarGenderSelect').value
    );

    renderAvatarModal();
  }

  function stepAvatarModal(delta) {
    const gender = $('#avatarGenderSelect').value;
    state.avatarModal = buildSteppedAvatar(
      gender,
      state.avatarModal && state.avatarModal.avatarNo,
      delta
    );

    renderAvatarModal();
  }

  function renderAvatarModal() {
    const avatar = state.avatarModal;

    setManagedImageSource_(
      $('#avatarModalPreview'),
      avatar.avatarUrl,
      'avatarModal:' + avatar.avatarGender + ':' + avatar.avatarNo
    );
    $('#avatarModalInfo').textContent =
      getGenderLabel(avatar.avatarGender) +
      '｜第 ' +
      avatar.avatarNo +
      ' 號';
  }

  function saveAvatarModal() {
    if (!state.currentPlayer || !state.avatarModal) {
      return;
    }

    setLoading(true, '儲存頭像...');

    callServer('updatePlayerAvatar', {
      playerId: state.currentPlayer.playerId,
      avatarGender: state.avatarModal.avatarGender,
      avatarNo: state.avatarModal.avatarNo
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#avatarModalMessage',
            getResponseError(res, '儲存頭像失敗')
          );
          return;
        }

        state.currentPlayer = res.data.player;
        invalidateByRule_('accountChanged');
        persistCurrentPlayer();

        renderPlayer(state.currentPlayer);
        closeModal('avatarModal');
      })
      .catch((error) => {
        setResultMessage('#avatarModalMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openAccountSettingsModal() {
    const player = state.currentPlayer || {};

    $('#accountDisplayName').value =
      player.displayName || player.playerName || '';
    $('#currentPasswordCode').value = '';
    $('#newPasswordCode').value = '';
    setResultMessage('#accountSettingsMessage', '', false);
    openModal('accountSettingsModal');
  }

  function handleAccountProfile(event) {
    event.preventDefault();

    if (!state.currentPlayer) {
      return;
    }

    const displayName = $('#accountDisplayName').value.trim();

    if (!displayName) {
      setResultMessage('#accountSettingsMessage', '請輸入顯示名稱');
      return;
    }

    setLoading(true, '儲存帳號資料...');

    callServer('updateMyAccount', {
      playerId: state.currentPlayer.playerId,
      displayName: displayName
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#accountSettingsMessage',
            getResponseError(res, '更新帳號資料失敗')
          );
          return;
        }

        state.currentPlayer = res.data.player;
        invalidateByRule_('accountChanged');
        persistCurrentPlayer();
        renderPlayer(state.currentPlayer);
        setResultMessage('#accountSettingsMessage', res.data.message || '帳號資料已更新', true);
      })
      .catch((error) => {
        setResultMessage('#accountSettingsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleChangePassword(event) {
    event.preventDefault();

    if (!state.currentPlayer) {
      return;
    }

    const currentPasswordCode = $('#currentPasswordCode').value.trim();
    const newPasswordCode = $('#newPasswordCode').value.trim();

    if (!currentPasswordCode || !newPasswordCode) {
      setResultMessage('#accountSettingsMessage', '請輸入目前登入密碼與新登入密碼');
      return;
    }

    setLoading(true, '更新登入密碼...');

    callServer('updateMyPassword', {
      playerId: state.currentPlayer.playerId,
      currentPasswordCode: currentPasswordCode,
      newPasswordCode: newPasswordCode
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#accountSettingsMessage',
            getResponseError(res, '更新登入密碼失敗')
          );
          return;
        }

        $('#currentPasswordCode').value = '';
        $('#newPasswordCode').value = '';
        closeModal('accountSettingsModal');
        clearCurrentSession();
        showAuth();
        showAuthMessage(
          (res.data.message || '登入密碼已更新') + '，請重新登入。',
          true
        );
      })
      .catch((error) => {
        setResultMessage('#accountSettingsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openVitalGroupsModal() {
    $('#createVitalGroupName').value = '';
    $('#joinVitalGroupCode').value = '';
    setResultMessage('#vitalGroupsMessage', '', false);
    updateVitalGroupModalState(state.vitalGroups || []);
    openModal('vitalGroupsModal');
    loadVitalGroups();
  }

  function updateVitalGroupModalState(groups) {
    groups = groups || [];
    const hasGroup = groups.length > 0;
    const modal = $('#vitalGroupsModal');
    const title = modal.querySelector('.modal-header h2');
    const infoTitle = modal.querySelector('.confirm-info-card strong');
    const infoText = modal.querySelector('.confirm-info-card p');
    const menuHint = $('#openVitalGroupsBtn small');

    if (title) {
      title.textContent = '活力組管理';
    }

    if (infoTitle) {
      infoTitle.textContent = '活力組';
    }

    if (infoText) {
      infoText.textContent = '一人只能加入一個活力組。';
    }

    if (menuHint) {
      menuHint.textContent = '建立或加入活力組';
    }

    $('#createVitalGroupForm').classList.toggle('hidden', hasGroup);
    $('#joinVitalGroupForm').classList.toggle('hidden', hasGroup);
  }

  function loadVitalGroups() {
    if (!state.currentPlayer) {
      return;
    }

    if (isCacheValid_('groupInfo')) {
      state.vitalGroups = (getCache_('groupInfo') || {}).groups || [];
      renderVitalGroups();
      return;
    }

    $('#vitalGroupsList').innerHTML =
      '<div class="empty-card">讀取活力組中...</div>';

    loadOnce_('groupInfo', () => callServer(
      'getMyVitalGroups',
      state.currentPlayer.playerId
    ))
      .then((res) => {
        if (!isSuccess(res)) {
          $('#vitalGroupsList').innerHTML =
            '<div class="empty-card">' +
            escapeHtml(getResponseError(res, '讀取活力組失敗')) +
            '</div>';
          return;
        }

        state.vitalGroups = res.data.groups || [];
        setCache_('groupInfo', {
          groups: state.vitalGroups
        });
        renderVitalGroups();
      })
      .catch((error) => {
        $('#vitalGroupsList').innerHTML =
          '<div class="empty-card">' +
          escapeHtml(getErrorMessage(error)) +
          '</div>';
      });
  }

  function renderVitalGroups() {
    const groups = state.vitalGroups || [];
    updateVitalGroupModalState(groups);

    if (!groups.length) {
      $('#vitalGroupsList').innerHTML =
        '<div class="empty-card">尚未加入任何活力組。</div>';
      return;
    }

    $('#vitalGroupsList').innerHTML = groups.map((group) => {
      const roleText = group.role === 'owner' ? '建立者' : '成員';
      const members = (group.members || []).map((member) => {
        return escapeHtml(member.playerName || '成員') +
          (member.role === 'owner' ? '（建立者）' : '');
      }).join('、');

      return [
        '<article class="vital-group-card">',
        '<div>',
        '<strong>' + escapeHtml(group.groupName || '活力組') + '</strong>',
        '<p>' + escapeHtml(roleText) + '｜' +
          Number(group.memberCount || 0) + ' 人</p>',
        group.inviteCode
          ? '<span class="invite-code-chip">邀請碼 ' +
            escapeHtml(group.inviteCode) +
            '</span>'
          : '',
        members ? '<small class="member-line">' + members + '</small>' : '',
        '</div>',
        '<div class="vital-group-actions">',
        group.inviteCode
          ? '<button class="mini-outline-btn" type="button" data-action="copy-invite" data-code="' +
            escapeHtml(group.inviteCode) +
            '">複製邀請碼</button>'
          : '',
        '<button class="mini-outline-btn danger-outline-btn" type="button" data-action="leave-group" data-group-id="' +
          escapeHtml(group.groupId) +
          '">離開</button>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function handleCreateVitalGroup(event) {
    event.preventDefault();

    if (!state.currentPlayer) {
      return;
    }

    if ((state.vitalGroups || []).length) {
      setResultMessage('#vitalGroupsMessage', '已加入活力組，不能再建立其他活力組。');
      return;
    }

    const groupName = $('#createVitalGroupName').value.trim();

    if (!groupName) {
      setResultMessage('#vitalGroupsMessage', '請輸入活力組名稱');
      return;
    }

    if (groupName.length < 2 || groupName.length > 10) {
      setResultMessage('#vitalGroupsMessage', '活力組名稱需為 2～10 字');
      return;
    }

    setLoading(true, '建立活力組...');
    state.pendingGroupCreateSignature = groupName;
    state.pendingGroupCreateRequestId = getPendingMutationRequestId_(
      'group-create', groupName
    );

    callServer('createVitalGroup', {
      playerId: state.currentPlayer.playerId,
      groupName: groupName,
      requestId: state.pendingGroupCreateRequestId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          settlePendingMutationRequest_(
            'group-create', state.pendingGroupCreateRequestId, res
          );
          setResultMessage(
            '#vitalGroupsMessage',
            getResponseError(res, '建立活力組失敗')
          );
          return;
        }

        $('#createVitalGroupName').value = '';
        clearPendingMutationRequestId_(
          'group-create', state.pendingGroupCreateRequestId
        );
        state.pendingGroupCreateRequestId = '';
        state.pendingGroupCreateSignature = '';
        invalidateByRule_('groupChanged');
        setResultMessage('#vitalGroupsMessage', res.data.message || '活力組已建立', true);
        loadVitalGroups();
      })
      .catch((error) => {
        setResultMessage('#vitalGroupsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleJoinVitalGroup(event) {
    event.preventDefault();

    if (!state.currentPlayer) {
      return;
    }

    if ((state.vitalGroups || []).length) {
      setResultMessage('#vitalGroupsMessage', '已加入活力組，不能再加入其他活力組。');
      return;
    }

    const inviteCode = $('#joinVitalGroupCode').value.trim();

    if (!inviteCode) {
      setResultMessage('#vitalGroupsMessage', '請輸入邀請碼');
      return;
    }

    setLoading(true, '加入活力組...');

    callServer('joinVitalGroupByInviteCode', {
      playerId: state.currentPlayer.playerId,
      inviteCode: inviteCode
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#vitalGroupsMessage',
            getResponseError(res, '加入活力組失敗')
          );
          return;
        }

        $('#joinVitalGroupCode').value = '';
        invalidateByRule_('groupChanged');
        setResultMessage('#vitalGroupsMessage', res.data.message || '已加入活力組', true);
        loadVitalGroups();
      })
      .catch((error) => {
        setResultMessage('#vitalGroupsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleVitalGroupListClick(event) {
    const button = event.target.closest('[data-action]');

    if (!button || !state.currentPlayer) {
      return;
    }

    const action = button.dataset.action || '';
    const groupId = button.dataset.groupId || '';

    if (action === 'copy-invite') {
      copyInviteCode(button.dataset.code || '');
      return;
    }

    if (!groupId) {
      return;
    }

    if (action === 'leave-group') {
      leaveVitalGroup(groupId);
      return;
    }

    if (action !== 'switch-group') {
      return;
    }

    setLoading(true, '更新活力組...');

    callServer('switchPrimaryVitalGroup', {
      playerId: state.currentPlayer.playerId,
      groupId: groupId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#vitalGroupsMessage',
            getResponseError(res, '切換活力組失敗')
          );
          return;
        }

        state.currentPlayer = res.data.player;
        persistCurrentPlayer();
        renderPlayer(state.currentPlayer);
        invalidateByRule_('groupChanged');
        setResultMessage('#vitalGroupsMessage', res.data.message || '活力組已更新', true);
        loadVitalGroups();
        refreshDashboard(false);
      })
      .catch((error) => {
        setResultMessage('#vitalGroupsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function copyInviteCode(code) {
    if (!code) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setResultMessage('#vitalGroupsMessage', '邀請碼已複製：' + code, true);
        })
        .catch(() => {
          setResultMessage('#vitalGroupsMessage', '邀請碼：' + code, true);
        });
      return;
    }

    setResultMessage('#vitalGroupsMessage', '邀請碼：' + code, true);
  }

  function leaveVitalGroup(groupId) {
    setLoading(true, '離開活力組...');

    callServer('leaveVitalGroup', {
      playerId: state.currentPlayer.playerId,
      groupId: groupId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#vitalGroupsMessage',
            getResponseError(res, '離開活力組失敗')
          );
          return;
        }

        state.currentPlayer = res.data.player;
        persistCurrentPlayer();
        renderPlayer(state.currentPlayer);
        invalidateByRule_('groupChanged');
        setResultMessage('#vitalGroupsMessage', res.data.message || '已離開活力組', true);
        loadVitalGroups();
        refreshDashboard(false);
      })
      .catch((error) => {
        setResultMessage('#vitalGroupsMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function refreshDashboard(showLoading) {
    if (!state.currentPlayer) {
      return;
    }

    if (isCacheValid_('dashboard')) {
      renderDashboardData_(getCache_('dashboard'));
      return;
    }

    if (showLoading) {
      setLoading(true, '讀取首頁資料...');
    }

    loadOnce_('dashboard', () => callServer(
      'getHomeDashboard',
      state.currentPlayer.playerId
    ))
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#homeMessage',
            getResponseError(res, '首頁資料讀取失敗')
          );
          return;
        }

        const data = res.data || {};
        const cycleId = data.cycleId ||
          (data.cycle && data.cycle.cycleId) ||
          state.currentCycleId;

        if (cycleId) {
          state.currentCycleId = cycleId;
        }

        state.homeSyncToken = String(
          data.syncToken || state.homeSyncToken || ''
        ).trim();
        state.businessDate = String(
          data.businessDate || getTaipeiBusinessDate_()
        ).trim();

        setCache_('dashboard', data);

        if (data.taskConfig) {
          applyTaskConfiguration_(data.taskConfig);
        }

        if (data.player) {
          state.currentPlayer = data.player;
          persistCurrentPlayer();
        }

        state.dailyRecord = data.daily && data.daily.record
          ? data.daily.record
          : createEmptyDailyRecord();

        state.weeklyTaskRecord = data.weekly && data.weekly.record
          ? data.weekly.record
          : (
            data.meeting && data.meeting.record
              ? data.meeting.record
              : createEmptyWeeklyTaskRecord()
          );

        state.groupJourney = data.journey && data.journey.group
          ? data.journey.group
          : null;
        state.chestSummary = data.chestSummary || createEmptyChestSummary();
        setCache_('chestSummary', state.chestSummary);
        applyMessageCenterData_(data.messageCenter, true);

        renderPlayer(state.currentPlayer);
        renderHomeChestSummary(state.chestSummary);
        renderDailyStatus();
        renderWeeklyTaskStatus();
        renderGroupJourney(state.groupJourney);

        renderHomeSocial(data.social || {});
        maybePromptCycleAdvance(data.cycleAdvance);
      })
      .catch((error) => {
        setResultMessage('#homeMessage', getErrorMessage(error));
      })
      .finally(() => {
        if (showLoading) {
          setLoading(false);
        }
      });
  }

  function renderDashboardData_(data) {
    data = data || {};

    state.homeSyncToken = String(
      data.syncToken || state.homeSyncToken || ''
    ).trim();
    state.businessDate = String(
      data.businessDate || state.businessDate ||
      getTaipeiBusinessDate_()
    ).trim();

    const cycleId = data.cycleId ||
      (data.cycle && data.cycle.cycleId) ||
      state.currentCycleId;

    if (cycleId) {
      state.currentCycleId = cycleId;
    }

    if (data.taskConfig) {
      applyTaskConfiguration_(data.taskConfig);
    }

    if (data.player) {
      state.currentPlayer = data.player;
      persistCurrentPlayer();
    }

    state.dailyRecord = data.daily && data.daily.record
      ? data.daily.record
      : createEmptyDailyRecord();

    state.weeklyTaskRecord = data.weekly && data.weekly.record
      ? data.weekly.record
      : (
        data.meeting && data.meeting.record
          ? data.meeting.record
          : createEmptyWeeklyTaskRecord()
      );

    state.groupJourney = data.journey && data.journey.group
      ? data.journey.group
      : null;
    state.chestSummary = data.chestSummary || createEmptyChestSummary();
    setCache_('chestSummary', state.chestSummary);
    applyMessageCenterData_(data.messageCenter, true);

    renderPlayer(state.currentPlayer);
    renderHomeChestSummary(state.chestSummary);
    renderDailyStatus();
    renderWeeklyTaskStatus();
    renderGroupJourney(state.groupJourney);

    renderHomeSocial(data.social || {});
    maybePromptCycleAdvance(data.cycleAdvance);
  }

  function maybePromptCycleAdvance(cycleAdvance) {
    cycleAdvance = cycleAdvance || {};

    if (!cycleAdvance.canAdvance) {
      return;
    }

    const promptKey = String(
      cycleAdvance.currentCycleId || state.currentCycleId || ''
    );

    if (!promptKey || state.dismissedCycleAdvancePrompts[promptKey]) {
      return;
    }

    state.dismissedCycleAdvancePrompts[promptKey] = true;

    openConfirmModal({
      title: '進入下一週目',
      heading: '是否進入下一週目？',
      description: cycleAdvance.prompt ||
        '你已完成本週目生命成長旅程，是否進入下一週目？',
      confirmText: '進入下一週目',
      handler: () => advanceToNextCycle(cycleAdvance)
    });
  }

  function advanceToNextCycle(cycleAdvance) {
    cycleAdvance = cycleAdvance || {};
    setLoading(true, '進入下一週目...');

    callServer('advancePlayerCycle', {
      expectedCycleId: cycleAdvance.currentCycleId || state.currentCycleId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          window.alert(getResponseError(res, '進入下一週目失敗'));
          return;
        }

        const data = res.data || {};

        state.currentPlayer = data.player || state.currentPlayer;
        state.currentCycleId = data.cycleId ||
          (data.cycle && data.cycle.cycleId) ||
          state.currentCycleId;
        state.groups = [];
        state.vitalGroups = [];
        state.groupJourney = null;
        clearAllAppCache_();
        persistCurrentPlayer();
        refreshDashboard(true);
      })
      .catch((error) => {
        window.alert(getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function applyRewardSummaryToHome(rewardSummary) {
    const addedScore = Number(
      rewardSummary && rewardSummary.journeyScore
        ? rewardSummary.journeyScore
        : 0
    );

    if (!state.groupJourney || !addedScore) {
      return;
    }

    state.groupJourney = Object.assign({}, state.groupJourney, {
      totalScore: Number(state.groupJourney.totalScore || 0) + addedScore,
      myContributionScore: Number(
        state.currentPlayer && state.currentPlayer.totalScore
          ? state.currentPlayer.totalScore
          : state.groupJourney.myContributionScore || 0
      )
    });

    renderGroupJourney(state.groupJourney);
  }

  function renderPlayer(player) {
    if (!player) {
      return;
    }

    const contribution = Number(player.totalScore || 0);
    const displayName = player.displayName || player.playerName || '活力人';
    const groupSuffix = player.groupName
      ? '（' + player.groupName + '）'
      : '';

    $('#homePlayerName').textContent = displayName + groupSuffix;
    $('#homeGroupName').textContent = '';

    $('#heroGreetingText').textContent = '';

    $('#homeContributionText').textContent = formatNumber(contribution);


    $('#myPlayerName').textContent = displayName;
    $('#myGroupName').textContent = buildHandbookAffiliationText(player);

    $('#homeStreakText').textContent =
      Number(player.dailyStreak || 0) + ' 天';
    renderHomeChestSummary(state.chestSummary || createEmptyChestSummary());

    renderAvatar(player);
  }

  function createEmptyChestSummary() {
    return {
      earnedCount: 0,
      totalCount: 8
    };
  }

  function renderHomeChestSummary(summary) {
    summary = summary || createEmptyChestSummary();

    const earned = Math.max(0, Number(summary.earnedCount || 0));
    const total = Math.max(1, Number(summary.totalCount || 8));
    const target = $('#homeChestCountText');
    const button = $('#openChestCollectionBtn');
    const summaryText = '已獲得 ' + earned + ' / ' + total;

    if (target) {
      target.textContent = summaryText;
      target.dataset.summary = summaryText;
    }

    if (button) {
      button.setAttribute('title', summaryText);
      button.setAttribute('aria-label', '寶藏收藏，' + summaryText);
    }
  }

  function buildHandbookAffiliationText(player) {
    player = player || {};

    const rows = [];

    if (player.careDistrict) {
      rows.push('' + player.careDistrict);
    }

    if (player.careArea) {
      rows.push('' + player.careArea);
    }

    if (player.groupName) {
      rows.push('組名：' + player.groupName);
    }

    return rows.length
      ? rows.join('｜')
      : '尚未設定照顧區、大區或活力組';
  }

  function openChestCollectionModal() {
    closeModal('chestDetailModal');

    openInfoModal(
      '寶藏收藏',
      '<div id="chestCollectionContent" class="treasure-collection-shell"><div class="treasure-loading-card">讀取寶藏收藏中...</div></div>'
    );

    loadOnce_(
      'chestCollection',
      () => callServer('getPlayerChestCollection')
        .then((res) => {
          if (!isSuccess(res)) {
            throw new Error(getResponseError(res, '讀取寶藏收藏失敗'));
          }

          return res.data || {};
        })
    )
      .then((data) => {
        state.chestSummary = {
          earnedCount: data.earnedCount || 0,
          totalCount: data.totalCount || 8
        };

        setCache_('chestSummary', state.chestSummary);
        setCache_(
          'chestSettingsForPlayer',
          Array.isArray(data.chests) ? data.chests : []
        );

        renderHomeChestSummary(state.chestSummary);

        $('#infoModalContent').innerHTML = renderChestCollectionHtml(data);
        hydrateExistingImages_($('#infoModalContent'));
      })
      .catch((error) => {
        $('#infoModalContent').innerHTML =
          '<div class="treasure-collection-shell"><div class="treasure-loading-card">' +
            escapeHtml(getErrorMessage(error)) +
          '</div></div>';
      });
  }

  function renderChestCollectionHtml(data) {
    const chests = data && Array.isArray(data.chests)
      ? data.chests
      : [];

    const earned = Math.max(0, Number(data && data.earnedCount || 0));
    const total = Math.max(1, Number(data && data.totalCount || 8));

    if (!chests.length) {
      return [
        '<div class="treasure-collection-shell">',
        '<div class="treasure-loading-card">目前沒有寶箱設定。</div>',
        '</div>'
      ].join('');
    }

    return [
      '<section class="treasure-collection-shell">',
      '<div class="treasure-summary-card">',
      '<div class="treasure-summary-icon" aria-hidden="true"></div>',
      '<div class="treasure-summary-text">',
      '<span>本週目收藏進度</span>',
      '<strong>已獲得 ' + earned + ' / ' + total + '</strong>',
      '</div>',
      '</div>',
      '<div class="treasure-collection-grid">',

      chests.map((chest) => {
        const hasEarned = !!chest.earned;
        const hasClaimed = !!chest.claimed;
        const chestName = chest.chestName || chest.chestId || '寶箱';
        const detailText =
          chest.displayRewardDescription ||
          chest.rewardDescription ||
          '尚無獎勵說明。';
        const chestStatus = hasEarned
          ? (hasClaimed ? '已領取' : '已獲得')
          : '待取得';
        const chestImage = getChestImageUrl_(chest, hasEarned);

        return [
          '<button ',
          'type="button" ',
          'class="treasure-collection-item ' +
            (hasEarned ? 'earned' : 'locked') + '" ',
          'data-chest-id="' + escapeHtml(chest.chestId || '') + '" ',
          'data-chest-name="' + escapeHtml(chestName) + '" ',
          'data-chest-status="' + escapeHtml(chestStatus) + '" ',
          'data-chest-detail="' + escapeHtml(detailText) + '" ',
          'data-chest-image="' + escapeHtml(chestImage) + '" ',
          'data-chest-claimed="' + (hasClaimed ? '1' : '0') + '" ',
          'data-chest-earned="' + (hasEarned ? '1' : '0') + '">',
          '<div class="treasure-collection-badge">' + chestStatus + '</div>',
          '<img src="' + escapeHtml(IMAGE_FALLBACK_DATA_URL) + '" ',
          'data-image-key="' + escapeHtml(getChestImageAssetKey_(chest.chestId, hasEarned)) + '" ',
          'data-managed-url="' + escapeHtml(chestImage) + '" alt="">',
          '<span>' + escapeHtml(chestName) + '</span>',
          '</button>'
        ].join('');
      }).join(''),

      '</div>',
      '</section>'
    ].join('');
  }

  function handleInfoModalContentClick(event) {
    const chestButton = event.target.closest('[data-chest-detail]');

    if (!chestButton || !$('#infoModalContent').contains(chestButton)) {
      return;
    }

    openChestDetailModal({
      chestId: chestButton.dataset.chestId || '',
      chestName: chestButton.dataset.chestName || '寶箱資訊',
      chestStatus: chestButton.dataset.chestStatus || '待取得',
      chestDetail: chestButton.dataset.chestDetail || '尚無獎勵說明。',
      chestImage: chestButton.dataset.chestImage || '',
      hasEarned: chestButton.dataset.chestEarned === '1',
      hasClaimed: chestButton.dataset.chestClaimed === '1'
    });
  }

  function openChestDetailModal(chest) {
    chest = chest || {};

    const chestName = chest.chestName || '寶箱資訊';
    const chestStatus = chest.chestStatus || '待取得';
    const chestDetail = chest.chestDetail || '尚無獎勵說明。';
    const chestImage = chest.chestImage || '';

    const modal = $('#chestDetailModal');
    const visual = $('#chestDetailModalVisual');
    const image = $('#chestDetailModalImage');
    const status = $('#chestDetailModalStatus');
    const claimButton = $('#chestClaimRewardBtn');

    $('#chestDetailModalTitle').textContent = chestName;
    $('#chestDetailModalName').textContent = chestName;
    $('#chestDetailModalText').textContent = chestDetail;

    status.textContent = chestStatus;
    status.classList.toggle('is-earned', !!chest.hasEarned);
    status.classList.toggle('is-locked', !chest.hasEarned);

    state.selectedChestDetail = {
      chestId: String(chest.chestId || ''),
      hasEarned: !!chest.hasEarned,
      hasClaimed: !!chest.hasClaimed
    };

    if (claimButton) {
      claimButton.disabled = !chest.hasEarned || !!chest.hasClaimed;

      if (!chest.hasEarned) {
        claimButton.textContent = '待取得';
      } else if (chest.hasClaimed) {
        claimButton.textContent = '已領取';
      } else {
        claimButton.textContent = '領取獎勵';
      }
    }

    if (chestImage) {
      image.alt = chestName;
      visual.classList.remove('hidden');
      setManagedImageSource_(
        image,
        chestImage,
        getChestImageAssetKey_(chest.chestId, !!chest.hasEarned)
      );
    } else {
      image.removeAttribute('src');
      image.alt = '';
      visual.classList.add('hidden');
    }

    openModal('chestDetailModal');

    window.setTimeout(() => {
      const closeButton = modal.querySelector('#chestClaimRewardBtn');

      if (closeButton) {
        closeButton.focus();
      }
    }, 0);
  }

  function claimSelectedChestReward() {
    const selected = state.selectedChestDetail || {};
    const chestId = String(selected.chestId || '').trim();
    const button = $('#chestClaimRewardBtn');

    if (!chestId || !selected.hasEarned || selected.hasClaimed) {
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = '領取中...';
    }

    callServer('claimPlayerChestReward', { chestId })
      .then((res) => {
        if (!isSuccess(res)) {
          throw new Error(getResponseError(res, '領取寶箱獎勵失敗'));
        }

        const data = res.data || {};

        if (data.collection) {
          setCache_('chestCollection', data.collection);
          setCache_(
            'chestSettingsForPlayer',
            Array.isArray(data.collection.chests)
              ? data.collection.chests
              : []
          );
          $('#infoModalContent').innerHTML =
            renderChestCollectionHtml(data.collection);
          hydrateExistingImages_($('#infoModalContent'));
        } else {
          invalidateCache_('chestCollection');
          invalidateCache_('chestSettingsForPlayer');
        }

        if (data.chestSummary) {
          state.chestSummary = data.chestSummary;
          setCache_('chestSummary', data.chestSummary);
          renderHomeChestSummary(data.chestSummary);
        } else {
          invalidateCache_('chestSummary');
        }

        invalidateCaches_([
          'dashboard',
          'groupInfo',
          'growth',
          'journey',
          'contribution',
          'accountProfile'
        ]);

        if (data.groupJourney) {
          state.groupJourney = data.groupJourney;

          if (state.currentPlayer) {
            state.currentPlayer = Object.assign({}, state.currentPlayer, {
              totalScore: Number(
                data.groupJourney.myContributionScore ||
                state.currentPlayer.totalScore ||
                0
              )
            });
          }

          setCache_('journey', data.groupJourney);
          renderGroupJourney(state.groupJourney);
        }

        state.selectedChestDetail = Object.assign({}, selected, {
          hasClaimed: true
        });

        if (button) {
          button.textContent = '已領取';
          button.disabled = true;
        }

        $('#chestDetailModalStatus').textContent = '已領取';
      })
      .catch((error) => {
        if (button) {
          button.textContent = '領取獎勵';
          button.disabled = false;
        }

        window.alert(getErrorMessage(error));
      });
  }

  function renderHomeSocial(social) {
    social = social || {};

    const members = social.members || [];
    const posts = social.posts || [];
    state.homeGroupPosts = posts;
    state.homeGroupMemberCount = members.length;

    $('#homeMemberCountText').textContent = members.length;
    $('#homeCampMeta').textContent =
      members.length
        ? '目前 ' + members.length + ' 位成員同行。'
        : '尚未加入活力組。';

    renderHeroAnnouncements(posts);

    $('#homeGroupPosts').innerHTML = posts.length
      ? '<div class="empty-card">公告已顯示在上方旅程看板。</div>'
      : '<div class="empty-card">尚無公告。</div>';
  }

  function renderHeroAnnouncements(posts) {
    const target = $('#homeHeroAnnouncements');
    const rows = (posts || []).slice(0, 5);
    const rowHeight = 34;

    clearHeroAnnouncementTimer();

    if (!target) {
      return;
    }

    target.classList.toggle('is-empty', !rows.length);

    if (!rows.length) {
      target.innerHTML =
        '<em class="hero-announcement-label">小組公告</em>' +
        '<div class="hero-announcement-window">' +
        '<div class="hero-announcement-item"><span>尚無公告</span></div>' +
        '</div>';
      return;
    }

    target.innerHTML = [
      '<em class="hero-announcement-label">小組公告</em>',
      '<div class="hero-announcement-window">',
      '<div class="hero-announcement-track">',
      rows.map((post) => {
        return [
          '<div class="hero-announcement-item">',
          '<strong>' + escapeHtml(post.playerName || '成員') + '</strong>',
          '<span>' + escapeHtml(post.content || '') + '</span>',
          '</div>'
        ].join('');
      }).join(''),
      '</div>',
      '</div>'
    ].join('');

    if (rows.length < 2) {
      return;
    }

    const track = target.querySelector('.hero-announcement-track');
    let index = 0;

    state.groupPostTimer = window.setInterval(() => {
      if (!document.body.contains(target)) {
        clearHeroAnnouncementTimer();
        return;
      }

      index = (index + 1) % rows.length;
      track.style.transform = 'translateY(-' + (index * rowHeight) + 'px)';
    }, 3200);
  }

  function clearHeroAnnouncementTimer() {
    if (state.groupPostTimer) {
      window.clearInterval(state.groupPostTimer);
      state.groupPostTimer = null;
    }
  }

  function openGroupPostModal() {
    if (!ensureGroupFeatureReady()) {
      return;
    }

    resetGroupPostEditor();
    setResultMessage('#groupPostMessage', '', false);
    renderMyGroupPostList();
    openModal('groupPostModal');
  }

  function resetGroupPostEditor() {
    state.editingGroupPostId = '';
    $('#homeGroupPostInput').value = '';
    $('#homeGroupPostSubmitBtn').textContent = '發布公告';
    $('#cancelGroupPostEditBtn').classList.add('hidden');
  }

  function startEditGroupPost(postId) {
    const post = (state.homeGroupPosts || [])
      .find((item) => String(item.postId || '') === String(postId || ''));

    if (!post) {
      setResultMessage('#groupPostMessage', '找不到公告資料');
      return;
    }

    state.editingGroupPostId = String(postId || '');
    $('#homeGroupPostInput').value = post.content || '';
    $('#homeGroupPostSubmitBtn').textContent = '儲存公告';
    $('#cancelGroupPostEditBtn').classList.remove('hidden');
    setResultMessage('#groupPostMessage', '正在編輯公告', true);
  }

  function renderMyGroupPostList() {
    const list = $('#myGroupPostList');
    const rows = (state.homeGroupPosts || []).filter((post) => post.isMine);

    if (!list) {
      return;
    }

    if (!rows.length) {
      list.innerHTML =
        '<div class="empty-card">尚無自己發布的公告。</div>';
      return;
    }

    list.innerHTML = rows.map((post) => {
      return [
        '<article class="group-post-manage-row">',
        '<div>',
        '<strong>' + escapeHtml(post.content || '') + '</strong>',
        '<small>' + escapeHtml(post.createdAt || '') + '</small>',
        '</div>',
        '<div class="group-post-actions">',
        '<button class="mini-outline-btn" type="button" data-edit-group-post="' +
          escapeHtml(post.postId || '') +
          '">編輯</button>',
        '<button class="mini-outline-btn danger-outline-btn" type="button" data-delete-group-post="' +
          escapeHtml(post.postId || '') +
          '">刪除</button>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function submitHomeGroupPost(event) {
    event.preventDefault();

    if (!state.currentPlayer) {
      return;
    }

    if (!ensureGroupFeatureReady('#groupPostMessage')) {
      return;
    }

    const content = $('#homeGroupPostInput').value.trim();

    if (!content) {
      setResultMessage('#groupPostMessage', '請輸入公告內容');
      return;
    }

    if (content.length > 15) {
      setResultMessage('#groupPostMessage', '公告內容最多 15 個中文字');
      return;
    }

    const editingPostId = String(state.editingGroupPostId || '');
    const method = editingPostId ? 'updateGroupPost' : 'createGroupPost';
    if (!editingPostId) {
      state.pendingGroupPostCreateSignature = content;
      state.pendingGroupPostCreateRequestId = getPendingMutationRequestId_(
        'group-post-create', content
      );
    }

    setLoading(true, editingPostId ? '儲存公告...' : '發布公告...');

    callServer(method, {
      playerId: state.currentPlayer.playerId,
      postId: editingPostId,
      postType: 'announcement',
      content: content,
      requestId: editingPostId ? '' : state.pendingGroupPostCreateRequestId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          if (!editingPostId) settlePendingMutationRequest_(
            'group-post-create', state.pendingGroupPostCreateRequestId, res
          );
          setResultMessage(
            '#groupPostMessage',
            getResponseError(res, editingPostId ? '儲存失敗' : '發布失敗')
          );
          return;
        }

        if (editingPostId) {
          state.homeGroupPosts = (state.homeGroupPosts || []).map((post) => {
            if (String(post.postId || '') !== editingPostId) {
              return post;
            }

            return Object.assign({}, post, { content: content });
          });
          resetGroupPostEditor();
          renderMyGroupPostList();
          invalidateByRule_('groupAnnouncementsChanged');
          setResultMessage('#groupPostMessage', res.data.message || '公告已更新', true);
          refreshDashboard(false);
          return;
        }

        resetGroupPostEditor();
        clearPendingMutationRequestId_(
          'group-post-create', state.pendingGroupPostCreateRequestId
        );
        state.pendingGroupPostCreateRequestId = '';
        state.pendingGroupPostCreateSignature = '';
        closeModal('groupPostModal');
        invalidateByRule_('groupAnnouncementsChanged');
        setResultMessage('#myMessage', res.data.message || '已發布', true);
        refreshDashboard(false);
      })
      .catch((error) => {
        setResultMessage('#groupPostMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteMyGroupPost(postId) {
    if (!state.currentPlayer || !postId) {
      return;
    }

    setLoading(true, '刪除公告...');

    if (!ensureGroupFeatureReady('#groupPostMessage')) {
      setLoading(false);
      return;
    }

    callServer('deleteGroupPost', {
      playerId: state.currentPlayer.playerId,
      postId: postId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#groupPostMessage',
            getResponseError(res, '刪除公告失敗')
          );
          return;
        }

        setResultMessage('#groupPostMessage', res.data.message || '公告已刪除', true);
        if (String(state.editingGroupPostId || '') === String(postId)) {
          resetGroupPostEditor();
        }
        invalidateByRule_('groupAnnouncementsChanged');
        refreshDashboard(false);
        state.homeGroupPosts = (state.homeGroupPosts || [])
          .filter((post) => String(post.postId || '') !== String(postId));
        renderMyGroupPostList();
      })
      .catch((error) => {
        setResultMessage('#groupPostMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderAvatar(player) {
    const url = String(player.avatarUrl || '').trim();

    [
      ['#homeAvatarImg', '#homeAvatarPlaceholder'],
      ['#myAvatarImg', '#myAvatarPlaceholder']
    ].forEach(([imageSelector, placeholderSelector]) => {
      const image = $(imageSelector);
      const placeholder = $(placeholderSelector);

      if (url) {
        setAvatarImageSource_(
          image,
          placeholder,
          url,
          'playerAvatar:' + String(player.playerId || '') + ':' + url
        );
      } else {
        image.classList.add('hidden');
        placeholder.classList.remove('hidden');
      }
    });
  }

  function renderGroupJourney(group) {
    const journey = group && group.journey
      ? group.journey
      : {
        totalScore: 0,
        currentChapter: {
          index: 1,
          title: '信心',
          key: 'faith'
        },
        nextChapter: {
          title: '美德'
        },
        scoreToNext: 20000,
        progressPercent: 0,
        isLoveChapter: false
      };

    const current = journey.currentChapter || {
      index: 1,
      title: '信心',
      key: 'faith'
    };

    const currentIndex = Number(current.index || 1);
    const totalScore = group && group.totalScore
      ? group.totalScore
      : journey.totalScore || 0;

    $('#homeJourneyChapterText').textContent = current.title || '信心';

    const homeGroupScore = $('#homeGroupScoreText');

    if (homeGroupScore) {
      homeGroupScore.textContent = formatNumber(totalScore);
    }

    $('#homeJourneyProgressText').textContent =
      Math.max(0, Number(journey.progressPercent || 0)) +
      '%';

    $('#homeJourneyNextText').textContent = journey.isLoveChapter
      ? '愛篇章已展開；同行積分仍持續累積。'
      : '距離' +
        (
          journey.nextChapter && journey.nextChapter.title
            ? '「' + journey.nextChapter.title + '」篇章'
            : '下一篇章'
        ) +
        '還有 ' +
        formatNumber(journey.scoreToNext || 0) +
        ' 點';

    $$('#homeJourneyNodes .journey-node').forEach((node, index) => {
      node.classList.toggle('passed', index + 1 < currentIndex);
      node.classList.toggle('current', index + 1 === currentIndex);
    });
  }

  function openGroupJourneyListModal() {
    if (isCacheValid_('groupJourneyList')) {
      const groups = (getCache_('groupJourneyList') || {}).groups || [];
      const html = [
        '<section class="journey-board-intro">',
        JOURNEY_CHAPTERS.map((chapter, index) => {
          return '<span>' + (index + 1) + ' ' + escapeHtml(chapter.title) + '</span>';
        }).join(''),
        '</section>',
        groups.length
          ? groups.map(renderGroupJourneyRow).join('')
          : '<div class="empty-card">目前沒有已啟用的活力組</div>'
      ].join('');

      openInfoModal('各活力組旅程', html);
      return;
    }

    setLoading(true, '讀取各活力組旅程...');

    loadOnce_('groupJourneyList', () => callServer('getGroupJourneyList'))
      .then((res) => {
        if (!isSuccess(res)) {
          openInfoModal(
            '活力組生命成長旅程',
            '<div class="empty-card">' +
              escapeHtml(getResponseError(res, '讀取失敗')) +
              '</div>'
          );
          return;
        }

        const groups = res.data.groups || [];
        setCache_('groupJourneyList', res.data || {});

        const html = [
          '<section class="journey-board-intro">',
          JOURNEY_CHAPTERS.map((chapter, index) => {
            return '<span>' + (index + 1) + ' ' + escapeHtml(chapter.title) + '</span>';
          }).join(''),
          '</section>',
          groups.length
            ? groups.map(renderGroupJourneyRow).join('')
            : '<div class="empty-card">目前沒有已啟用的活力組</div>'
        ].join('');

        openInfoModal('各活力組旅程', html);
      })
      .catch((error) => {
        openInfoModal(
          '各活力組旅程',
          '<div class="empty-card">' +
            escapeHtml(getErrorMessage(error)) +
            '</div>'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderGroupJourneyRow(group) {
    const current = group.currentChapter ||
      (group.journey && group.journey.currentChapter) ||
      {};

    const score = Number(group.totalScore || 0);
    const percent = Math.max(
      0,
      Math.min(100, Number(group.progressPercent || 0))
    );

    return [
      '<article class="journey-party-card">',
      '<div class="journey-party-rank">' + escapeHtml(current.title || '信心') + '</div>',
      '<div class="journey-party-main">',
      '<strong>' + escapeHtml(group.groupName || '活力組') + '</strong>',
      '<div class="journey-party-meter" aria-hidden="true"><i style="width:' +
        percent +
        '%"></i></div>',
      '<span>同行總積分 ' + formatNumber(score) + ' 點</span>',
      '</div>',
      '<em>' + percent + '%</em>',
      '</article>'
    ].join('');
  }


  function renderDailyStatus() {
    const record = state.dailyRecord || createEmptyDailyRecord();

    const tasks = [
      ['morning', record.morningRevival, '#homeMorningStatus'],
      ['bible', record.bibleReading, '#homeBibleStatus'],
      ['prayer', record.prayer, '#homePrayerPracticeStatus'],
      ['book', record.bookPursuit, '#homeBookStatus']
    ];

    tasks.forEach(([type, value, homeStatus]) => {
      const done = toBool(value);
      const status = $(homeStatus);

      if (status) {
        status.textContent = done ? '已完成' : '未完成';
      }

      const homeButton = $('.quest-card[data-practice="' + type + '"]');

      if (homeButton) {
        homeButton.classList.toggle('done', done);
      }
    });
  }

  function openPracticeModal(type) {
    const config = PRACTICE_CONFIG[type];

    if (!config) {
      return;
    }

    if (!ensureGroupFeatureReady()) {
      return;
    }

    const done = toBool(
      (state.dailyRecord || {})[config.field]
    );

    state.selectedPracticeType = type;

    $('#practiceModalHeading').textContent = config.title;
    $('#practiceModalDescription').textContent = config.description;
    $('#practiceModalReward').textContent = config.reward;
    $('#practiceNote').value = String((state.dailyRecord || {}).note || '');

    $('#practiceSubmitBtn').textContent = done
      ? '今日已完成'
      : '確認完成';

    $('#practiceSubmitBtn').disabled = done;

    setResultMessage(
      '#practiceModalMessage',
      done
        ? '這項任務今天已完成，系統不會重複計入積分。'
        : '',
      false
    );

    openModal('practiceModal');
  }

  function submitPracticeModal() {
    const config = PRACTICE_CONFIG[state.selectedPracticeType];

    if (!config || !state.currentPlayer) {
      return;
    }

    const record = state.dailyRecord || createEmptyDailyRecord();

    const payload = {
      playerId: state.currentPlayer.playerId,
      morningRevival: toBool(record.morningRevival),
      bibleReading: toBool(record.bibleReading),
      prayer: toBool(record.prayer),
      bookPursuit: toBool(record.bookPursuit),
      note: $('#practiceNote').value.trim()
    };

    payload[config.field] = true;
    const pendingDaily = beginPendingMutationRequest_('daily-practice', payload);
    state.pendingDailyRequestId = pendingDaily.requestId;
    payload.requestId = pendingDaily.requestId;

    setLoading(true, '儲存今日任務...');

    callServer('submitDailyPractice', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          settlePendingMutationRequest_('daily-practice', payload.requestId, res);
          setResultMessage(
            '#practiceModalMessage',
            getResponseError(res, '儲存失敗')
          );
          return;
        }

        state.dailyRecord = res.data.record || state.dailyRecord;
        settlePendingMutationRequest_('daily-practice', payload.requestId, res);
        state.pendingDailyRequestId = '';
        invalidateByRule_('dailyPracticeChanged');

        if (res.data.player) {
          state.currentPlayer = res.data.player;
          persistCurrentPlayer();
        }

        renderPlayer(state.currentPlayer);
        renderDailyStatus();
        applyRewardSummaryToHome(res.data.rewardSummary);

        closeModal('practiceModal');
      })
      .catch((error) => {
        setResultMessage('#practiceModalMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderDailyHistoryHtml(records) {
    if (!records.length) {
      return '<div class="empty-card">尚無每日任務紀錄</div>';
    }

    return records.map((record) => {
      const labels = [];

      if (toBool(record.morningRevival)) {
        labels.push(PRACTICE_CONFIG.morning.title);
      }

      if (toBool(record.bibleReading)) {
        labels.push(PRACTICE_CONFIG.bible.title);
      }

      if (toBool(record.prayer)) {
        labels.push(PRACTICE_CONFIG.prayer.title);
      }

      if (toBool(record.bookPursuit)) {
        labels.push(PRACTICE_CONFIG.book.title);
      }

      return [
        '<article class="history-entry">',
        '<strong>' + escapeHtml(record.recordDate || '') + '</strong>',
        '<span>完成：' +
          escapeHtml(labels.join('、') || '尚無項目') +
        '</span>',
        record.note
          ? '<span>備註：' + escapeHtml(record.note) + '</span>'
          : '',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderWeeklyTaskStatus() {
    const record = state.weeklyTaskRecord || createEmptyWeeklyTaskRecord();

    const rows = [
      [
        'outreachVisit',
        record.outreachVisit,
        '#homeOutreachVisitStatus',
        '#homeOutreachVisitBtn'
      ],
      [
        'smallGroup',
        record.smallGroup,
        '#homeWeeklySmallGroupStatus',
        '#homeWeeklySmallGroupBtn'
      ],
      [
        'prayerMeeting',
        record.prayerMeeting,
        '#homeWeeklyPrayerMeetingStatus',
        '#homeWeeklyPrayerMeetingBtn'
      ],
      [
        'lordDayMeeting',
        record.lordDayMeeting,
        '#homeWeeklyLordDayStatus',
        '#homeWeeklyLordDayBtn'
      ]
    ];

    rows.forEach(([type, value, statusSelector, buttonSelector]) => {
      const done = toBool(value);
      const button = $(buttonSelector) ||
        $('[data-weekly-task="' + type + '"]');
      const status = $(statusSelector) ||
        (button ? button.querySelector('em') : null);

      if (status) {
        status.textContent = done ? '已完成' : '未完成';
      }

      if (button) {
        button.classList.toggle('done', done);
      }
    });

    const weeklyDateText = $('#homeWeeklyDateText');

    if (weeklyDateText) {
      weeklyDateText.textContent =
        '日期：' + formatWeeklyTaskDateRange(record.weekKey);
    }
  }

  function openWeeklyTaskModal(type) {
    const config = WEEKLY_TASK_CONFIG[type];

    if (!config) {
      return;
    }

    if (!ensureGroupFeatureReady()) {
      return;
    }

    const done = toBool(
      (state.weeklyTaskRecord || {})[config.field]
    );

    state.selectedWeeklyTaskType = type;

    $('#weeklyTaskModalHeading').textContent = config.title;
    $('#weeklyTaskModalDescription').textContent = config.description;
    $('#weeklyTaskModalReward').textContent = config.reward;
    $('#weeklyTaskNote').value = String((state.weeklyTaskRecord || {}).note || '');

    $('#weeklyTaskSubmitBtn').textContent = done
      ? '本週已完成'
      : '確認完成';

    $('#weeklyTaskSubmitBtn').disabled = done;

    setResultMessage(
      '#weeklyTaskModalMessage',
      done
        ? '這項本週任務已完成，系統不會重複計入積分。'
        : '',
      false
    );

    openModal('weeklyTaskModal');
  }

  function submitWeeklyTaskModal() {
    const config = WEEKLY_TASK_CONFIG[state.selectedWeeklyTaskType];

    if (!config || !state.currentPlayer) {
      return;
    }

    const record = state.weeklyTaskRecord || createEmptyWeeklyTaskRecord();

    const payload = {
      playerId: state.currentPlayer.playerId,
      outreachVisit: toBool(record.outreachVisit),
      smallGroup: toBool(record.smallGroup),
      prayerMeeting: toBool(record.prayerMeeting),
      lordDayMeeting: toBool(record.lordDayMeeting),
      note: $('#weeklyTaskNote').value.trim()
    };

    payload[config.field] = true;
    const pendingMeeting = beginPendingMutationRequest_('meeting-practice', payload);
    state.pendingWeeklyRequestId = pendingMeeting.requestId;
    payload.requestId = pendingMeeting.requestId;

    setLoading(true, '儲存本週任務...');

    callServer('submitMeetingPractice', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          settlePendingMutationRequest_('meeting-practice', payload.requestId, res);
          setResultMessage(
            '#weeklyTaskModalMessage',
            getResponseError(res, '儲存失敗')
          );
          return;
        }

        state.weeklyTaskRecord = res.data.record || state.weeklyTaskRecord;
        settlePendingMutationRequest_('meeting-practice', payload.requestId, res);
        state.pendingWeeklyRequestId = '';
        invalidateByRule_('meetingPracticeChanged');

        if (res.data.player) {
          state.currentPlayer = res.data.player;
          persistCurrentPlayer();
        }

        renderPlayer(state.currentPlayer);
        renderWeeklyTaskStatus();
        applyRewardSummaryToHome(res.data.rewardSummary);

        closeModal('weeklyTaskModal');
      })
      .catch((error) => {
        setResultMessage('#weeklyTaskModalMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderWeeklyTaskHistoryHtml(records) {
    if (!records.length) {
      return '<div class="empty-card">尚無本週任務紀錄</div>';
    }

    return records.map((record) => {
      const labels = [];

      if (toBool(record.outreachVisit)) {
        labels.push(WEEKLY_TASK_CONFIG.outreachVisit.title);
      }

      if (toBool(record.smallGroup)) {
        labels.push(WEEKLY_TASK_CONFIG.smallGroup.title);
      }

      if (toBool(record.prayerMeeting)) {
        labels.push(WEEKLY_TASK_CONFIG.prayerMeeting.title);
      }

      if (toBool(record.lordDayMeeting)) {
        labels.push(WEEKLY_TASK_CONFIG.lordDayMeeting.title);
      }

      return [
        '<article class="history-entry">',
        '<strong>' + escapeHtml(formatWeeklyTaskDateRange(record.weekKey)) + '</strong>',
        '<span>完成：' +
          escapeHtml(labels.join('、') || '尚無項目') +
        '</span>',
        record.note
          ? '<span>備註：' + escapeHtml(record.note) + '</span>'
          : '',
        '</article>'
      ].join('');
    }).join('');
  }

  function loadPrayerPage(showLoading) {
    if (isCacheValid_('prayerList')) {
      const cached = getCache_('prayerList') || {};
      state.prayerCarouselItems = cached.items || [];

      $('#prayerCarouselStatusText').textContent = '';
      renderPrayerCarousel(
        '#prayerCarousel',
        state.prayerCarouselItems,
        'prayer'
      );
      return;
    }

    if (showLoading) {
      setLoading(true, '讀取代禱牆...');
    }

    loadOnce_('prayerList', () => callServer(
      'getPrayerCarousel',
      state.currentPlayer.playerId,
      'prayer'
    ))
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#prayerMessage',
            getResponseError(res, '讀取代禱事項失敗')
          );
          return;
        }

        state.prayerCarouselItems = res.data.items || [];
        setCache_('prayerList', {
          items: state.prayerCarouselItems
        });

        $('#prayerCarouselStatusText').textContent = '';

        renderPrayerCarousel(
          '#prayerCarousel',
          state.prayerCarouselItems,
          'prayer'
        );
      })
      .catch((error) => {
        setResultMessage('#prayerMessage', getErrorMessage(error));
      })
      .finally(() => {
        if (showLoading) {
          setLoading(false);
        }
      });
  }

  function renderPrayerCarousel(selector, items, location) {
  const target = $(selector);

  if (!target) {
    return;
  }

  clearPrayerAutoScroll(selector);

  items = Array.isArray(items) ? items : [];

  const visibleCount = items.length;
  const densityClass = visibleCount === 0
    ? 'is-empty'
    : (visibleCount === 1 ? 'is-single' : 'is-many');

  target.classList.remove('is-empty', 'is-single', 'is-many');
  target.classList.add(densityClass);

  if (!visibleCount) {
    target.innerHTML =
      '<div class="empty-card">目前沒有可見的代禱事項</div>';
    return;
  }

  if (selector === '#prayerCarousel') {
    const pageSize = 4;
    const pages = [];

    for (let index = 0; index < items.length; index += pageSize) {
      pages.push(items.slice(index, index + pageSize));
    }

    target.innerHTML = pages.map((pageItems, pageIndex) => {
      return [
        '<div class="prayer-flip-page ' +
          (pageIndex === 0 ? 'active' : 'standby') +
          '" data-prayer-page="' + pageIndex + '">',

        pageItems.map((request) => {
          return [
            '<button type="button" class="prayer-carousel-card prayer-flip-card"',
            ' data-prayer-open="' + escapeHtml(request.requestId) + '"',
            ' data-prayer-source="' + location + '">',

            '<div class="prayer-inline-line">',
            '<span class="prayer-owner">' +
              escapeHtml(request.ownerDisplayName || '同伴') +
            '</span>',

            '<span class="prayer-date">' +
              escapeHtml(request.createdShortDate || '') +
            '</span>',

            '<strong>★' +
              escapeHtml(request.title || '代禱事項') +
            '</strong>',

            '<span>查看</span>',
            '</div>',
            '</button>'
          ].join('');
        }).join(''),

        '</div>'
      ].join('');
    }).join('');

    setupPrayerAutoScroll(selector);
    return;
  }

  target.innerHTML = items.map((request) => {
    return [
      '<button type="button" class="prayer-carousel-card"',
      ' data-prayer-open="' + escapeHtml(request.requestId) + '"',
      ' data-prayer-source="' + location + '">',

      '<div class="prayer-inline-line">',
      '<span class="prayer-owner">' +
        escapeHtml(request.ownerDisplayName || '同伴') +
      '</span>',

      '<span class="prayer-date">' +
        escapeHtml(request.createdShortDate || '') +
      '</span>',

      '<strong>主題：' +
        escapeHtml(request.title || '代禱事項') +
      '</strong>',

      '<span>查看</span>',
      '</div>',
      '</button>'
    ].join('');
  }).join('');

  setupPrayerAutoScroll(selector);
}

function setupPrayerAutoScroll(selector) {
  const target = $(selector);

  clearPrayerAutoScroll(selector);

  if (!target) {
    return;
  }

  if (selector === '#prayerCarousel') {
    const pages = Array.from(
      target.querySelectorAll('.prayer-flip-page')
    );

    if (pages.length < 2) {
      return;
    }

    const timerState = {
      index: 0,
      isFlipping: false,
      interval: null,
      transitionTimer: null
    };

    timerState.interval = window.setInterval(() => {
      if (!document.body.contains(target)) {
        clearPrayerAutoScroll(selector);
        return;
      }

      if (timerState.isFlipping) {
        return;
      }

      const nextIndex = (timerState.index + 1) % pages.length;

      flipPrayerCarouselPage(
        pages,
        timerState.index,
        nextIndex,
        timerState,
        selector
      );
    }, 4200);

    state.prayerTimers[selector] = timerState;
    return;
  }

  if (target.children.length < 2) {
    return;
  }

  let index = 0;

  state.prayerTimers[selector] = window.setInterval(() => {
    if (!document.body.contains(target)) {
      clearPrayerAutoScroll(selector);
      return;
    }

    index = (index + 1) % target.children.length;

    const child = target.children[index];

    target.scrollTo({
      top: child.offsetTop - target.offsetTop,
      behavior: 'smooth'
    });
  }, selector === '#homePrayerCarousel' ? 3200 : 3800);
}

function flipPrayerCarouselPage(
  pages,
  currentIndex,
  nextIndex,
  timerState,
  selector
) {
  const currentPage = pages[currentIndex];
  const nextPage = pages[nextIndex];

  if (!currentPage || !nextPage) {
    return;
  }

  timerState.isFlipping = true;

  pages.forEach((page) => {
    page.classList.remove(
      'active',
      'standby',
      'incoming',
      'outgoing'
    );
    page.classList.add('standby');
  });

  currentPage.classList.remove('standby');
  currentPage.classList.add('outgoing');

  nextPage.classList.remove('standby');
  nextPage.classList.add('incoming');

  void nextPage.offsetWidth;

  timerState.transitionTimer = window.setTimeout(() => {
    if (!document.body.contains(nextPage)) {
      clearPrayerAutoScroll(selector);
      return;
    }

    pages.forEach((page, pageIndex) => {
      page.classList.remove(
        'active',
        'standby',
        'incoming',
        'outgoing'
      );

      if (pageIndex === nextIndex) {
        page.classList.add('active');
      } else {
        page.classList.add('standby');
      }
    });

    timerState.index = nextIndex;
    timerState.isFlipping = false;
    timerState.transitionTimer = null;
  }, 680);
}

function clearPrayerAutoScroll(selector) {
  const timer = state.prayerTimers[selector];

  if (!timer) {
    return;
  }

  if (typeof timer === 'object') {
    if (timer.interval) {
      window.clearInterval(timer.interval);
    }

    if (timer.transitionTimer) {
      window.clearTimeout(timer.transitionTimer);
    }
  } else {
    window.clearInterval(timer);
  }

  delete state.prayerTimers[selector];
}

  function handleDynamicPrayerOpen(event) {
    const button = event.target.closest('[data-prayer-open]');

    if (!button) {
      return;
    }

    openPrayerDetail(button.dataset.prayerOpen);
  }

  function openPrayerExploreModal() {
    $('#prayerOwnerKeyword').value = '';
    $('#prayerKeyword').value = '';
    $('#prayerVisibilityFilter').value = 'all';
    $('#prayerSortMode').value = 'groupFirst';
    $('#prayerExploreMeta').textContent = '';

    $('#prayerExploreList').innerHTML =
      '<div class="empty-card">讀取代禱事項中...</div>';

    openModal('prayerExploreModal');
    searchPrayerRequests();
  }

  function handlePrayerSearchEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchPrayerRequests();
    }
  }

  function searchPrayerRequests() {
    if (!state.currentPlayer) {
      return;
    }

    const payload = {
      playerId: state.currentPlayer.playerId,
      ownerKeyword: $('#prayerOwnerKeyword').value.trim(),
      keyword: $('#prayerKeyword').value.trim(),
      visibilityFilter: $('#prayerVisibilityFilter').value,
      sortMode: $('#prayerSortMode').value,
      maxResults: 100
    };

    setLoading(true, '搜尋代禱事項...');

    callServer('searchPrayerRequests', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          $('#prayerExploreList').innerHTML =
            '<div class="empty-card">' +
              escapeHtml(getResponseError(res, '搜尋失敗')) +
            '</div>';
          return;
        }

        state.explorePrayerItems = res.data.rows || [];

        $('#prayerExploreMeta').textContent =
          '共 ' +
          Number(res.data.totalCount || 0) +
          ' 筆可見事項';

        $('#prayerExploreList').innerHTML =
          renderPrayerListCards(
            state.explorePrayerItems,
            false
          );
      })
      .catch((error) => {
        $('#prayerExploreList').innerHTML =
          '<div class="empty-card">' +
            escapeHtml(getErrorMessage(error)) +
          '</div>';
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openPrayerCreateModal() {
    if (!ensureGroupFeatureReady()) {
      return;
    }

    $('#prayerTitle').value = '';
    $('#prayerContent').value = '';
    $('#prayerVisibility').value = 'group';

    setResultMessage('#prayerCreateMessage', '', false);
    openModal('prayerCreateModal');
  }

  function submitPrayerCreate(event) {
    event.preventDefault();

    const prayerSignature = [
      $('#prayerTitle').value.trim(),
      $('#prayerContent').value.trim(),
      $('#prayerVisibility').value
    ].join('\u0001');
    state.pendingPrayerCreateSignature = prayerSignature;
    state.pendingPrayerCreateRequestId = getPendingMutationRequestId_(
      'prayer-create', prayerSignature
    );
    const payload = {
      playerId: state.currentPlayer.playerId,
      title: $('#prayerTitle').value.trim(),
      content: $('#prayerContent').value.trim(),
      visibility: $('#prayerVisibility').value,
      requestId: state.pendingPrayerCreateRequestId || createClientRequestId_()
    };
    state.pendingPrayerCreateRequestId = payload.requestId;

    if (!payload.title || !payload.content) {
      setResultMessage(
        '#prayerCreateMessage',
        !payload.title
          ? '請輸入代禱標題'
          : '請輸入代禱內容'
      );
      return;
    }

    if (payload.title.length > 10) {
      setResultMessage('#prayerCreateMessage', '代禱標題最多 10 個字');
      return;
    }

    if (payload.content.length > 100) {
      setResultMessage('#prayerCreateMessage', '代禱內容最多 100 個字');
      return;
    }

    setLoading(true, '發出代禱事項...');

    callServer('createPrayerRequest', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          settlePendingMutationRequest_(
            'prayer-create', state.pendingPrayerCreateRequestId, res
          );
          setResultMessage(
            '#prayerCreateMessage',
            getResponseError(res, '發出失敗')
          );
          return;
        }

        closeModal('prayerCreateModal');
        clearPendingMutationRequestId_(
          'prayer-create', state.pendingPrayerCreateRequestId
        );
        state.pendingPrayerCreateRequestId = '';
        state.pendingPrayerCreateSignature = '';

        invalidateByRule_('prayerContentChanged');
        loadPrayerPage(false);
      })
      .catch((error) => {
        setResultMessage('#prayerCreateMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openMyPrayerModal() {
    $('#myPrayerMeta').textContent = '';

    if (isCacheValid_('myPrayers')) {
      openModal('myPrayerModal');
      loadMyPrayerRequests();
      return;
    }

    $('#myPrayerList').innerHTML =
      '<div class="empty-card">讀取中...</div>';

    openModal('myPrayerModal');
    loadMyPrayerRequests();
  }

  function loadMyPrayerRequests() {
    if (isCacheValid_('myPrayers')) {
      const cached = getCache_('myPrayers') || {};
      state.myPrayerItems = cached.rows || [];
      $('#myPrayerMeta').textContent = cached.metaText || '';
      $('#myPrayerList').innerHTML =
        renderMyPrayerRows(state.myPrayerItems);
      return;
    }

    setLoading(true, '讀取我的代禱事項...');

    loadOnce_('myPrayers', () => callServer(
      'getMyPrayerRequests',
      state.currentPlayer.playerId
    ))
      .then((res) => {
        if (!isSuccess(res)) {
          $('#myPrayerList').innerHTML =
            '<div class="empty-card">' +
              escapeHtml(getResponseError(res, '讀取失敗')) +
            '</div>';
          return;
        }

        state.myPrayerItems = res.data.rows || [];

        $('#myPrayerMeta').textContent =
          '共 ' +
          Number(res.data.totalCount || 0) +
          ' 筆我發出的代禱事項';

        $('#myPrayerList').innerHTML =
          renderMyPrayerRows(state.myPrayerItems);
        setCache_('myPrayers', {
          rows: state.myPrayerItems,
          metaText: $('#myPrayerMeta').textContent
        });
      })
      .catch((error) => {
        $('#myPrayerList').innerHTML =
          '<div class="empty-card">' +
            escapeHtml(getErrorMessage(error)) +
          '</div>';
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderPrayerListCards(items, isMine) {
    if (!items.length) {
      return '<div class="empty-card">' +
        (
          isMine
            ? '目前沒有你發出的代禱事項'
            : '目前沒有符合條件的代禱事項'
        ) +
        '</div>';
    }

    return items.map((request) => {
      const openAttribute = isMine
        ? 'data-my-prayer-open'
        : 'data-prayer-open';

      return [
        '<article class="prayer-list-card game-prayer-row">',
        '<span class="prayer-owner">' +
          escapeHtml(request.ownerDisplayName || '同伴') +
        '</span>',
        '<span class="prayer-date">' +
          escapeHtml(request.createdShortDate || '') +
        '</span>',
        '<h3>★' + escapeHtml(request.title || '') + '</h3>',
        '<button type="button" ' +
          openAttribute +
          '="' +
          escapeHtml(request.requestId || '') +
        '">',
        isMine ? '查看管理' : '查看事項',
        '</button>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderMyPrayerRows(items) {
    if (!items.length) {
      return '<div class="empty-card">目前沒有你發出的代禱事項</div>';
    }

    return items.map((request) => {
      const requestId = escapeHtml(request.requestId || '');
      const dateText = escapeHtml(request.createdShortDate || '');
      const titleText = escapeHtml(request.title || '');
      const prayedCount = Number(request.prayedCount || 0);
      const canEdit = request.canEdit !== false;
      const canClose = request.canClose !== false;

      return [
        '<article class="my-prayer-row">',
        '<span class="my-prayer-date">' + dateText + '</span>',
        '<strong class="my-prayer-title">' + titleText + '</strong>',
        '<span class="my-prayer-count">已代禱 ' +
          prayedCount +
          ' 人</span>',
        '<div class="my-prayer-actions">',
        '<button class="mini-outline-btn" type="button" data-my-prayer-edit="' +
          requestId +
          '"' +
          (canEdit ? '' : ' disabled') +
          '>編輯</button>',
        '<button class="mini-outline-btn danger-outline-btn" type="button" data-my-prayer-close="' +
          requestId +
          '"' +
          (canClose ? '' : ' disabled') +
          '>收回</button>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function handleMyPrayerListClick(event) {
    const editButton = event.target.closest('[data-my-prayer-edit]');

    if (editButton) {
      const request = findMyPrayerById(editButton.dataset.myPrayerEdit);

      if (request) {
        openPrayerEditModal(request);
      }

      return;
    }

    const closeButton = event.target.closest('[data-my-prayer-close]');

    if (closeButton) {
      const request = findMyPrayerById(closeButton.dataset.myPrayerClose);

      if (!request) {
        return;
      }

      openConfirmModal({
        title: '收回代禱',
        heading: '確定要收回這項代禱？',
        description: '收回後，其他人就不會再看到這項代禱。',
        confirmText: '確認收回',
        handler: () => closePrayerRequest(request.requestId)
      });

      return;
    }

    const button = event.target.closest('[data-my-prayer-open]');

    if (!button) {
      return;
    }

    openMyPrayerDetail(button.dataset.myPrayerOpen);
  }

  function findMyPrayerById(requestId) {
    const target = String(requestId || '');

    return (state.myPrayerItems || []).find((item) => {
      return String(item.requestId || '') === target;
    }) || null;
  }

  function openPrayerDetail(requestId) {
    const cachedRequest = findPrayerById(requestId);

    if (!cachedRequest) {
      return;
    }

    state.selectedPrayer = cachedRequest;
    $('#prayerDetailContent').innerHTML =
      '<div class="empty-card">讀取代禱內容中...</div>';
    $('#prayerDetailActions').innerHTML = '';
    setResultMessage('#prayerDetailMessage', '', false);
    openModal('prayerDetailModal');

    callServer('getPrayerRequestDetail', {
      playerId: state.currentPlayer.playerId,
      requestId: requestId
    })
      .then((res) => {
        const request = isSuccess(res) && res.data && res.data.request
          ? res.data.request
          : cachedRequest;

        state.selectedPrayer = request;
        $('#prayerDetailContent').innerHTML =
          renderPrayerDetailHtml(request);

        if (!isSuccess(res)) {
          setResultMessage(
            '#prayerDetailMessage',
            getResponseError(res, '讀取代禱內容失敗')
          );
        }

        renderPrayerDetailActions(request);
      })
      .catch((error) => {
        $('#prayerDetailContent').innerHTML =
          renderPrayerDetailHtml(cachedRequest);
        setResultMessage('#prayerDetailMessage', getErrorMessage(error));
        renderPrayerDetailActions(cachedRequest);
      });
  }

  function renderPrayerDetailActions(request) {
    const actions = [];

    if (request.canRespond) {
      actions.push(
        '<button class="ghost-btn" type="button" data-prayer-action="respond">' +
        '我會為你代禱' +
        '</button>'
      );
    } else if (request.hasWillPrayResponse) {
      actions.push(
        '<button class="ghost-btn is-done" type="button" disabled>已代禱</button>'
      );
    }

    if (!actions.length) {
      actions.push(
        '<div class="empty-card">目前沒有可執行的動作</div>'
      );
    }

    $('#prayerDetailActions').innerHTML = actions.join('');
  }

  function openPrayerDetailCached_(requestId) {
    const request = findPrayerById(requestId);

    if (!request) {
      return;
    }

    state.selectedPrayer = request;

    $('#prayerDetailContent').innerHTML =
      renderPrayerDetailHtml(request);

    const actions = [];

    if (request.canRespond) {
      actions.push(
        '<button class="ghost-btn" type="button" data-prayer-action="respond">' +
        '我會為你代禱' +
        '</button>'
      );
    } else if (request.hasWillPrayResponse) {
      actions.push(
        '<button class="ghost-btn is-done" type="button" disabled>已代禱</button>'
      );
    }

    if (!actions.length) {
      actions.push(
        '<div class="empty-card">目前沒有可進行的代禱操作。</div>'
      );
    }

    $('#prayerDetailActions').innerHTML = actions.join('');

    setResultMessage('#prayerDetailMessage', '', false);

    openModal('prayerDetailModal');
  }

  function renderPrayerDetailHtml(request) {
    return [
      '<section class="prayer-detail-card">',
      '<div class="prayer-detail-field">',
      '<span>主題</span>',
      '<strong>' + escapeHtml(request.title || '') + '</strong>',
      '</div>',
      '<div class="prayer-detail-field">',
      '<span>發起者</span>',
      '<strong>' +
        escapeHtml(request.ownerDisplayName || '同伴') +
      '</strong>',
      '</div>',
      request.groupName
        ? '<div class="prayer-detail-field"><span>活力組</span><strong>' +
            escapeHtml(request.groupName || '') +
          '</strong></div>'
        : '',
      '<div class="prayer-detail-field prayer-detail-body">',
      '<span>內容</span>',
      '<p>' + escapeHtml(request.content || '') + '</p>',
      '</div>',
      '<div class="prayer-detail-meta">',
      '<span class="info-chip">已代禱 ' +
        Number(request.responseCount || 0) +
        ' 人</span>',
      '</div>',
      '</section>'
    ].join('');
  }

  function handlePrayerDetailAction(event) {
    const button = event.target.closest('[data-prayer-action]');

    if (!button || !state.selectedPrayer) {
      return;
    }

    const requestId = state.selectedPrayer.requestId;

    if (button.dataset.prayerAction === 'respond') {
      openConfirmModal({
        title: '代禱',
        heading: '我會為你代禱',
        description: '確定要為這件事代禱嗎？',
        confirmText: '確認代禱',
        handler: () => respondPrayerRequest(requestId)
      });
    }

  }

  function respondPrayerRequest(requestId) {
    if (!ensureGroupFeatureReady('#prayerDetailMessage')) {
      return;
    }

    setLoading(true, '送出代禱...');

    const responsePayload = {
      requestId: requestId,
      responderId: state.currentPlayer.playerId
    };
    const pendingResponse = beginPendingMutationRequest_(
      'prayer-response:' + requestId, responsePayload
    );
    state.pendingPrayerResponseRequestIds[requestId] = pendingResponse.requestId;
    responsePayload.submissionRequestId = pendingResponse.requestId;
    callServer('respondPrayerRequest', responsePayload)
      .then((res) => {
        if (settlePendingMutationRequest_(
            'prayer-response:' + requestId, pendingResponse.requestId, res)) {
          delete state.pendingPrayerResponseRequestIds[requestId];
        }
        handlePrayerRespondResult(res, '代禱完成');
      })
      .catch((error) => {
        setResultMessage('#prayerDetailMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handlePrayerActionResult(res, fallback) {
    if (!isSuccess(res)) {
      setResultMessage(
        '#prayerDetailMessage',
        getResponseError(res, fallback + '失敗')
      );
      return;
    }

    closeModal('prayerDetailModal');

    invalidateByRule_('prayerResponseChanged');
    loadPrayerPage(false);
    refreshDashboard(false);
  }

  function handlePrayerRespondResult(res, fallback) {
    if (!isSuccess(res)) {
      setResultMessage(
        '#prayerDetailMessage',
        getResponseError(res, fallback + '失敗')
      );
      return;
    }

    if (state.selectedPrayer) {
      state.selectedPrayer = Object.assign({}, state.selectedPrayer, {
        canRespond: false,
        hasWillPrayResponse: true,
        responseCount: Number(state.selectedPrayer.responseCount || 0) + 1
      });
      $('#prayerDetailContent').innerHTML =
        renderPrayerDetailHtml(state.selectedPrayer);
      renderPrayerDetailActions(state.selectedPrayer);
    }

    setResultMessage('#prayerDetailMessage', '', false);
    invalidateByRule_('prayerResponseChanged');
    loadPrayerPage(false);
    refreshDashboard(false);
  }

  function openMyPrayerDetail(requestId) {
    setLoading(true, '讀取代禱管理資料...');

    callServer('getMyPrayerRequestDetail', {
      playerId: state.currentPlayer.playerId,
      requestId: requestId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#myPrayerDetailMessage',
            getResponseError(res, '讀取失敗')
          );
          return;
        }

        state.selectedMyPrayerDetail = res.data;

        renderMyPrayerDetail(res.data);
        openModal('myPrayerDetailModal');
      })
      .catch((error) => {
        setResultMessage('#myPrayerDetailMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function renderMyPrayerDetail(data) {
    const request = data.request || {};

    $('#myPrayerDetailContent').innerHTML = [
      renderPrayerDetailHtml(request)
    ].join('');

    const actions = [];

    if (request.canEdit) {
      actions.push(
        '<button class="ghost-btn" type="button" data-my-prayer-action="edit">' +
        '編輯代禱內容' +
        '</button>'
      );
    }

    if (request.canClose) {
      actions.push(
        '<button class="primary-btn" type="button" data-my-prayer-action="close">' +
        '關閉代禱事項' +
        '</button>'
      );
    }

    if (!actions.length) {
      actions.push(
        '<div class="empty-card">此事項目前沒有可管理的操作。</div>'
      );
    }

    $('#myPrayerDetailActions').innerHTML = actions.join('');
    setResultMessage('#myPrayerDetailMessage', '', false);
  }

  function handleMyPrayerDetailAction(event) {
    const button = event.target.closest('[data-my-prayer-action]');
    const detail = state.selectedMyPrayerDetail;

    if (!button || !detail || !detail.request) {
      return;
    }

    const request = detail.request;
    const action = button.dataset.myPrayerAction;

    if (action === 'edit') {
      openPrayerEditModal(request);
    }

    if (action === 'close') {
      openConfirmModal({
        title: '關閉代禱事項',
        heading: '確定要關閉這筆代禱事項嗎？',
        description: '關閉後將不再接受新的代禱。',
        confirmText: '確認關閉',
        handler: () => closePrayerRequest(request.requestId)
      });
    }
  }

  function openPrayerEditModal(request) {
    state.selectedPrayerForEdit = request;

    $('#prayerEditTitle').value = request.title || '';
    $('#prayerEditContent').value = request.content || '';
    $('#prayerEditVisibility').value =
      ['group', 'public'].includes(request.visibility)
        ? request.visibility
        : 'group';

    setResultMessage('#prayerEditMessage', '', false);
    openModal('prayerEditModal');
  }

  function submitPrayerEdit(event) {
    event.preventDefault();

    const request = state.selectedPrayerForEdit;

    if (!request) {
      return;
    }

    if (!ensureGroupFeatureReady('#prayerEditMessage')) {
      return;
    }

    const payload = {
      playerId: state.currentPlayer.playerId,
      requestId: request.requestId,
      title: $('#prayerEditTitle').value.trim(),
      content: $('#prayerEditContent').value.trim(),
      visibility: $('#prayerEditVisibility').value
    };

    if (!payload.title || !payload.content) {
      setResultMessage(
        '#prayerEditMessage',
        !payload.title
          ? '請輸入代禱主題'
          : '請輸入代禱內容'
      );
      return;
    }

    if (payload.title.length > 10) {
      setResultMessage('#prayerEditMessage', '代禱主題最多 10 個字');
      return;
    }

    if (payload.content.length > 100) {
      setResultMessage('#prayerEditMessage', '代禱內容最多 100 個字');
      return;
    }

    setLoading(true, '儲存代禱內容...');

    callServer('updatePrayerRequest', payload)
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#prayerEditMessage',
            getResponseError(res, '儲存失敗')
          );
          return;
        }

        closeModal('prayerEditModal');
        invalidateByRule_('prayerContentChanged');
        openMyPrayerDetail(request.requestId);
        loadMyPrayerRequests();
        loadPrayerPage(false);
      })
      .catch((error) => {
        setResultMessage('#prayerEditMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function closePrayerRequest(requestId) {
    if (!ensureGroupFeatureReady('#myPrayerDetailMessage')) {
      return;
    }

    setLoading(true, '關閉代禱事項...');

    callServer('closePrayerRequest', {
      requestId: requestId,
      playerId: state.currentPlayer.playerId
    })
      .then((res) => {
        if (!isSuccess(res)) {
          setResultMessage(
            '#myPrayerDetailMessage',
            getResponseError(res, '關閉失敗')
          );
          return;
        }

        closeModal('myPrayerDetailModal');

        invalidateByRule_('prayerContentChanged');
        loadMyPrayerRequests();
        loadPrayerPage(false);
      })
      .catch((error) => {
        setResultMessage('#myPrayerDetailMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function findPrayerById(requestId) {
    const target = String(requestId || '');

    return []
      .concat(
        state.homePrayerItems,
        state.prayerCarouselItems,
        state.explorePrayerItems,
        state.myPrayerItems
      )
      .find((item) => {
        return String(item.requestId || '') === target;
      }) || null;
  }

  function refreshMyPage() {
    if (isCacheValid_('accountProfile') && isCacheValid_('journey')) {
      const profileData = getCache_('accountProfile') || {};
      const journeyData = getCache_('journey') || null;

      if (profileData.player) {
        state.currentPlayer = profileData.player;
        persistCurrentPlayer();
        renderPlayer(state.currentPlayer);
      }

      state.groupJourney = journeyData;
      renderGroupJourney(state.groupJourney);
      return;
    }

    setLoading(true, '更新我的同行手冊...');

    const profilePromise = isCacheValid_('accountProfile')
      ? Promise.resolve({
        success: true,
        data: getCache_('accountProfile') || {}
      })
      : loadOnce_('accountProfile', () => callServer(
        'getPlayerProfile',
        state.currentPlayer.playerId
      ));

    const journeyPromise = isCacheValid_('journey')
      ? Promise.resolve({
        success: true,
        data: getCache_('journey') || {}
      })
      : loadOnce_('journey', () => callServer(
        'getGroupJourney',
        state.currentPlayer.playerId
      ));

    Promise.all([profilePromise, journeyPromise])
      .then(([playerRes, journeyRes]) => {
        if (isSuccess(playerRes)) {
          state.currentPlayer = playerRes.data.player;
          setCache_('accountProfile', playerRes.data || {});
          persistCurrentPlayer();
          renderPlayer(state.currentPlayer);
        }

        if (isSuccess(journeyRes)) {
          state.groupJourney = journeyRes.data;
          setCache_('journey', state.groupJourney);
          renderGroupJourney(state.groupJourney);
        }
      })
      .catch((error) => {
        setResultMessage('#myMessage', getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function refreshProfileOnly() {
    if (!state.currentPlayer) {
      return Promise.resolve();
    }

    if (isCacheValid_('accountProfile')) {
      const cached = getCache_('accountProfile') || {};

      if (cached.player) {
        state.currentPlayer = cached.player;
        persistCurrentPlayer();
        renderPlayer(state.currentPlayer);
      }

      return Promise.resolve({
        success: true,
        data: cached
      });
    }

    return loadOnce_('accountProfile', () => callServer(
      'getPlayerProfile',
      state.currentPlayer.playerId
    ))
      .then((res) => {
        if (isSuccess(res)) {
          state.currentPlayer = res.data.player;
          setCache_('accountProfile', res.data || {});
          persistCurrentPlayer();
          renderPlayer(state.currentPlayer);
        }

        return res;
      });
  }

  function openGroupContributionModal() {
    if (
      state.currentPlayer &&
      state.currentPlayer.playerId &&
      isCacheValid_('contribution')
    ) {
      openInfoModal(
        '同行貢獻',
        buildGroupContributionModalHtml(getCache_('contribution') || {})
      );
      hydrateExistingImages_($('#infoModalContent'));
      return;
    }

    if (!state.currentPlayer || !state.currentPlayer.playerId) {
      openInfoModal(
        '同行貢獻',
        '<div class="empty-card">找不到目前登入的玩家資料。</div>'
      );
      return;
    }

    setLoading(true, '讀取活力組貢獻...');

    loadOnce_('contribution', () => callServer(
      'getMyGroupContributionSummary',
      state.currentPlayer.playerId
    ))
      .then((res) => {
        if (!isSuccess(res)) {
          throw new Error(
            getResponseError(res, '讀取活力組貢獻失敗')
          );
        }

        setCache_('contribution', res.data || {});
        openInfoModal(
          '同行貢獻',
          buildGroupContributionModalHtml(res.data || {})
        );
        hydrateExistingImages_($('#infoModalContent'));
      })
      .catch((error) => {
        openInfoModal(
          '同行貢獻',
          '<div class="empty-card">' +
            escapeHtml(getErrorMessage(error)) +
          '</div>'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function buildGroupContributionModalHtml(data) {
    data = data || {};

    const members = Array.isArray(data.members)
      ? data.members
      : [];

    const groupName = String(data.groupName || '未命名活力組');
    const memberCount = Number(data.memberCount || members.length || 0);

    const summaryHtml = [
      '<section class="group-contribution-summary">',
      '<span>活力組總點數</span>',
      '<strong>',
      formatNumber(data.totalScore),
      '<small>點</small>',
      '</strong>',
      '<p>',
      escapeHtml(groupName),
      '｜',
      formatNumber(memberCount),
      ' 位組員',
      '</p>',
      '<div class="group-contribution-breakdown">',
      '<span>合作取得 <strong>' + formatNumber(data.cooperativeScore) + '</strong> 點</span>',
      '<span>個人貢獻 <strong>' + formatNumber(data.personalContributionTotal) + '</strong> 點</span>',
      '</div>',
      '</section>'
    ].join('');

    if (!members.length) {
      return summaryHtml +
        '<div class="empty-card">目前沒有可顯示的活力組員。</div>';
    }

    const memberRows = members.map((member) => {
      const isMe = !!member.isMe;
      const name = String(member.displayName || member.playerName || '活力人');

      return [
        '<article class="group-contribution-member',
        isMe ? ' is-me' : '',
        '">',
        buildContributionMemberAvatarHtml(member),
        '<div class="group-contribution-member-name">',
        '<strong>',
        escapeHtml(name),
        '</strong>',
        isMe ? '<small>我</small>' : '',
        '</div>',
        '<div class="group-contribution-member-score">',
        '<strong>',
        formatNumber(member.contributionScore),
        '</strong>',
        '<span>點</span>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');

    return [
      summaryHtml,
      '<section class="group-contribution-section">',
      '<div class="group-contribution-list-head">',
      '<h3>個人貢獻</h3>',
      '<span>依點數排序</span>',
      '</div>',
      '<div class="group-contribution-list">',
      memberRows,
      '</div>',
      '</section>'
    ].join('');
  }

  function buildContributionMemberAvatarHtml(member) {
    member = member || {};

    const avatarUrl = String(member.avatarUrl || '').trim();
    const name = String(member.displayName || member.playerName || '活力人');
    const initial = name.charAt(0) || '?';

    if (avatarUrl) {
      return [
        '<span class="group-contribution-avatar">',
        '<img src="',
        escapeHtml(IMAGE_FALLBACK_DATA_URL),
        '" data-managed-url="',
        escapeHtml(avatarUrl),
        '" data-image-key="',
        escapeHtml('contributionAvatar:' + String(member.playerId || '') + ':' + avatarUrl),
        '" alt="',
        escapeHtml(name),
        '的頭像">',
        '</span>'
      ].join('');
    }

    return [
      '<span class="group-contribution-avatar is-placeholder" aria-hidden="true">',
      escapeHtml(initial),
      '</span>'
    ].join('');
  }

  function openAllPracticeHistoryModal() {
    if (isCacheValid_('practiceHistory')) {
      showFootprintDashboard_(getCache_('practiceHistory') || {});
      return;
    }

    setLoading(true, '讀取同行足跡彙總...');
    callServer('getMyFootprintDashboard')
      .then((res) => {
        if (!isSuccess(res)) throw new Error(getResponseError(res, '足跡讀取失敗'));
        const dashboard = res.data || {};
        setCache_('practiceHistory', dashboard);
        showFootprintDashboard_(dashboard);
      })
      .catch((error) => {
        openInfoModal(
          '我的同行足跡',
          '<div class="empty-card">' +
            escapeHtml(getErrorMessage(error)) +
          '</div>'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function showFootprintDashboard_(dashboard) {
    openInfoModal('我的同行足跡', renderFootprintDashboardHtml_(dashboard || {}));
    bindFootprintDayButtons_(dashboard || {});
  }

  function renderFootprintDashboardHtml_(dashboard) {
    const month = dashboard.monthly || {};
    const stats = [
      ['完成天數', month.completedDays, '📅'],
      ['讀經天數', month.bibleDays, '📖'],
      ['禱告天數', month.prayerDays, '🙏'],
      ['晨興天數', month.morningDays, '🌅'],
      ['聚會次數', month.meetingCount, '🏠'],
      ['探訪次數', month.visitCount, '👣'],
      ['最長連續', month.longestStreak, '🔥'],
      ['本月點數', month.totalScore, '⭐']
    ].map((item) => [
      '<article class="footprint-stat">',
      '<span aria-hidden="true">', item[2], '</span>',
      '<strong>', formatNumber(item[1] || 0), '</strong>',
      '<small>', escapeHtml(item[0]), '</small>',
      '</article>'
    ].join('')).join('');
    const daily = Array.isArray(dashboard.daily) ? dashboard.daily : [];
    const heat = daily.slice().reverse().map((day) => {
      const level = Math.max(0, Math.min(4, Number(day.completedCount || 0)));
      const badges = (day.hasChest ? ' 🎁' : '') + (day.hasSpecialTask ? ' ✨' : '') +
        (String(day.streakStatus || '') === 'FULL' ? ' 🔥' : '');
      return [
        '<button class="footprint-day level-', level, '" type="button" data-footprint-day="',
        escapeHtml(day.recordDate || ''), '" aria-label="', escapeHtml(day.recordDate || ''),
        ' 完成 ', level, ' 項">',
        '<span>', escapeHtml(String(day.recordDate || '').slice(8,10)), '</span>',
        '<small>', level ? level + '/4' : '—', badges, '</small>',
        '</button>'
      ].join('');
    }).join('');
    const weekly = Array.isArray(dashboard.weekly) ? dashboard.weekly : [];
    const route = weekly.map((week, index) => {
      const high = Number(week.completedDays || 0) >= 5;
      const partial = Number(week.completedDays || 0) > 0;
      const stateClass = high ? 'is-high' : (partial ? 'is-partial' : 'is-empty');
      return [
        '<article class="footprint-week ', stateClass, '">',
        '<div class="footprint-week-marker">', high ? '★' : (partial ? '●' : '○'), '</div>',
        '<div><strong>', escapeHtml(week.weekKey || '本週'), '</strong>',
        '<p>📖 ', formatNumber(week.bibleDays || 0), '天　🙏 ', formatNumber(week.prayerDays || 0),
        '天　🌅 ', formatNumber(week.morningDays || 0), '天</p>',
        '<p>', week.groupMeetingCompleted ? '✅ 小排' : '▫️ 小排', '　',
        week.prayerMeetingCompleted ? '✅ 禱告聚會' : '▫️ 禱告聚會', '　',
        week.lordDayCompleted ? '✅ 主日' : '▫️ 主日', '　',
        week.visitCompleted ? '✅ 探訪' : '▫️ 探訪', '</p>',
        '<small>本週 ', formatNumber(week.weeklyScore || 0), ' 點',
        Number(week.chestCount || 0) ? '　🎁 ' + formatNumber(week.chestCount) : '',
        Number(week.specialTaskCount || 0) ? '　✨ ' + formatNumber(week.specialTaskCount) : '',
        '</small></div></article>'
      ].join('');
    }).join('');
    return [
      '<div class="footprint-dashboard">',
      '<section class="footprint-section"><div class="footprint-heading"><h3>本月成果卡</h3><span>',
      escapeHtml(month.monthKey || ''), '</span></div><div class="footprint-stats">', stats, '</div></section>',
      '<section class="footprint-section"><div class="footprint-heading"><h3>月曆熱度圖</h3><span>最近30天</span></div>',
      heat ? '<div class="footprint-heatmap">' + heat + '</div>' : '<div class="empty-card">目前還沒有每日足跡</div>',
      '</section>',
      '<section class="footprint-section"><div class="footprint-heading"><h3>每週足跡路線</h3><span>最近20週</span></div>',
      route ? '<div class="footprint-route">' + route + '</div>' : '<div class="empty-card">目前還沒有每週足跡</div>',
      '</section></div>'
    ].join('');
  }

  function bindFootprintDayButtons_(dashboard) {
    const rows = Array.isArray(dashboard.daily) ? dashboard.daily : [];
    const byDate = {};
    rows.forEach((row) => { byDate[String(row.recordDate || '')] = row; });
    $$('[data-footprint-day]').forEach((button) => {
      button.addEventListener('click', () => {
        const row = byDate[String(button.dataset.footprintDay || '')] || {};
        openInfoModal('每日足跡', [
          '<section class="info-block footprint-day-detail"><h3>', escapeHtml(row.recordDate || ''), '</h3>',
          '<p>', row.morningCompleted ? '✅ 晨興' : '▫️ 晨興', '　',
          row.bibleCompleted ? '✅ 讀經' : '▫️ 讀經', '　',
          row.prayerCompleted ? '✅ 禱告' : '▫️ 禱告', '　',
          row.readingCompleted ? '✅ 書報' : '▫️ 書報', '</p>',
          '<strong>當日 ', formatNumber(row.dailyScore || 0), ' 點</strong>',
          row.noteSummary ? '<p>' + escapeHtml(row.noteSummary) + '</p>' : '',
          '</section>'
        ].join(''));
      });
    });
  }

  function openLogoutConfirm() {
    openConfirmModal({
      title: '登出',
      heading: '確定要登出嗎？',
      description: '登出後需要再次輸入姓名與登入密碼。',
      confirmText: '確認登出',
      handler: logout
    });
  }

  function openConfirmModal(options) {
    state.pendingConfirm = options || {};

    $('#confirmModalTitle').textContent =
      state.pendingConfirm.title || '確認操作';

    $('#confirmModalHeading').textContent =
      state.pendingConfirm.heading || '確定要繼續嗎？';

    $('#confirmModalDescription').textContent =
      state.pendingConfirm.description || '';

    $('#confirmModalSubmitBtn').textContent =
      state.pendingConfirm.confirmText || '確認';

    openModal('confirmModal');
  }

  function executePendingConfirm() {
    const pending = state.pendingConfirm;

    closeModal('confirmModal');

    if (pending && typeof pending.handler === 'function') {
      pending.handler();
    }
  }

  function logout() {
    const token = state.sessionToken;

    setLoading(true, '登出中...');

    const finishLogout = () => {
      clearCurrentSession();
      $('#loginPassword').value = '';
      showAuth();
      setLoading(false);
    };

    if (!token) {
      finishLogout();
      return;
    }

    callServer('logoutPlayer', token)
      .catch(() => null)
      .finally(finishLogout);
  }

  function clearCurrentSession() {
    state.currentPlayer = null;
    state.sessionToken = '';
    state.sessionInvalidated = false;
    state.currentCycleId = '';
    state.dailyRecord = null;
    state.weeklyTaskRecord = null;
    state.groupJourney = null;
    state.homePrayerItems = [];
    state.homeGroupPosts = [];
    state.homeGroupMemberCount = 0;
    state.messageCenter = createEmptyMessageCenterState_();
    state.messageCenterFilter = 'ANNOUNCEMENT';
    state.selectedMessageKey = '';
    state.messageCenterAutoOpenedKey = '';
    state.pendingMessageCenterSuppressions.clear();
    state.messageCenterSuppressionFlushInFlight.clear();
    state.messageCenterSuppressionRetryAttempts.clear();
    if (state.messageCenterSuppressionRetryTimer) {
      window.clearTimeout(state.messageCenterSuppressionRetryTimer);
      state.messageCenterSuppressionRetryTimer = null;
    }
    renderHomeMessageBadge_();
    state.prayerCarouselItems = [];
    state.explorePrayerItems = [];
    state.myPrayerItems = [];
    clearAllAppCache_();

    localStorage.removeItem(STORAGE_KEY);
  }

  function openInfoModal(title, html) {
    $('#infoModalTitle').textContent = title || '詳細資料';

    $('#infoModalContent').innerHTML =
      html || '<div class="empty-card">沒有資料</div>';

    openModal('infoModal');
  }

  function ensureGroupFeatureReady(messageSelector) {
    const player = state.currentPlayer || {};
    const groupId = String(player.groupId || '').trim();
    const memberCount = Number(state.homeGroupMemberCount || 0);
    const message = !groupId
      ? '請先建立或加入活力組。'
      : '活力組至少需要 2 位成員，才能使用此功能。';

    if (groupId && memberCount >= 2) {
      return true;
    }

    if (messageSelector) {
      setResultMessage(messageSelector, message);
    } else {
      openInfoModal(
        '需要活力組',
        '<div class="empty-card">' + escapeHtml(message) + '</div>'
      );
    }

    return false;
  }

  function persistCurrentPlayer() {
    if (!state.sessionToken) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionToken: state.sessionToken,
        savedAt: new Date().toISOString(),
        playerId: state.currentPlayer && state.currentPlayer.playerId
          ? state.currentPlayer.playerId
          : ''
      })
    );
  }

  function showAuthMessage(message, success) {
    const box = $('#authMessage');

    box.textContent = message || '';
    box.classList.toggle('hidden', !message);
    box.classList.toggle('success', !!success);
  }

  function setResultMessage(selector, message, showWhenEmpty) {
    const box = $(selector);

    if (!box) {
      return;
    }

    box.textContent = message || '';
    box.classList.toggle(
      'hidden',
      !(message || showWhenEmpty)
    );

    box.classList.remove('success');
  }

  function setLoading(show, text) {
    const overlay = $('#loadingOverlay');
    const card = overlay.querySelector('.loading-card');
    const spinner = overlay.querySelector('.spinner');
    const oldAction = overlay.querySelector('.loading-action-btn');

    if (oldAction) {
      oldAction.remove();
    }

    overlay.classList.toggle('hidden', !show);
    overlay.classList.remove('is-error');

    if (card) {
      card.classList.remove('is-error');
    }

    if (spinner) {
      spinner.classList.remove('hidden');
    }

    $('#loadingText').textContent = text || '處理中...';
  }

  function setLoadingError_(message, actionText, handler) {
    const overlay = $('#loadingOverlay');
    const card = overlay.querySelector('.loading-card');
    const spinner = overlay.querySelector('.spinner');
    const oldAction = overlay.querySelector('.loading-action-btn');

    if (oldAction) {
      oldAction.remove();
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('is-error');

    if (card) {
      card.classList.add('is-error');
    }

    if (spinner) {
      spinner.classList.add('hidden');
    }

    $('#loadingText').textContent =
      message || '資料載入失敗，請重新整理或稍後再試';

    if (actionText && typeof handler === 'function' && card) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'loading-action-btn';
      button.textContent = actionText;
      button.addEventListener('click', handler);
      card.appendChild(button);
    }
  }

  function isSuccess(res) {
    return !!(res && res.success);
  }

  function getResponseError(res, fallback) {
    return res && res.error
      ? res.error
      : fallback;
  }

  function getErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    return error && error.message
      ? error.message
      : '系統錯誤';
  }

  function isSessionErrorResponse(res) {
    return !!(
      res &&
      SESSION_ERROR_CODES.indexOf(String(res.code || '').trim()) >= 0
    );
  }

  function handleSessionExpired() {
    if (state.sessionInvalidated) {
      return;
    }

    state.sessionInvalidated = true;
    clearCurrentSession();
    showAuth();
    showAuthMessage('登入狀態已失效，請重新登入。');
  }

  function createClientRequestId_() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'REQ-' + Date.now().toString(36) + '-' +
      Math.random().toString(36).slice(2, 12);
  }

  function getPendingMutationStorageKey_(kind) {
    const playerId = String(
      state.currentPlayer && state.currentPlayer.playerId || 'anonymous'
    );
    return 'vital-pending-mutation::' + playerId + '::' + String(kind || '');
  }

  function digestPendingMutationPayload_(value) {
    const text = typeof value === 'string'
      ? value : buildPendingMutationSignature_(value);
    let first = 2166136261;
    let second = 2246822519;
    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index);
      first = Math.imul(first ^ code, 16777619) >>> 0;
      second = Math.imul(second ^ code, 3266489917) >>> 0;
    }
    return 'pending-v1-' + first.toString(16).padStart(8, '0') +
      second.toString(16).padStart(8, '0');
  }

  function cleanupExpiredPendingMutationRequests_() {
    const now = Date.now();
    try {
      for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
        const key = window.localStorage.key(index);
        if (!key || key.indexOf('vital-pending-mutation::') !== 0) continue;
        let record = null;
        try { record = JSON.parse(window.localStorage.getItem(key) || '{}'); }
        catch (error) {}
        if (!record || Number(record.expiresAt || 0) <= now) {
          window.localStorage.removeItem(key);
        }
      }
    } catch (error) {}
  }

  function getPendingMutationRequestId_(kind, signature) {
    const storageKey = getPendingMutationStorageKey_(kind);
    const payloadDigest = digestPendingMutationPayload_(signature);
    const now = Date.now();
    cleanupExpiredPendingMutationRequests_();
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      if (String(saved.payloadDigest || '') === payloadDigest && saved.requestId &&
          Number(saved.expiresAt || 0) > now &&
          String(saved.actionType || '') === String(kind || '')) {
        return String(saved.requestId);
      }
    } catch (error) {}

    const requestId = createClientRequestId_();
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        requestId: requestId,
        payloadDigest: payloadDigest,
        actionType: String(kind || ''),
        createdAt: new Date(now).toISOString(),
        expiresAt: now + PENDING_MUTATION_TTL_MS
      }));
    } catch (error) {}
    return requestId;
  }

  function clearPendingMutationRequestId_(kind, requestId) {
    const storageKey = getPendingMutationStorageKey_(kind);
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      if (!requestId || String(saved.requestId || '') === String(requestId || '')) {
        window.localStorage.removeItem(storageKey);
      }
    } catch (error) {
      try { window.localStorage.removeItem(storageKey); } catch (ignored) {}
    }
  }

  function normalizePendingMutationSignatureValue_(value) {
    if (value === null || typeof value === 'undefined') return '';
    if (Array.isArray(value)) return value.map(normalizePendingMutationSignatureValue_);
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((result, key) => {
        if (key !== 'requestId' && key !== 'sessionToken') {
          result[key] = normalizePendingMutationSignatureValue_(value[key]);
        }
        return result;
      }, {});
    }
    return value;
  }

  function buildPendingMutationSignature_(payload) {
    return JSON.stringify(normalizePendingMutationSignatureValue_(payload || {}));
  }

  function beginPendingMutationRequest_(kind, payload) {
    const signature = buildPendingMutationSignature_(payload);
    return {
      signature,
      payloadDigest: digestPendingMutationPayload_(signature),
      requestId: getPendingMutationRequestId_(kind, signature)
    };
  }

  function isExplicitNonRetryableMutationResponse_(response) {
    if (!response || isSuccess(response)) return false;
    const code = String(response.code || response.errorCode || '').toUpperCase();
    const message = String(response.message || response.error || '').toUpperCase();
    return ['DATA_CONFLICT', 'VALIDATION_ERROR', 'FORBIDDEN', 'UNAUTHORIZED']
      .indexOf(code) >= 0 || /(^|:)DATA_CONFLICT:/.test(message);
  }

  function settlePendingMutationRequest_(kind, requestId, response) {
    if (isSuccess(response) || isExplicitNonRetryableMutationResponse_(response)) {
      clearPendingMutationRequestId_(kind, requestId);
      return true;
    }
    return false;
  }

  function prepareServerCallArgs(functionName, args) {
    const list = Array.from(args || []);

    if (SESSION_TOKEN_ARG_APIS.indexOf(functionName) >= 0) {
      return [state.sessionToken].concat(list.slice(1));
    }

    if (SESSION_PAYLOAD_APIS.indexOf(functionName) >= 0) {
      const payload = Object.assign({}, list[0] || {});

      payload.sessionToken = state.sessionToken;
      delete payload.playerId;
      delete payload.responderId;
      delete payload.cycleId;

      return [payload].concat(list.slice(1));
    }

    return list;
  }

  function callServer(functionName, ...args) {
    const finalArgs = prepareServerCallArgs(functionName, args);
    const isMutation = SERVER_MUTATION_APIS.has(functionName);

    return new Promise((resolve, reject) => {
      let settled = false;
      // GAS Web App 請求無法取消已開始的後端執行。讀取逾時可以安全重試；
      // 寫入則等待正式 callback，避免畫面先宣告失敗後又重複送出。
      const timeoutId = isMutation ? 0 : window.setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error('伺服器回應逾時，請確認網路後再試一次'));
      }, SERVER_READ_CALL_TIMEOUT_MS);

      const clearCallTimeout = () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };

      const resolveOnce = (res) => {
        if (settled) {
          return;
        }

        settled = true;
        clearCallTimeout();

        if (isSessionErrorResponse(res)) {
          handleSessionExpired();
        }

        resolve(res);
      };

      const rejectOnce = (error) => {
        if (settled) {
          return;
        }

        settled = true;
        clearCallTimeout();
        reject(error);
      };

      try {
        window.GasBackend
          .invoke(functionName, finalArgs)
          .then(resolveOnce)
          .catch(rejectOnce);
      } catch (error) {
        rejectOnce(error);
      }
    });
  }

  function getCacheTtlMs_(key) {
    key = String(key || '').trim();

    return Number(
      Object.prototype.hasOwnProperty.call(
        CACHE_POLICIES,
        key
      )
        ? CACHE_POLICIES[key]
        : CACHE_DEFAULT_TTL_MS
    );
  }

  function getCacheScope_() {
    return {
      playerId: state.currentPlayer && state.currentPlayer.playerId
        ? String(state.currentPlayer.playerId)
        : '',
      cycleId: String(state.currentCycleId || '')
    };
  }

  function getCacheEntry_(key) {
    key = String(key || '').trim();

    if (!key) {
      return null;
    }

    state.cache = state.cache || {};

    const entry = state.cache[key] || null;

    if (!entry) {
      return null;
    }

    const scope = getCacheScope_();

    if (
      String(entry.playerId || '') !== scope.playerId ||
      String(entry.cycleId || '') !== scope.cycleId
    ) {
      delete state.cache[key];
      return null;
    }

    const currentBusinessDate = getTaipeiBusinessDate_();

    if (
      String(entry.businessDate || '') !==
      currentBusinessDate
    ) {
      delete state.cache[key];
      return null;
    }

    if (entry.loadingPromise) {
      if (
        Date.now() -
        Number(entry.loadedAt || 0) <=
        30000
      ) {
        return entry;
      }

      delete state.cache[key];
      return null;
    }

    if (!entry.valid) {
      delete state.cache[key];
      return null;
    }

    if (
      Number(entry.expiresAt || 0) > 0 &&
      Date.now() >= Number(entry.expiresAt)
    ) {
      delete state.cache[key];
      return null;
    }

    return entry;
  }

  function isCacheValid_(key) {
    const entry = getCacheEntry_(key);

    return !!(entry && entry.valid);
  }

  function getCache_(key) {
    const entry = getCacheEntry_(key);

    return entry && entry.valid ? entry.data : null;
  }

  function setCache_(key, data) {
    key = String(key || '').trim();

    if (!key) {
      return data;
    }

    const scope = getCacheScope_();
    const loadedAt = Date.now();
    const ttlMs = getCacheTtlMs_(key);

    state.cache = state.cache || {};
    state.cache[key] = {
      data: data,
      valid: true,
      loadedAt: loadedAt,
      expiresAt: loadedAt + ttlMs,
      loadingPromise: null,
      playerId: scope.playerId,
      cycleId: scope.cycleId,
      businessDate: getTaipeiBusinessDate_()
    };

    return data;
  }

  function invalidateCache_(key) {
    key = String(key || '').trim();

    if (key && state.cache) {
      delete state.cache[key];
    }
  }

  function invalidateCaches_(keys) {
    (keys || []).forEach(invalidateCache_);
  }

  function clearAllAppCache_() {
    state.cache = {};
  }

  function loadOnce_(key, loader) {
    const cached = getCacheEntry_(key);

    if (cached && cached.valid) {
      return Promise.resolve(cached.data);
    }

    if (cached && cached.loadingPromise) {
      return cached.loadingPromise;
    }

    const scope = getCacheScope_();
    const promise = Promise.resolve()
      .then(loader)
      .then((data) => setCache_(key, data))
      .catch((error) => {
        invalidateCache_(key);
        throw error;
      });

    state.cache = state.cache || {};
    state.cache[key] = {
      data: null,
      valid: false,
      loadedAt: Date.now(),
      expiresAt: 0,
      loadingPromise: promise,
      playerId: scope.playerId,
      cycleId: scope.cycleId,
      businessDate: getTaipeiBusinessDate_()
    };

    return promise;
  }

  function invalidateByRule_(rule) {
    const map = {
      dailyPracticeChanged: [
        'dashboard',
        'dailyPractice',
        'practiceHistory',
        'growth',
        'journey',
        'chestSummary',
        'chestCollection',
        'chestSettingsForPlayer',
        'accountProfile'
      ],
      meetingPracticeChanged: [
        'dashboard',
        'meetingPractice',
        'practiceHistory',
        'growth',
        'journey',
        'chestSummary',
        'chestCollection',
        'chestSettingsForPlayer',
        'accountProfile'
      ],
      prayerContentChanged: [
        'prayerList',
        'myPrayers'
      ],
      prayerResponseChanged: [
        'prayerList',
        'dashboard',
        'accountProfile',
        'growth',
        'journey',
        'contribution',
        'groupJourneyList',
        'chestSummary',
        'chestCollection',
        'chestSettingsForPlayer'
      ],
      groupAnnouncementsChanged: [
        'groupAnnouncements',
        'dashboard'
      ],
      groupChanged: [
        'groupInfo',
        'groupAnnouncements',
        'contribution',
        'journey',
        'groupJourneyList',
        'dashboard',
        'growth',
        'chestSummary',
        'chestCollection',
        'chestSettingsForPlayer',
        'accountProfile'
      ],
      contributionChanged: [
        'contribution',
        'dashboard',
        'growth',
        'journey',
        'chestSummary',
        'chestCollection',
        'chestSettingsForPlayer',
        'accountProfile'
      ],
      accountChanged: [
        'accountProfile',
        'dashboard'
      ]
    };

    invalidateCaches_(map[rule] || []);
  }

  function toBool(value) {
    if (value === true) {
      return true;
    }

    if (value === false) {
      return false;
    }

    return [
      'true',
      '1',
      'yes',
      'y',
      '完成',
      '已完成',
      'done',
      'checked'
    ].includes(
      String(value || '').trim().toLowerCase()
    );
  }

  function createEmptyDailyRecord() {
    return {
      recordDate: formatLocalDate(new Date()),
      morningRevival: false,
      bibleReading: false,
      prayer: false,
      bookPursuit: false
    };
  }

  function createEmptyWeeklyTaskRecord() {
    return {
      weekKey: '',
      outreachVisit: false,
      smallGroup: false,
      prayerMeeting: false,
      lordDayMeeting: false
    };
  }

  function formatLocalDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return yyyy + '-' + mm + '-' + dd;
  }

  function formatWeeklyTaskDateRange(weekKey) {
    const normalizedWeekKey = String(weekKey || '').trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedWeekKey)) {
      return '讀取中...';
    }

    const parts = normalizedWeekKey.split('-');
    const start = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    if (Number.isNaN(start.getTime())) {
      return '讀取中...';
    }

    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    const weekNames = ['日', '一', '二', '三', '四', '五', '六'];
    const toText = (date) =>
      (date.getMonth() + 1) + '/' + date.getDate() + '(' + weekNames[date.getDay()] + ')';

    return toText(start) + '~' + toText(end);
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('zh-TW');
  }

  function normalizeAvatarGender(value) {
    const text = String(value || '').trim().toLowerCase();

    if (['male', 'm', '男'].includes(text)) {
      return 'male';
    }

    if (['female', 'f', '女'].includes(text)) {
      return 'female';
    }

    return '';
  }

  function getAvatarMaxNo(gender) {
    return normalizeAvatarGender(gender) === 'female'
      ? 100
      : 80;
  }

  function getAvatarUrl(gender, no) {
    const normalized = normalizeAvatarGender(gender) || 'male';
    const number = Number(no || 0);

    if (
      number < 1 ||
      number > getAvatarMaxNo(normalized)
    ) {
      return '';
    }

    const padded = String(number).padStart(3, '0');

    return ASSET_BASE_URL +
      (
        normalized === 'female'
          ? '/avatar-female/avatar-female-direct-'
          : '/avatar-male/avatar-male-direct-'
      ) +
      padded +
      '.png';
  }

  function buildRandomAvatar(gender) {
    const normalized = normalizeAvatarGender(gender) || 'male';

    const avatarNo =
      Math.floor(
        Math.random() * getAvatarMaxNo(normalized)
      ) + 1;

    return {
      avatarGender: normalized,
      avatarNo: avatarNo,
      avatarUrl: getAvatarUrl(normalized, avatarNo)
    };
  }

  function buildSteppedAvatar(gender, currentNo, delta) {
    const normalized = normalizeAvatarGender(gender) || 'male';
    const maxNo = getAvatarMaxNo(normalized);
    const baseNo = Number(currentNo || 1);
    const nextNo = ((baseNo - 1 + delta + maxNo) % maxNo) + 1;

    return {
      avatarGender: normalized,
      avatarNo: nextNo,
      avatarUrl: getAvatarUrl(normalized, nextNo)
    };
  }

  function getGenderLabel(gender) {
    return normalizeAvatarGender(gender) === 'female'
      ? '姊妹'
      : '弟兄';
  }

  function applySavedTheme() {
    setTheme(localStorage.getItem('yct_theme') || 'adventure', false);
  }

  function setTheme(theme, persist = true) {
    const allowed = ['adventure', 'fresh', 'night'];
    const nextTheme = allowed.includes(theme) ? theme : 'adventure';

    document.body.dataset.theme = nextTheme;

    if (persist) {
      localStorage.setItem('yct_theme', nextTheme);
    }

    $$('[data-theme-choice]').forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.themeChoice === nextTheme
      );
    });
  }

  function infoAttributeHtml(label, value) {
    return [
      '<div>',
      '<span>' + escapeHtml(label) + '</span>',
      '<strong>' + formatNumber(value) + '</strong>',
      '</div>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
