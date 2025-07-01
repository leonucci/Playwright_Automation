const {chromium} = require ('playwright');

(async () => {
  const browser = await chromium.launch ({headless: false});
  const context = await browser.newContext ();
  const page = await context.newPage ();

  /////민간 리얼
  await page.goto('https://auth.ncloud.com/login');

  /////금융 리얼
  // await page.goto ('https://auth.fin-ncloud.com/login');

  /////공공 리얼
  // await page.goto ('https://auth.gov-ncloud.com/login');



  console.log ('로그인 후 리전, 플랫폼 선택 후 Enter 입력');
  await new Promise (resolve => {
    process.stdin.resume ();
    process.stdin.once ('data', () => {
      process.stdin.pause ();
      resolve ();
    });
  });

  await context.storageState ({path: 'storageState.json'});
  console.log ('로그인, 리전, 플랫폼 저장 완료');

  await browser.close ();
}) ();
