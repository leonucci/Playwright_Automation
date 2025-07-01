import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test('1.6_object_storage_정적웹사이트호스팅', async ({ page }) => {

  const bucketname = '00-web-' + date;

  const objectname1 = 'index.html';
  const objectname2 = 'error.html';
    
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

  //정적 웹사이트 호스팅 설정
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '정적 웹 사이트 호스팅' }).click();  
  await page.locator('div').filter({ hasText: /^정적 웹 사이트 활성화$/ }).locator('label').nth(1).click();
  await page.waitForTimeout(1000);  
  await page.locator('input[name="indexDocument"]').fill('index.html');
  await page.locator('input[name="errorDocument"]').fill('error.html');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();   
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(1000);
  //파일 업로드1
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname1)
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  //파일 업로드2
  await page.reload();  
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname2)
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  //파일 공개처리
  await page.reload();  
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.getByRole('row', { name: '이름 크기 수정한 날짜' }).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('폴더/파일 공개하기').click();
  await page.getByRole('button', { name: ' 공개하기' }).click();
  await page.waitForTimeout(1000);
  await page.reload();  
  await page.waitForTimeout(1000);
  //정적 웹사이트 호스팅 설정 진입하여 주소 복사
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '정적 웹 사이트 호스팅' }).click();  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();   
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '' }).click();  
  await page.waitForTimeout(1000);
  const clipboardText1 = await page.evaluate("navigator.clipboard.readText()");    
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(1000);
  //호스팅 주소로 접근하여 인덱스파일 내용 확인
  await page.goto(clipboardText1, { bypassCache: true });
  await page.waitForTimeout(1000);
    await page.goto(clipboardText1, { bypassCache: true });
  await page.waitForTimeout(1000);
    await page.goto(clipboardText1, { bypassCache: true });
  await page.waitForTimeout(1000);
  await expect(page.getByText('인덱스 파일')).toBeVisible();  
  //잘못된 경로로 접근하여 에러파일 내용 확인
  await page.goto(clipboardText1+'/aaa', { bypassCache: true });
  await page.waitForTimeout(1000);
  await expect(page.getByText('error 파일')).toBeVisible();
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