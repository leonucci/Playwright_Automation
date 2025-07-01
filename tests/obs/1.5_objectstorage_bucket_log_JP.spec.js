import test, {page, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"

//-------------------JP 전용입니다.-----------------

test ('1.5_object_storage_로그관리(JP)', async ({page}) => {  

  //-------------------JP 전용입니다.-----------------   
  const bucketname = '00-log-' + date;
  const logPrefix = 'log-';

  //버킷 생성
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();  
  await page.waitForTimeout(2000);  
  //버킷에 로그 관리 설정
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '로그 관리' }).click();
  await page.waitForTimeout(1000);  
  await page.locator('label').nth(2).click();  
  await page.waitForTimeout(10000);    
  await page.waitForLoadState("networkidle");
  await page.locator('.col-9').first().click();   
  await page.locator('#mCSB_9_container').getByText(bucketname).click();  
  await page.locator('input[name="loggingPrefix"]').fill(logPrefix);
  await page.getByRole('button', { name: ' 적용' }).click();
  await page.waitForTimeout(2000);  
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '로그 관리' }).click();
  await page.waitForTimeout(2000);  
  await expect(page.getByRole('button', { name: bucketname })).toBeVisible();
  await expect(page.locator('input[name="loggingPrefix"]')).toHaveValue(logPrefix);
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