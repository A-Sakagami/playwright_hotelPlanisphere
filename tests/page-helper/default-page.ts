import { expect, Page } from '@playwright/test'

/*
    Page Object Modelでは画面のヘルパーを作り、やりたいことを抽象化したメソッドを提供します。
    テストコードなので、チームによっては英語以外の言語を利用した方が捗るケースもあります。
    メソッド名は日本語でも通るので、プログラミング未経験者でも実際のテストコードも読みやすくなります。
    余裕があれば適宜実装してみたいと思います。
    引用・参照：https://note.com/navitime_tech/n/n61063b9e8fab
    https://playwright.dev/docs/pom
*/
export class DefaultPage {
    public readonly page: Page

    constructor(page: Page) {
        this.page = page;
    }

    async トップページに遷移する(){

    }

    async ログインボタンをクリックする(){

    }

    async 会員登録をクリックする(){

    }

    async 宿泊予約をクリックする(){

    }

    async ログイン情報ichiroを入力する(){

    }

    async ログイン情報sakuraを入力する(){

    }

}

// 正しい形式と不正な形式を検出する正規表現を組み合わせて、メールアドレスのバリデーションを実装
// const rightEmailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const invalidPatterns = [
  /^.*\.\..*$/,        // 連続したドット
  /^.*@.*@.*$/,        // 複数の @ 記号
  /^\..*|.*\.$/,       // 先頭または末尾にドット
  /^.*[!#$%^&*()+=\{\}\[\]";:/\\<>?].*$/,  // 不正な文字
  /^.*\s.*$/           // スペース
];

function isValidEmail(email: string): boolean {
  if (!validEmailRegex.test(email)) return false;
  return !invalidPatterns.some(pattern => pattern.test(email));
}
