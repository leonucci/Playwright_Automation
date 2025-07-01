import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.3_object_storage_새폴더', async ({page}) => {
  
  const bucketname = '00-folder-' + date;
  const foldername = 'obs-ui-new-folder';
  const objectname = '1bytes';
  
  //버킷생성
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.waitForTimeout(1000);
  //새폴더 생성
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  // await page.locator('#'+ bucketname).getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '새폴더' }).click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="folderName"]').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="folderName"]').fill(foldername);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 저장' }).click();
  await page.waitForTimeout(1000);
  //생성한 폴더 확인
  await expect(page.getByRole('row', { name: ' ' + foldername}).locator('span')).toBeVisible();
  await page.waitForTimeout(2000);
  //생성한 폴더에 업로드 시도
  await page.getByRole('row', { name: ' ' + foldername}).locator('span').dblclick();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname)
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: ' ' + foldername}).locator('span').dblclick();
  await page.waitForTimeout(1000);
  //업로드한 오브젝트 확인  
  await expect (page.getByText (objectname)).toBeVisible ();
  await page.waitForTimeout(1000);
  //폴더 삭제
  await page.getByRole('row', { name: '' }).getByRole('cell').nth(1).dblclick();
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: ' ' + foldername}).getByLabel('').check();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '편집' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('삭제하기').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 삭제' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('변경이 완료되면 자동으로 창 닫기').click();
  await page.waitForTimeout(1000);
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
