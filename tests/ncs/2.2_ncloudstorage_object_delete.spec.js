import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/ncs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('2.1_ncloud_storage_파일삭제', async ({page}) => {    
   
  const bucketname = '00-obj-delete-' + date;
  const objectname = '1bytes';

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
  //생성된 버킷 검색
  await page.getByRole('textbox', { name: '버킷 이름' }).click();
  await page.getByRole('textbox', { name: '버킷 이름' }).fill(bucketname);
  await page.getByRole('button', { name: '' }).click();  
  await page.waitForTimeout(1000);
  //보기 버튼 클릭하여 버킷 진입
  await page.getByRole('button', { name: '보기', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.waitForTimeout(1000);
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname)  
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '닫기' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('row', { name: ' ' + objectname }).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('삭제하기').click();
  await page.getByRole('button', { name: ' 삭제' }).click();
  await page.waitForTimeout(3000);
  //파일 삭제 후 조회 안됨 확인
  await expect(page.getByText('1bytes')).not.toBeVisible();
  await page.waitForTimeout(1000);

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