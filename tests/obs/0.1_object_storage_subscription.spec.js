import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('0.1_object_storage_이용해지,신청', async ({page}) => { 

  //이용해지  
  await page.goto(serviceUrl + '/objectStorage/subscription');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '상품 이용 중' }).click();
  await page.getByText('상품 이용 해지', { exact: true }).click();
  await page.getByRole('button', { name: ' 예' }).click();
  await page.waitForTimeout(1000);
  //버튼명 확인
  await expect(page.getByRole('button', { name: ' 이용 신청' })).toBeVisible();
  await page.waitForTimeout(1000);
  //서비스 이용 현황 페이지 확인
  await page.goto(serviceUrlPortal + '/mypage/status/usageStatus');
  await page.waitForTimeout(1000);
  await expect(page.getByRole('row', { name: 'Object Storage 한국 1 콘솔 바로가기' }).getByRole('cell').nth(2)).not.toBeVisible();
  await page.waitForTimeout(1000);
  //이용신청
  await page.goto(serviceUrl + '/objectStorage/subscription');  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 이용 신청' }).click();
  await page.getByRole('button', { name: ' 적용' }).click();
  await page.waitForTimeout(1000);
  //버튼명 확인
  await expect(page.getByRole('button', { name: '상품 이용 중' })).toBeVisible();
  await page.waitForTimeout(1000);
  //서비스 이용 현황 페이지 확인
  await page.goto(serviceUrlPortal + '/mypage/status/usageStatus');  
  await page.waitForTimeout(1000);
  await expect(page.getByRole('row', { name: 'Object Storage 한국 1 콘솔 바로가기' }).getByRole('cell').nth(2)).toBeVisible();
  await page.waitForTimeout(1000);   

  await page.close();
});


