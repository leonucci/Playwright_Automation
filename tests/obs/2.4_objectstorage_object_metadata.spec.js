import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.4_object_storage_메타데이터', async ({page}) => {
  
  const bucketname = '00-metadata-' + date;
  const objectname = '1bytes';
  const metadata1 = 'aaaa';
  const metadata2 = 'bbbb';

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
  //파일 선택하여 메타데이터 입력
  await page.getByRole('cell', { name: ' ' + objectname }).click();
  await page.getByRole('cell', { name: '메타 데이터 관리 ', exact: true }).getByRole('button').click();
  await page.getByRole('cell', { name: 'x-amz-meta-', exact: true }).getByRole('textbox').click();
  await page.getByRole('cell', { name: 'x-amz-meta-', exact: true }).getByRole('textbox').fill(metadata1);
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill(metadata2);
  await page.getByRole('button', { name: '메타데이터 추가' }).click();
  //추가한 데이터 확인
  await expect(page.locator('#mCSB_11_container').getByRole('cell', { name: 'x-amz-meta-' + metadata1})).toBeVisible();
  await expect(page.locator('#mCSB_11_container').getByRole('cell', { name: metadata1 })).toBeVisible();
  //메타데이터 설정 
  await page.getByRole('button', { name: ' 설정' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.getByRole('cell', { name: ' ' + objectname }).click();
  //설정한 메타데이터 확인
  await expect(page.getByRole('cell', { name: 'x-amz-meta-' + metadata1, exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: metadata2, exact: true })).toBeVisible();
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
