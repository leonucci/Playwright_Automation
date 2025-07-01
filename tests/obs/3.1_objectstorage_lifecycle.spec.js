import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('3.1_object_storage_수명주기설정', async ({page}) => {
  
  const bucketname = '00-lifecycle-' + date;

  const prefixname = 'prefix-' + date;
  const deleteday = '1';

    
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
  //버킷에 수명주기 설정(만료삭제)
  await page.goto(serviceUrl + '/objectStorage/ILMManagement');  
  await page.getByRole('button', { name: ' 수명 주기 정책 추가' }).click();
  await page.getByRole('radio', { name: '만료 삭제' }).check();
  await page.getByRole('textbox', { name: '(최대값, 3,650일)' }).click();
  await page.getByRole('textbox', { name: '(최대값, 3,650일)' }).fill(deleteday);
  await page.locator('div:nth-child(2) > .box-body > div > div').first().click();
  await page.locator('#mCSB_6_container').getByText(bucketname).click();
  await page.locator('input[name="prefix"]').click();
  await page.locator('input[name="prefix"]').fill(prefixname);
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: '완료' }).click();
  await page.waitForTimeout(6000);
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).toBeVisible();
  //수명주기 중지
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '중지' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 OFF '+  bucketname})).toBeVisible();
  //수명주기 시작
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 OFF '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '시작' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname})).toBeVisible();
  //수명주기 삭제  
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '삭제' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: bucketname })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).not.toBeVisible();
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
