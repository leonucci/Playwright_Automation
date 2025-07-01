import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('4.1_object_storage_상세모니터링설정', async ({page}) => {
  
  const bucketname = '00-metric-' + date;
  const metricname = 'metricname-' + date;
  const prefixname = 'prefix-' + date;
  const suffixname = 'suffix-' + date;
    
  //버킷 생성
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(2000);
  //상세 모니터링 설정
  await page.goto(serviceUrl + '/objectStorage/MetricManagement');  
  await page.getByRole('button', { name: ' 상세 모니터링 정책 생성' }).click();
  await page.locator('input[name="filterName"]').click();
  await page.locator('input[name="filterName"]').fill(metricname);
  // await page.waitForTimeout(10000);
  await page.waitForLoadState("networkidle");
  await page.locator('div:nth-child(2) > .col-10').click();
  await page.locator('#mCSB_6_container').getByText(bucketname).click();
  await page.getByRole('button', { name: ' 정책 생성' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  //상세 모니터링 수정
  await page.getByRole('row', { name: metricname + ' ' + bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '수정' }).click();
  await page.locator('input[name="prefix"]').click();
  await page.locator('input[name="prefix"]').fill(prefixname);
  await page.locator('input[name="suffix"]').click();
  await page.locator('input[name="suffix"]').fill(suffixname);
  await page.getByRole('button', { name: '정책 수정' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).toBeVisible();
  await expect(page.getByRole('cell', { name: suffixname })).toBeVisible();
  //상세 모니터링 삭제
  await page.getByRole('row', { name: metricname + ' ' + bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '삭제' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).not.toBeVisible();
  //버킷 삭제
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(5000);   
  
  await page.close();
});
