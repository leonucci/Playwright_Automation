import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/ars/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.4_archive_storage_새폴더', async ({page}) => {
  
  const bucketname = 'aa-folder-' + date;
  const objectname = '1bytes';
  const foldername = 'newfolder-' + date;
  
  //버킷 생성
  await page.goto(serviceUrl + '/archiveStorage/archiveStorageList');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: ' 컨테이너(버킷) 생성' }).click();
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill(bucketname);
  await page.getByRole('button', { name: ' 저장' }).click();
  await page.waitForTimeout(10000);
  await page.reload();  
  await page.waitForTimeout(2000);
  //폴더 생성
  await page.getByText(bucketname).click();
  await page.getByRole('button', { name: '새폴더' }).click();
  await page.locator('input[name="folderName"]').click();
  await page.locator('input[name="folderName"]').fill(foldername);
  await page.getByRole('button', { name: ' 저장' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();  
  await page.getByText(bucketname).click();
  await expect(page.getByRole('cell', { name: ' ' + foldername })).toBeVisible();
  //버킷 선택하여 파일 올리기
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('cell', { name: ' ' + foldername }).dblclick();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.waitForTimeout(1000);
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname)
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: '' }).first().click();    
  //업로드한 파일 확인
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('cell', { name: ' ' + foldername }).dblclick();
  await page.waitForTimeout(5000);
  await expect (page.getByText (objectname)).toBeVisible ();    
  //업로드한 파일 삭제
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.getByRole('cell', { name: ' ' + foldername }).dblclick();
  await page.waitForTimeout(5000);
  await page.getByRole('row', { name: ' ' + objectname}).getByLabel('').check();
  await page.waitForTimeout(1000);
  await page.getByText('삭제하기').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 삭제' }).click();  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(2000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(2000);
  await page.getByRole('cell', { name: ' ' + foldername}).dblclick();
  await page.waitForTimeout(5000);
  //삭제한 오브젝트 없는지 확인  
  await expect (page.getByText (objectname)).not.toBeVisible ();   
  //폴더 삭제
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: ' ' + foldername }).getByLabel('').check();
  await page.getByRole('button', { name: '삭제하기' }).click();
  await page.getByRole('button', { name: ' 삭제' }).click();
  //삭제한 폴더 없는지 확인
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(3000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('cell', { name: ' ' + foldername })).not.toBeVisible();
  //버킷 삭제 후 종료
  await page.reload();  
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  await page.getByRole('listitem').filter({ hasText: bucketname }).getByRole('button').click();
  await page.getByText('컨테이너(버킷) 삭제', { exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 컨테이너(버킷) 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 컨테이너(버킷) 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);

  await page.close();
});
