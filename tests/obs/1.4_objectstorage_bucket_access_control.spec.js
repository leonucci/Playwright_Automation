import test, {page, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('1.4_object_storage_접근제어', async ({page}) => {  
   
  const bucketname = '00-acc-con-' + date;
  
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
  //버킷에 접근제어 설정
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '접근 제어' }).click();
  await page.locator('label').nth(2).click();  
  await page.getByRole('cell', { name: 'Server (VPC)' }).first().click();
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  //화면 새로고침 후 접근제어 재진입
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '접근 제어' }).click();
  //접근제어 화면이 펼쳐져 있을 경우에만 노출되는 문구 확인
  await expect(page.getByRole('heading', { name: '서버 접근 제어' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ACL 설정 정보$/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Server (VPC)' }).locator('div')).toBeVisible();
  //VPC 서버 클릭 후 왼쪽으로 이동 버튼 활성화 확인
  await page.getByRole('cell', { name: 'Server (VPC)' }).click();
  await expect(page.getByRole('button', { name: '' })).toBeVisible();   
  await page.getByRole('button', { name: ' 확인' }).click();
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