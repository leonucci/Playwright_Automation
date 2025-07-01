import {test, expect} from '@playwright/test';

test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');


import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


//-----민간 베타-----
// KR 리전 - 모두 가능
// SG 리전 - 접근제어, 이벤트관리 불가
// JP 리전 - 접근제어, 이벤트관리 불가, 로그관리 JP 전용 사용

//-----민간 리얼-----
// KR 리전 - 모두 가능
// SG 리전 - 모두 가능
// JP 리전 - 로그관리 JP 전용 사용
// US 리전 - 접근제어, 이벤트관리 불가
// DE 리전 - 접근제어, 이벤트관리 불가

//-----금융 모두 가능-----

//-----공공 이벤트 관리 없음-----

//---------------------------민간 베타 SG 전용-------------------------------------

test ('1.1_object_storage_버킷생성', async ({page}) => {
   
  const bucketname = '00-create-' + date;
  //버킷 생성
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');  
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '다음 ' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  //버킷 생성 후 조회
  await expect(page.getByText(bucketname)).toBeVisible();
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

test ('1.2_object_storage_버킷삭제', async ({page}) => {  
   
  const bucketname = '00-delete-' + date;
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
  //버킷 삭제    
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();  
  //버킷 삭제 후 20초 후 화면 리프레시
  await page.waitForTimeout(20000);
  await page.reload();  
  //삭제한 버킷 조회 안됨을 확인
  await expect(page.getByText(bucketname)).not.toBeVisible({ timeout: 30000 });

  await page.close();
});

test ('1.3_object_storage_버킷이름_밸리데이션_체크', async ({page}) => {  
   
  const bucketname = '00-validation-' + date;
  
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');
  await page.waitForTimeout(1000);  
  await page.getByRole('button', { name: ' 버킷 생성' }).click();
  //3글자 미만
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('aa');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('최소 3글자 이상, 최대 63 자까지만 입력이 가능합니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //이미 사용중인 이름
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('test');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('이미 사용중인 이름입니다. 다른 이름을 사용하세요.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //63자 초과 입력  
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('최소 3글자 이상, 최대 63 자까지만 입력이 가능합니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //첫글자에 소문자 입력 안함  
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('-aa');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('시작과 끝에는 알파벳 소문자나 숫자가 와야 합니다. 점(.)과 대시를 허용하지만, IP 주소 형태의 이름은 허용되지 않습니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //마지막 글자에 소문자 입력 안함
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('aa-');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('시작과 끝에는 알파벳 소문자나 숫자가 와야 합니다. 점(.)과 대시를 허용하지만, IP 주소 형태의 이름은 허용되지 않습니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //-- 를 연속 입력
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('aaa--aaa');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('점(.)과 대시를 연속하여 입력할 수 없습니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //.. 을 연속 입력
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();  
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('aaa..aaa');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('점(.)과 대시를 연속하여 입력할 수 없습니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //IP 주소 형식으로 입력
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill('111.111.111.111');
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('paragraph')).toContainText('시작과 끝에는 알파벳 소문자나 숫자가 와야 합니다. 점(.)과 대시를 허용하지만, IP 주소 형태의 이름은 허용되지 않습니다.');
  await expect(page.getByRole('button', { name: '다음 ' })).toBeDisabled();
  //정상 입력
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).click();
  await page.getByRole('textbox', { name: '최소 3자, 최대 63자' }).fill(bucketname);
  await page.waitForTimeout(1000);  
  await expect(page.getByRole('button', { name: '다음 ' })).toBeEnabled();

  await page.close();

});

test ('1.5_object_storage_로그관리', async ({page}) => {  
   
  const bucketname = '00-log-' + date;
  const logPrefix = 'log/';

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
  //버킷에 로그 관리 설정
  await page.getByText(bucketname).click();  
  console.log('[id="\\30 '+ bucketname.substring(1) + '"]');
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '로그 관리' }).click();    
  await page.waitForTimeout(1000);
  await page.locator('input[name="loggingPrefix"]').click();
  await page.locator('input[name="loggingPrefix"]').fill(logPrefix);
  await page.getByRole('button', { name: ' 추가' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.getByRole('button', { name: ' 새로고침' }).click();
  //로그 설정 확인
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '로그 관리' }).click();  
  await page.waitForTimeout(1000);
  await expect(page.getByRole('cell', { name: logPrefix })).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 확인' }).click();
  //버킷 삭제    
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();  
  await page.waitForTimeout(5000);
  
  await page.close();
});

test('1.6_object_storage_정적웹사이트호스팅', async ({ page }) => {

  const bucketname = '00-web-' + date;

  const objectname1 = 'index.html';
  const objectname2 = 'error.html';
    
  //버킷 생성
  await page.goto(serviceUrl + '/objectStorage/objectStorageList', { bypassCache: true } );
  await page.waitForTimeout(1000);
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
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: ' 확인' }).click();   
  await page.waitForTimeout(5000);
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
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname2)
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  //파일 공개처리
  await page.reload();  
  await page.waitForTimeout(1000);
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: '이름 크기 수정한 날짜' }).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('폴더/파일 공개하기').click();
  await page.getByRole('button', { name: ' 공개하기' }).click();
  await page.waitForTimeout(1000);
  await page.reload();    
  await page.waitForTimeout(5000);
  //정적 웹사이트 호스팅 설정 진입하여 주소 복사
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
  await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: '정적 웹 사이트 호스팅' }).click();  

  await page.waitForTimeout(3000); 
  //웹사이트 진입 시 확인 버튼이 비활성되어 있으면 다시 새로고침 후 진입  
  const confirm_button = page.getByRole('button', { name: ' 확인' });  
  while ((await confirm_button.isDisabled())) {
      await page.reload();  
      await page.waitForTimeout(1000);      
      await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').click();
      await page.locator('[id="\\30 '+ bucketname.substring(1) + '"]').getByRole('button', { name: '' }).click();
      await page.getByRole('button', { name: '정적 웹 사이트 호스팅' }).click();  
      await page.waitForTimeout(3000);       
  }

  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: ' 확인' }).click();   
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: '' }).click();  
  await page.waitForTimeout(3000);
  const clipboardText1 = await page.evaluate("navigator.clipboard.readText()");    
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(1000);
  //호스팅 주소로 접근하여 인덱스파일 내용 확인
  await page.goto(clipboardText1, { bypassCache: true });
  await page.waitForTimeout(1000);    
  
  const text = await page.content();

  while (!(await text.includes('인덱스 파일'))) {      
      await page.reload();        
      await page.waitForTimeout(1000);     
      const text = await page.content();
      if(await text.includes('인덱스 파일')){        
        break; 
      }
  }

  await page.waitForTimeout(1000);  
  await expect(page.getByText('인덱스 파일')).toBeVisible();

  //잘못된 경로로 접근하여 에러파일 내용 확인
  await page.waitForTimeout(1000);  
  await page.goto(clipboardText1+'/aaa', { bypassCache: true });
  await page.waitForTimeout(1000);
  await expect(page.getByText('error 파일')).toBeVisible();
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

test ('2.1_object_storage_파일올리기', async ({page}) => {
  
  const bucketname = '00-upload-' + date;
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
  //업로드 후 새로고침(2번)하여 버킷 선택
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);  
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  //업로드한 오브젝트 확인  
  await expect (page.getByText (objectname)).toBeVisible ();
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

test ('2.3_object_storage_새폴더', async ({page}) => {
  
  const bucketname = '00-folder-' + date;
    const foldername = 'obs-ui-new-folder';
    const objectname = '1bytes';
    
    //버킷생성
    await page.goto(serviceUrl + '/objectStorage/objectStorageList');
    await page.waitForTimeout(1000);
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

test ('2.5_object_storage_파일삭제', async ({page}) => {
  
  const bucketname = '00-obj-delete-' + date;
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
  await page.getByRole('button', { name: ' 파일 올리기' }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Playwright_Automation\\test_file\\'+ objectname)
  await page.getByRole('button', { name: ' 전송 시작' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: '' }).first().click();    
  //업로드 후 새로고침하여 버킷 선택  
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(1000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  //업로드한 파일 삭제
  await page.getByRole('row', { name: ' ' + objectname}).getByLabel('').check();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '편집' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('삭제하기').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 삭제' }).click();  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.waitForTimeout(2000);
  await page.getByText(bucketname).click();
  await page.waitForTimeout(2000);
  //삭제한 오브젝트 없는지 확인  
  await expect (page.getByText (objectname)).not.toBeVisible ();  
  await page.waitForTimeout(1000);
  //버킷 삭제 후 종료
  // await page.getByText(bucketname).click();
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
  await page.getByRole('row', { name: bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '버킷 삭제', exact: true }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).click();
  await page.getByRole('textbox', { name: '안전한 삭제를 위해 버킷 이름을 다시 한번 입력해 주세요' }).fill(bucketname);
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(5000);  
  
  await page.close();
});

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
  await page.waitForTimeout(3000);
  await expect(page.getByText(objectname)).toBeVisible();
  //원본 버킷에도 파일 남아 있는지 확인
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(3000);
  await expect(page.getByText(objectname)).toBeVisible();
  //버킷 2개 다 삭제 후 종료
  await page.waitForTimeout(1000);
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
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

test ('2.7_object_storage_잘라내기_붙여넣기', async ({page}) => {
  
  const bucketname = '00-cut-origin-' + date;
  const bucketname_copy = '00-cut-paste-' + date;
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
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: ' ' + objectname }).getByLabel('').check();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '편집' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('잘라내기').click();
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
  //원본 버킷에 파일 없어졌는지 확인
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText(objectname)).not.toBeVisible();
  //버킷 2개 다 삭제 후 종료
  await page.waitForTimeout(1000);
  await page.goto(serviceUrl + '/objectStorage/objectStorageList/bucketList');
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

test ('2.8_object_storage_이름바꾸기', async ({page}) => {
  
  const bucketname = '00-namechange-' + date;
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
  //업로드된 파일 이름 변경
  // await page.reload();  
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(2000);
  await page.getByRole('row', { name: ' ' + objectname}).getByLabel('').check();
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByText('이름 바꾸기').click();
  await page.getByRole('row', { name: objectname }).getByRole('textbox').fill(objectname + '-changename');
  await page.getByRole('row', { name: objectname }).getByRole('textbox').press('Enter');
  await page.getByRole('button', { name: ' 새로고침' }).click();
  await page.getByText(bucketname).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText(objectname + '-changename')).toBeVisible();
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

test ('3.1_object_storage_수명주기설정', async ({page}) => {
  
  const bucketname = '00-lifecycle-' + date;

  const prefixname = 'prefix-' + date;
  const deleteday = '1';

    
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
  await page.waitForTimeout(2000);
  //버킷에 수명주기 설정(만료삭제)
  await page.goto(serviceUrl + '/objectStorage/ILMManagement');  
  await page.getByRole('button', { name: ' 수명 주기 정책 추가' }).click();
  await page.getByRole('radio', { name: '만료 삭제' }).check();
  await page.getByRole('textbox', { name: '(최대값, 3,650일)' }).click();
  await page.getByRole('textbox', { name: '(최대값, 3,650일)' }).fill(deleteday);
  await page.locator('div:nth-child(2) > .box-body > div > div').first().click();
  await page.locator('#mCSB_6_container').getByText(bucketname).click();
  await page.locator('input[name="prefix"]').click();
  await page.locator('input[name="prefix"]').fill(prefixname);
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: '다음' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: '완료' }).click();
  await page.waitForTimeout(6000);
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).toBeVisible();
  //수명주기 중지
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '중지' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 OFF '+  bucketname})).toBeVisible();
  //수명주기 시작
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 OFF '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '시작' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname})).toBeVisible();
  //수명주기 삭제  
  await page.getByRole('row', { name: '만료 삭제 + ' + deleteday + '일 후 삭제 ON '+  bucketname}).getByLabel('').check();
  await page.getByRole('button', { name: '삭제' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: bucketname })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).not.toBeVisible();
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

test ('4.1_object_storage_상세모니터링설정', async ({page}) => {
  
  const bucketname = '00-metric-' + date;
  const metricname = 'metricname-' + date;
  const prefixname = 'prefix-' + date;
  const suffixname = 'suffix-' + date;
    
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
  await page.waitForTimeout(2000);
  //상세 모니터링 설정
  await page.goto(serviceUrl + '/objectStorage/MetricManagement');  
  await page.getByRole('button', { name: ' 상세 모니터링 정책 생성' }).click();
  await page.locator('input[name="filterName"]').click();
  await page.locator('input[name="filterName"]').fill(metricname);
  // await page.waitForTimeout(10000);
  await page.waitForLoadState("networkidle");
  await page.locator('div:nth-child(2) > .col-10').click();
  await page.locator('#mCSB_6_container').getByText(bucketname).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: ' 정책 생성' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  //상세 모니터링 수정
  await page.getByRole('row', { name: metricname + ' ' + bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '수정' }).click();
  await page.locator('input[name="prefix"]').click();
  await page.locator('input[name="prefix"]').fill(prefixname);
  await page.locator('input[name="suffix"]').click();
  await page.locator('input[name="suffix"]').fill(suffixname);
  await page.getByRole('button', { name: '정책 수정' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).toBeVisible();
  await expect(page.getByRole('cell', { name: prefixname })).toBeVisible();
  await expect(page.getByRole('cell', { name: suffixname })).toBeVisible();
  //상세 모니터링 삭제
  await page.getByRole('row', { name: metricname + ' ' + bucketname }).getByLabel('').check();
  await page.getByRole('button', { name: '삭제' }).click();
  await page.getByRole('button', { name: ' 확인' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('cell', { name: metricname })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: bucketname })).not.toBeVisible();
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
