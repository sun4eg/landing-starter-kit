import { defineConfig, devices } from '@playwright/test'

const previewPort = 4173
const baseURL = `http://127.0.0.1:${previewPort}`
const useInstalledChrome = process.env.PLAYWRIGHT_USE_INSTALLED_CHROME === 'true'

const managedBrowserProjects = [
  {
    name: 'chromium',
    use: devices['Desktop Chrome'],
  },
  {
    name: 'firefox',
    use: devices['Desktop Firefox'],
  },
  {
    name: 'webkit',
    use: devices['Desktop Safari'],
  },
]

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
  },
  projects: useInstalledChrome
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }]
    : managedBrowserProjects,
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${previewPort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
