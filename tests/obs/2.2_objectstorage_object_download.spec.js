import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.2_object_storage_파일다운로드', async ({page}) => {
  
  const bucketname = '00-download-' + date;
  const objectname = '1bytes';
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
  await page.waitForTimeout(1000);
  //버킷 선택하여 파일 올리기
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.waitForTimeout(1000);
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname)
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  //업로드 후 새로고침하여 버킷 선택
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);  
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  //업로드한 오브젝트 확인  
  await expect (page.getByText (objectname)).toBeVisible ();
  //업로드한 오브젝트 다운로드  
  await page.getByRole('row', { name: ' ' + objectname }).getByLabel('').check();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: ' 다운로드' }).click();
  const download = await downloadPromise;
  await download.saveAs('C:/Playwright_Automation/download/' + objectname);

  await page.waitForTimeout(3000);
  //버킷 삭제 후 종료  
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(5000);   

  await page.close();
});
