import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./ui-tests',
 fullyParallel:true,
 retries:process.env.CI?1:0,
 reporter:process.env.CI?'github':'list',
 use:{...devices['Desktop Chrome'],viewport:{width:1024,height:650},baseURL:'http://127.0.0.1:5173'},
 webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:120000},
});
