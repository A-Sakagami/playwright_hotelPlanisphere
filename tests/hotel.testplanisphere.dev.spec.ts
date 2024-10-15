import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';


/** 
 * This site: Copyright (c) 2020-2021 Takeshi Kishi
 * Testcode: sakagami@genz.jp
*/


dotenv.config();

// test.beforeAll(async() => {
//     // テストした回数を記録して、エビデンスフォルダを新しく切る　を実装したい
// });

// test.afterAll(async() => {

// });

test.describe('トップページ @home', () => {
    test('タイトル確認', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            // ある文字列を含むタイトルを期待値としたい場合、スラッシュで囲う
            await expect(page).toHaveTitle(/HOTEL PLANISPHERE /);
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png` });
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログイン前ヘッダー確認', async({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible();
            await expect(page.getByRole('link', { name: '宿泊予約' })).toBeVisible();
            await expect(page.getByRole('link', { name: '会員登録' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'マイページ' })).not.toBeVisible();
            await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'ログアウト' })).not.toBeVisible();
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });


});

test.describe('ログイン @login', () => {
    test('ログイン画面', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button',{ name: 'ログイン' }).click();
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/ログイン /);
            // Expect URL is correct./
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/login.html');
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログインエラー1:メールアドレス不正', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            // メールアドレス形式不正は多岐にわたります。
            // 一例として、@重複で試しています。
            await page.getByLabel('メールアドレス').fill('ichiro@@example.com');
            await page.getByLabel('パスワード').fill(process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            await expect(page.getByText('メールアドレスを入力してください。')).toBeVisible();
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログインエラー2:パスワード間違い', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
            await page.getByLabel('パスワード').fill(process.env.MAIL4 || '');
            await page.locator('#login-button').click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            // メッセージ文言が重複しているため、一例としてセレクターで区別してアサーションをとっています。
            // getByTextだと、「2つあって区別できない」とエラーが返ります（うまいやり方があるかもしれない）
            await expect(page.locator('#email-message')).toHaveText('メールアドレスまたはパスワードが違います。');
            await expect(page.locator('#password-message')).toHaveText('メールアドレスまたはパスワードが違います。');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログインエラー3:メールアドレス未入力', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            // await typing(page, 'メールアドレス', process.env.MAIL1 || '');
            await page.getByLabel('パスワード').fill(process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            await expect(page.locator('#email-message')).toHaveText('このフィールドを入力してください。');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });
    
    test('ログインエラー4:パスワード未入力', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
            // await typing(page, 'パスワード', '');
            await page.locator('#login-button').click();
            await expect(page.locator('#password-message')).toHaveText('このフィールドを入力してください。');
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログインエラー5:すべて未入力', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            // await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
            // await page.getByLabel('パスワード').fill('passwords');
            await page.locator('#login-button').click();
            // メッセージ文言が重複しているため、一例としてセレクターで区別してアサーションをとっています。
            // getByTextだと、2つあって区別できないとエラーが返ります（うまいやり方があるかもしれない）
            await expect(page.locator('#email-message')).toHaveText('このフィールドを入力してください。');
            await expect(page.locator('#password-message')).toHaveText('このフィールドを入力してください。');
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログイン成功1:プレミアム会員', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', process.env.MAIL1 || '');
            await typing(page, 'パスワード', process.env.PASSWORD1 || '');
            await page.locator('#login-button').click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/マイページ /);
            // Expect URL is correct.
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            
            await expect(page.locator('#email')).toHaveText('ichiro@example.com');
            await expect(page.locator('#rank')).toHaveText('プレミアム会員');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }  
    });

    test('ログイン成功2:一般会員', async ({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
            await typing(page, 'メールアドレス', process.env.MAIL2 || '');
            await typing(page, 'パスワード', process.env.PASSWORD2 || '');
            await page.locator('#login-button').click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/マイページ /);
            // Expect URL is correct.
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            
            await expect(page.locator('#email')).toHaveText('sakura@example.com');
            await expect(page.locator('#rank')).toHaveText('一般会員');
            await console.log('OK')
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('ログイン後ヘッダー確認', async({ page }, testInfo) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/', { waitUntil: 'domcontentloaded' });
            await page.getByRole('button',{ name: 'ログイン' }).click();
            await page.getByLabel('メールアドレス').fill(process.env.MAIL3 || '');
            await page.getByLabel('パスワード').fill(process.env.PASSWORD3 || '');
            await page.locator('#login-button').click();
            await page.getByRole('button', { name: 'ログアウト' }).waitFor({ state: "visible" });
            await page.getByRole('link', { name: 'ホーム' }).click();
            await page.screenshot({ path: `screen-shots/${testInfo.title}.png`});
            await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible();
            await expect(page.getByRole('link', { name: '宿泊予約' })).toBeVisible();
            await expect(page.getByRole('link', { name: '会員登録' })).not.toBeVisible();
            await expect(page.getByRole('link', { name: 'マイページ' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'ログイン' })).not.toBeVisible();
            await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
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
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }  
    });
});

test.describe('マイページ @mypage', () => {
    test.describe('プレミアム会員 @premium', () => {
        test('ログイン画面 - タイトル', async ({ page }, testInfo) => {
            try{
                // 改めてログイン操作
                await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
                await page.getByLabel('メールアドレス').fill(process.env.MAIL1 || '');
                await page.getByLabel('パスワード').fill(process.env.PASSWORD1 || '');
                await page.locator('#login-button').click();
                await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
                // キー要素をチェック
                await expect(page.locator('#email')).toHaveText('ichiro@example.com');
                await expect(page.locator('#rank')).toHaveText('プレミアム会員');
                await console.log('OK');
            }catch(error){
                console.error('An error occurred');
                throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
            }  
        });
    });

    test.describe('一般会員 @normal', () => {
        test('ログイン画面 - タイトル', async ({ page }, testInfo) => {
            try{
                // 改めてログイン操作
                await page.goto('https://hotel.testplanisphere.dev/ja/login.html', { waitUntil: 'domcontentloaded' });
                await page.getByLabel('メールアドレス').fill(process.env.MAIL2 || '');
                await page.getByLabel('パスワード').fill(process.env.PASSWORD2 || '');
                await page.locator('#login-button').click();
                await page.screenshot({ path: `screen-shots/${testInfo.title}.png`, fullPage: true });
                // キー要素をチェック
                await expect(page.locator('#email')).toHaveText('sakura@example.com');
                await expect(page.locator('#rank')).toHaveText('一般会員');
                await console.log('OK');
            }catch(error){
                console.error('An error occurred:', error);
                throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
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
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('必須項目入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || ''); 
            await page.locator('#password-confirmation').fill(process.env.EDIT_PASSWORD || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('項目全入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            // メールアドレス
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            // パスワード（8文字以上）
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            // パスワード確認
            await page.locator('#password-confirmation').fill(process.env.EDIT_PASSWORD || '');
            // 氏名
            await page.getByLabel('氏名').fill('坂上 太郎');


            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー1:メールアドレス未入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.EDIT_PASSWORD || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page.locator('#signup-form > div:nth-child(1) > div')).toBeVisible();
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー2.1:パスワード未入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password-confirmation').fill(process.env.EDIT_PASSWORD || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー2.2:パスワード確認未入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー2.3:パスワード不一致', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.PASSWORD1 || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー2.4:短いパスワード', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.TOO_SHORT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.TOO_SHORT_PASSWORD || '');
            await page.getByLabel('氏名').fill('坂上 太郎'); 
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー3:氏名未入力', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.PASSWORD1 || '');
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー4.1:電話番号10桁', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.PASSWORD1 || '');
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });

    test('エラー4.2:電話番号12桁', async ({ page }) => {
        try{
            await page.goto('https://hotel.testplanisphere.dev/ja/signup.html', { waitUntil: 'domcontentloaded' });
            await page.getByLabel('メールアドレス').fill(process.env.EDIT_MAIL || '');
            await page.locator('#password').fill(process.env.EDIT_PASSWORD || '');
            await page.locator('#password-confirmation').fill(process.env.PASSWORD1 || '');
            await page.locator('#signup-form > button').click();
            await expect(page).toHaveURL('https://hotel.testplanisphere.dev/ja/mypage.html');
            await console.log('OK');
        }catch(error){
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
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
            console.error('An error occurred');
            throw new Error(`次の理由により、テストに失敗しました: ${error.message}`);
        }
    });


});

/*
    非推奨になったtype関数の疑似的実装
    動的に入力を見たいときに使えます。特に懸念なければfillでいいです
    labelは、label名で取得します
    placeholderがあればそれを選択しても良いでしょう
*/
async function typing(page:Page, label:string, params:string) {
    for(const char of params){
        await page.getByLabel(label).press(char);
        await page.waitForTimeout(50);
    }
}