import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/ncs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('1.1_ncloud_storage_버킷생성', async ({page}) => {    
   
  const bucketname = '00-create-' + date;

  //버킷 생성
  await page.goto(serviceUrl + '/ncloud-storage/management');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();  
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.waitForTimeout(1000);    
  //생성된 버킷 검색하여 존재 확인
  await page.getByRole('textbox', { name: '버킷 이름' }).click();
  await page.getByRole('textbox', { name: '버킷 이름' }).fill(bucketname);
  await page.getByRole('button', { name: '' }).click();  
  await expect(page.getByText(bucketname , { exact: true })).toBeVisible();
  
  //버킷 삭제 후 종료
  await page.goto(serviceUrl + '/ncloud-storage/management');
  await page.waitForTimeout(1000);    
  await page.getByRole('textbox', { name: '버킷 이름' }).click();
  await page.getByRole('textbox', { name: '버킷 이름' }).fill(bucketname);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '' }).click();    
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('checkbox', { name: '변경이 완료되면 자동으로 창 닫기' }).check();
  await page.waitForTimeout(5000);  
  
  await page.close();
});