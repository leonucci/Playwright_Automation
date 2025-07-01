import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');


import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.6_object_storage_복사하기_붙여넣기', async ({page}) => {
  
  const bucketname = '00-cp-origin-' + date;
  const bucketname_copy = '00-cp-paste-' + date;
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
  //복사할 버킷 생성
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname_copy);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();
  //복사
  await page.getByText(bucketname).click();
  await page.getByRole('row', { name: ' ' + objectname }).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('복사하기').click();
  await page.waitForTimeout(1000);
  //붙여넗기
  await page.getByText(bucketname_copy).click();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('붙여넣기').click();
  await page.waitForTimeout(1000);
  //대상 버킷에 붙여넣은 파일 조회
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname_copy).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText(objectname)).toBeVisible();
  //원본 버킷에도 파일 남아 있는지 확인
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText(objectname)).toBeVisible();
  //버킷 2개 다 삭제 후 종료
  await page.waitForTimeout(1000);
  await page.goto(serviceUrl + + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await page.reload();  
  await page.getByRole('row', { name: bucketname_copy }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname_copy);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(5000);   
  
  await page.close();
});
