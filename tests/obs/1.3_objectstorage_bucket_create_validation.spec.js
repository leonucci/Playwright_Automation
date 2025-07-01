import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/obs/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('1.3_object_storage_버킷이름_밸리데이션_체크', async ({page}) => {  
   
  const bucketname = '00-validation-' + date;
  
  await page.goto(serviceUrl + '/objectStorage/objectStorageList');
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