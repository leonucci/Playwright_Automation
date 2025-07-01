import {test, expect} from '@playwright/test';
test.use ({viewport: {height: 1080, width: 1920}});
test.use({ storageState: 'C:/Playwright_Automation/tests/ars/storageState.json' });

const now = new Date();
const date = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

import { serviceUrl } from "./service_region.js"
import { serviceUrlPortal } from "./service_region.js"


test ('1.3_archive_storage_버킷이름_벨리데이션_체크', async ({page}) => {    
  
  const bucketname = 'aa-validation-' + date;

  await page.goto(serviceUrl + '/archiveStorage/archiveStorageList');
  await page.waitForTimeout(5000);

  //버킷 생성버튼 클릭
  await page.getByRole('button', { name: ' 컨테이너(버킷) 생성' }).click();
  //정상 버킷명 입력
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill(bucketname);
  await expect(page.getByRole('button', { name: ' 저장' })).toBeEnabled();
  //2글자 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('aa');
  await page.waitForTimeout(1000);
  await expect(page.getByText('최소 3 글자 이상, 최대 30')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //31글자 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  await page.waitForTimeout(1000);
  await expect(page.getByText('최소 3 글자 이상, 최대 30')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //특수문자로 끝나는 이름 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('aa-');
  await page.waitForTimeout(1000);
  await expect(page.getByText('영어 또는 숫자로 끝나야 합니다')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //특수문자로 시작되는 이름 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('-aa');
  await page.waitForTimeout(1000);
  await expect(page.getByText('영어, 숫자, “-”의 특수문자만 허용하며 영어로 시작해야 합니다')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //'-' 외의 특수문자 사용안됨 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('a#a');
  await page.waitForTimeout(1000);
  await expect(page.getByText('영어, 숫자, “-”의 특수문자만 허용하며 영어로 시작해야 합니다')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //숫자로 시작하는 이름 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill('1aa');
  await page.waitForTimeout(1000);
  await expect(page.getByText('영어, 숫자, “-”의 특수문자만 허용하며 영어로 시작해야 합니다')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();
  //공백만 입력 확인
  await page.locator('input[name="bucketName"]').click();
  await page.locator('input[name="bucketName"]').fill(' ');
  await page.waitForTimeout(1000);
  await expect(page.getByText('컨테이너(버킷) 이름을 입력하세요.')).toBeVisible();
  await expect(page.getByRole('button', { name: ' 저장' })).toBeDisabled();  
  
  await page.close();
});