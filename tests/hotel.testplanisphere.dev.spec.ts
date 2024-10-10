import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';

test.beforeEach(async() => {
    dotenv.config();
})

test.afterAll(async({ page }) => {
    page.close();
})

test('タイトル確認 @title', async ({ page }) => {
    try{
        await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/HOTEL PLANISPHERE/);
        await console.log('OK');
    }catch(error){
        await console.log('NG', error);
    }
});

test.describe('ログイン @login', () => {
    test('ログイン画面', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button',{ name: 'ログイン' }).click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/ログイン /);
            // Expect URL is correct./
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/login.html');
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }
    });

    test('ログインエラー1:メールアドレス不正', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', 'ichiro@@example.com');
            await typing(page, 'パスワード', process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            await expect(page.getByText('メールアドレスを入力してください。')).toBeVisible();
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }
    });

    test('ログインエラー2:パスワード間違い', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', process.env.MAIL1 || '');
            await typing(page, 'パスワード', 'passwords');
            await page.locator('#login-button').click();
            await expect(page.locator('#email-message')).toHaveText('メールアドレスまたはパスワードが違います。');
            await expect(page.locator('#password-message')).toHaveText('メールアドレスまたはパスワードが違います。');
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }
    });

    test('ログイン成功1:プレミアム会員', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', process.env.MAIL1 || '');
            await typing(page, 'パスワード', process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/マイページ /);
            // Expect URL is correct.
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            
            await expect(page.locator('#email')).toHaveText('ichiro@example.com');
            await expect(page.locator('#rank')).toHaveText('プレミアム会員');
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }  
    });

    test('ログイン成功2:一般会員', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', process.env.MAIL2 || '');
            await typing(page, 'パスワード', process.env.PASSWORD2 || '');
            await page.locator('#login-button').click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/マイページ /);
            // Expect URL is correct.
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            
            await expect(page.locator('#email')).toHaveText('sakura@example.com');
            await expect(page.locator('#rank')).toHaveText('一般会員');
            await console.log('OK')
        }catch(error){
            await console.log('NG', error);
        }
    });

    test('ログアウト', async ({ page }) => {
        try{
            // 改めてログイン操作
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
            await page.getByLabel('パスワード').fill(process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            // ログアウトボタン表示確認
            await expect(page.getByRole('button', {name: 'ログアウト'})).toBeVisible();
            await page.getByRole('button', {name: 'ログアウト'}).click();
            // 遷移確認
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/index.html?');

            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }  
    });
});

test.describe('マイページ @mypage', () => {
    test.describe('プレミアム会員 @premium', () => {
        test('ログイン画面 - タイトル', async ({ page }) => {
            try{
                // 改めてログイン操作
                await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
                await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
                await page.getByLabel('パスワード').fill(process.env.PASSWORD1 || '');
                await page.locator('#login-button').click();
                // 各要素
                await expect(page.locator('#email')).toHaveText('ichiro@example.com');
                await expect(page.locator('#rank')).toHaveText('プレミアム会員');
                await console.log('OK');
            }catch(error){
                await console.log('NG', error);
            }  
        });
    });

    test.describe('一般会員 @normal', () => {
        test('ログイン画面 - タイトル', async ({ page }) => {
            try{
                // 改めてログイン操作
                await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
                await page.getByLabel('メールアドレス').fill(process.env.MAIL2 || '');
                await page.getByLabel('パスワード').fill(process.env.PASSWORD2 || '');
                await page.locator('#login-button').click();
                // 各要素
                await expect(page.locator('#email')).toHaveText('sakura@example.com');
                await expect(page.locator('#rank')).toHaveText('一般会員');
                await console.log('OK');
            }catch(error){
                await console.log('NG', error);
            }  
        });
    });
});

test.describe('会員登録 @signup', () => {
    test('会員登録画面', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('link',{ name: '会員登録' }).click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/会員登録 /);
            // Expect URL is correct./
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/signup.html');
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }
    });


});

test.describe('宿泊予約 @reserve', () => {
    test('宿泊プラン一覧画面 @plans', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('link', { name: '宿泊予約' }).click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/宿泊プラン一覧 /);
            // Expect URL is correct./
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/plans.html');
            await console.log('OK');
        }catch(error){
            await console.log('NG', error);
        }
    });


});

/*
    非推奨になったtype関数の疑似的実装
    動的に入力を見たいときに使う。特に懸念なければfillでいい
    labelは、label名で取得する
    placeholderがあればそれを選択しても良い
*/
async function typing(page:Page, label:string, params:string) {
    for(const char of params){
        await page.getByLabel(label).press(char);
        await page.waitForTimeout(50);
    }
}