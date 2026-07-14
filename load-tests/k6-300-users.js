import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const GAS_URL =
  __ENV.GAS_URL ||
  'https://script.google.com/macros/s/AKfycbzKqPnHLbQz0n3UtuqOx46aNeMaMyVHYWRgzlYr_hiTZ7qEm2UCx2JF2qWl0wybBlEjaQ/exec';

const ASSET_BASE_URL =
  __ENV.ASSET_BASE_URL ||
  'https://raw.githubusercontent.com/danielkao-31/ys/main';

const githubAssetFailures = new Rate('github_asset_failures');
const githubAssetDuration = new Trend('github_asset_duration', true);

const gasHomeFailures = new Rate('gas_home_failures');
const gasHomeDuration = new Trend('gas_home_duration', true);

const ASSET_PATHS = [
  '/UI/app-bg-cute-v4.png',
  '/UI/board-panel-cute-v4.png',
  '/UI/hero-journey-cute-v4.png',
  '/UI/icon-growth.png',
  '/UI/icon-prayer-link.png',
  '/UI/journey-map-cute-v4.png',
  '/UI/quest-panel-cute-v4.png',
  '/Chest_Assets/Chest_01.png',
  '/Chest_Assets/Chest_02.png',
  '/Chest_Assets/Chest_03.png',
  '/Chest_Assets/Chest_04.png',
  '/Chest_Assets/Chest_05.png',
  '/Chest_Assets/Chest_06.png',
  '/Chest_Assets/Chest_07.png',
  '/Chest_Assets/Chest_08.png',
];

export const options = {
  scenarios: {
    github_assets_300_users: {
      executor: 'per-vu-iterations',
      exec: 'testGithubAssets',
      vus: 300,
      iterations: 1,
      maxDuration: '5m',
      startTime: '0s',
    },

    gas_home_300_users: {
      executor: 'per-vu-iterations',
      exec: 'testGasHome',
      vus: 300,
      iterations: 1,
      maxDuration: '5m',
      startTime: '15s',
    },
  },

  thresholds: {
    github_asset_failures: ['rate<0.01'],
    github_asset_duration: ['p(95)<2000'],

    gas_home_failures: ['rate<0.01'],
    gas_home_duration: ['p(95)<5000'],
  },

  userAgent: 'Kao-System-Controlled-Load-Test/1.0',
};

export function testGithubAssets() {
  const requests = ASSET_PATHS.map((path) => ({
    method: 'GET',
    url: `${ASSET_BASE_URL}${path}`,
    params: {
      redirects: 5,
      timeout: '20s',
      tags: {
        target: 'github_asset',
        asset: path,
      },
    },
  }));

  const responses = http.batch(requests);

  for (const response of responses) {
    const ok = check(response, {
      'GitHub asset status is 200': (r) => r.status === 200,
      'GitHub asset has content': (r) =>
        Number(
          r.headers['Content-Length'] ||
          r.body?.length ||
          0
        ) > 0,
    });

    githubAssetFailures.add(!ok);
    githubAssetDuration.add(response.timings.duration);
  }
}

export function testGasHome() {
  const response = http.get(GAS_URL, {
    redirects: 10,
    timeout: '30s',
    tags: {
      target: 'gas_home',
    },
  });

  const ok = check(response, {
    'GAS homepage status is 200': (r) => r.status === 200,

    'GAS homepage returned HTML': (r) =>
      String(r.headers['Content-Type'] || '').includes('text/html'),

    'GAS homepage body is not empty': (r) =>
      Boolean(r.body && r.body.length > 100),
  });

  gasHomeFailures.add(!ok);
  gasHomeDuration.add(response.timings.duration);
}

export function handleSummary(data) {
  return {
    stdout: JSON.stringify(data.metrics, null, 2),
    'load-test-summary.json': JSON.stringify(data, null, 2),
  };
}
