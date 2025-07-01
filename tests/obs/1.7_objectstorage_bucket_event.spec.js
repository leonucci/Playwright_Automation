import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test('1.7_object_storage_이벤트관리', async ({ page }) => {

  const bucketname = '00-event-' + date;
  const eventname = 'event-' + date;
  
  //버킷 생성  
  await page.goto(serviceUrl + '/objectStorage/objectStorageList', { bypassCache: true } );
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();  
  await page.waitForTimeout(2000);  
  //이벤트 생성
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '이벤트 관리' }).click();
  await page.getByRole('button', { name: '생성', exact: true }).click();
  await page.getByRole('checkbox', { name: '객체 생성 전체 (ObjectCreated:*)' }).check();
  await page.getByRole('checkbox', { name: '객체 삭제 (ObjectRemoved:DELETE)' }).check();
  await page.locator('input[name="ruleName"]').click();
  await page.locator('input[name="ruleName"]').fill(eventname);
  await page.getByRole('button', { name: '상품을 선택하세요' }).click();
  await page.locator('#mCSB_10_container').getByText('Cloud Functions').click();
  await page.getByRole('row', { name: '트리거 이름 트리거 설명 연결된 액션 수' }).getByLabel('').check();
  await page.getByRole('checkbox', { name: '트리거에 연결된 액션이 Object Storage' }).check();
  await page.getByRole('button', { name: ' 생성' }).click();
  await page.waitForTimeout(2000);  
  await expect(page.getByRole('cell', { name: eventname })).toBeVisible();
  //이벤트 편집
  await page.getByRole('row', { name: eventname + ' ObjectCreated:PUT' }).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).nth(1).click();
  await page.getByRole('checkbox', { name: '객체 삭제 (ObjectRemoved:DELETE)' }).uncheck();
  await page.getByRole('button', { name: ' 저장' }).click();  
  await page.waitForTimeout(5000);  
  await expect(page.locator('tbody')).not.toContainText('ObjectRemoved:DELETE');
  //이벤트 삭제
  await page.getByRole('row', { name: eventname + ' ObjectCreated:' }).getByLabel('').check();
  await page.getByRole('button', { name: '삭제' }).click();
  await page.waitForTimeout(2000);  
  await expect(page.getByRole('cell', { name: 'event-' })).not.toBeVisible();
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