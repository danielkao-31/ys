/*
   * RuntimeSettings.html
   *
   * 此檔案由 code.gs 只在前台輸出時附加。
   * 不修改 index.html、script.html、style.html 的版面、按鈕或既有流程。
   * 作用只有一個：把既有任務文字、積分顯示與確認視窗設定，
   * 改為使用後端正式 SystemSettings。
   */
  (function() {
    let pendingTaskSettingsRequest = null;

    const DAILY_CARD_TARGETS = {
      morning: ['#homeMorningBtn', '#dailyMorningBtn'],
      bible: ['#homeBibleBtn', '#dailyBibleBtn'],
      prayer: ['#homePrayerPracticeBtn', '#dailyPrayerBtn'],
      book: ['#homeBookBtn', '#dailyBookBtn']
    };

    const MEETING_CARD_TARGETS = {
      outreachVisit: ['#homeOutreachVisitBtn'],
      smallGroup: ['#homeWeeklySmallGroupBtn'],
      prayerMeeting: ['#homeWeeklyPrayerMeetingBtn'],
      lordDayMeeting: ['#homeWeeklyLordDayBtn']
    };

    function callRuntimeSettingsServer_(functionName) {
      return window.GasBackend.invoke(functionName, []);
    }

    function loadAndApplyRuntimeTaskSettings_() {
      if (pendingTaskSettingsRequest) {
        return pendingTaskSettingsRequest;
      }

      pendingTaskSettingsRequest = callRuntimeSettingsServer_(
        'getPublicTaskSettings'
      )
        .then(function(res) {
          if (!res || !res.success || !res.data || !res.data.taskConfig) {
            return null;
          }

          applyRuntimeTaskSettings_(res.data.taskConfig);
          return res.data.taskConfig;
        })
        .catch(function() {
          /*
           * 設定讀取失敗時保留使用者頁面既有文字與操作，
           * 不阻擋首頁、每日任務、聚會或代禱流程。
           */
          return null;
        })
        .finally(function() {
          pendingTaskSettingsRequest = null;
        });

      return pendingTaskSettingsRequest;
    }

    function applyRuntimeTaskSettings_(taskConfig) {
      taskConfig = taskConfig || {};

      const daily = taskConfig.daily || {};
      const meeting = taskConfig.meeting || {};

      updateExistingPracticeConfig_(daily);
      updateExistingMeetingConfig_(meeting);

      Object.keys(DAILY_CARD_TARGETS).forEach(function(type) {
        const config = daily[type];

        if (!config) {
          return;
        }

        DAILY_CARD_TARGETS[type].forEach(function(selector) {
          updateTaskCardText_(selector, config);
        });
      });

      Object.keys(MEETING_CARD_TARGETS).forEach(function(type) {
        const config = meeting[type];

        if (!config) {
          return;
        }

        MEETING_CARD_TARGETS[type].forEach(function(selector) {
          updateTaskCardText_(selector, config);
        });
      });
    }

    function updateExistingPracticeConfig_(daily) {
      try {
        if (typeof PRACTICE_CONFIG === 'undefined') {
          return;
        }

        Object.keys(daily || {}).forEach(function(type) {
          if (!PRACTICE_CONFIG[type] || !daily[type]) {
            return;
          }

          PRACTICE_CONFIG[type].title = daily[type].title;
          PRACTICE_CONFIG[type].description = daily[type].description;
          PRACTICE_CONFIG[type].reward = daily[type].reward;
        });
      } catch (err) {}
    }

    function updateExistingMeetingConfig_(meeting) {
      try {
        if (
          typeof MEETING_CONFIG === 'undefined' &&
          typeof WEEKLY_TASK_CONFIG === 'undefined'
        ) {
          return;
        }

        Object.keys(meeting || {}).forEach(function(type) {
          const targetConfig =
            typeof WEEKLY_TASK_CONFIG !== 'undefined' && WEEKLY_TASK_CONFIG[type]
              ? WEEKLY_TASK_CONFIG[type]
              : (
                typeof MEETING_CONFIG !== 'undefined' && MEETING_CONFIG[type]
                  ? MEETING_CONFIG[type]
                  : null
              );

          if (!targetConfig || !meeting[type]) {
            return;
          }

          targetConfig.title = meeting[type].title;
          targetConfig.description = meeting[type].description;
          targetConfig.reward = meeting[type].reward;
        });
      } catch (err) {}
    }

    function updateTaskCardText_(selector, config) {
      const card = document.querySelector(selector);

      if (!card) {
        return;
      }

      const title = card.querySelector('strong');
      const reward = card.querySelector('small');

      if (title) {
        title.textContent = String(config.title || '');
      }

      if (reward) {
        reward.textContent = '貢獻 +' + Number(config.score || 0);
      }
    }

    function escapeRuntimeHtml_(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function toRuntimeBool_(value) {
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
      ].indexOf(String(value || '').trim().toLowerCase()) >= 0;
    }

    function getPracticeTitle_(type) {
      try {
        return PRACTICE_CONFIG[type] && PRACTICE_CONFIG[type].title
          ? PRACTICE_CONFIG[type].title
          : '';
      } catch (err) {
        return '';
      }
    }

    function getMeetingTitle_(type) {
      try {
        if (typeof WEEKLY_TASK_CONFIG !== 'undefined' &&
            WEEKLY_TASK_CONFIG[type] &&
            WEEKLY_TASK_CONFIG[type].title) {
          return WEEKLY_TASK_CONFIG[type].title;
        }

        if (typeof MEETING_CONFIG !== 'undefined' &&
            MEETING_CONFIG[type] &&
            MEETING_CONFIG[type].title) {
          return MEETING_CONFIG[type].title;
        }

        return '';
      } catch (err) {
        return '';
      }
    }

    function installDynamicHistoryRenderers_() {
      try {
        renderDailyHistoryHtml = function(records) {
          records = records || [];

          if (!records.length) {
            return '<div class="empty-card">尚無每日任務紀錄</div>';
          }

          return records.map(function(record) {
            const labels = [];

            if (toRuntimeBool_(record.morningRevival)) {
              labels.push(getPracticeTitle_('morning'));
            }

            if (toRuntimeBool_(record.bibleReading)) {
              labels.push(getPracticeTitle_('bible'));
            }

            if (toRuntimeBool_(record.prayer)) {
              labels.push(getPracticeTitle_('prayer'));
            }

            if (toRuntimeBool_(record.bookPursuit)) {
              labels.push(getPracticeTitle_('book'));
            }

            return [
              '<article class="history-entry">',
              '<strong>' + escapeRuntimeHtml_(record.recordDate || '') + '</strong>',
              '<span>完成：' +
                escapeRuntimeHtml_(labels.filter(Boolean).join('、') || '尚無項目') +
              '</span>',
              record.note
                ? '<span>備註：' + escapeRuntimeHtml_(record.note) + '</span>'
                : '',
              '</article>'
            ].join('');
          }).join('');
        };
      } catch (err) {}

      try {
        renderMeetingHistoryHtml = function(records) {
          records = records || [];

          if (!records.length) {
            return '<div class="empty-card">尚無召會生活紀錄</div>';
          }

          return records.map(function(record) {
            const labels = [];

            if (toRuntimeBool_(record.outreachVisit)) {
              labels.push(getMeetingTitle_('outreachVisit'));
            }

            if (toRuntimeBool_(record.smallGroup)) {
              labels.push(getMeetingTitle_('smallGroup'));
            }

            if (toRuntimeBool_(record.prayerMeeting)) {
              labels.push(getMeetingTitle_('prayerMeeting'));
            }

            if (toRuntimeBool_(record.lordDayMeeting)) {
              labels.push(getMeetingTitle_('lordDayMeeting'));
            }

            return [
              '<article class="history-entry">',
              '<strong>' + escapeRuntimeHtml_(record.weekKey || '') + '</strong>',
              '<span>完成：' +
                escapeRuntimeHtml_(labels.filter(Boolean).join('、') || '尚無項目') +
              '</span>',
              record.note
                ? '<span>備註：' + escapeRuntimeHtml_(record.note) + '</span>'
                : '',
              '</article>'
            ].join('');
          }).join('');
        };
      } catch (err) {}
    }

    function installRefreshDashboardBridge_() {
      return;
      try {
        if (typeof refreshDashboard !== 'function') {
          return;
        }

        const originalRefreshDashboard = refreshDashboard;

        refreshDashboard = function(showLoading) {
          return loadAndApplyRuntimeTaskSettings_()
            .then(function() {
              return originalRefreshDashboard(showLoading);
            })
            .catch(function() {
              return originalRefreshDashboard(showLoading);
            });
        };
      } catch (err) {}
    }

    window.applyRuntimeTaskSettingsFromDashboard = applyRuntimeTaskSettings_;

    installDynamicHistoryRenderers_();
    installRefreshDashboardBridge_();

    /*
     * 任務設定已由 getHomeDashboard 一次回傳並套用。
     * 不在頁面開啟時另送 getPublicTaskSettings，避免和登入驗證競爭資源。
     */
  })();
