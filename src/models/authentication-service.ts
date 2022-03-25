import environment from "environment";
import { User } from "./user";
import {computedFrom} from 'aurelia-framework';
export let afterLogin: string = "";

export class AuthenticationService {
  public user: User | null = null;

  public login(usernameOrEmail: string, password: string) {
    const body = JSON.stringify( { usernameOrEmail: usernameOrEmail, password: password } )
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch(environment.BASE_URL + "/login", { method: 'POST', headers: headers, body: body, mode: 'cors', credentials: 'include' })
    .then(response => response.json())
    .then((json) => {
      if (json.result == "ok") {
        this.user = json.account;
        return true;
      } else {
        this.user = null;
        return false;
      }
    });
  }

  constructor() {
    // セッションの死活を取得し、生きているならユーザー情報を持っておく。
    this.syncLoginStatus(true);

    // 別タブでログインした場合は認証情報を取る。
    window.addEventListener('storage', (event: any) =>{
      if (event.key == 'stjjaic-event-login') { 
        this.syncLoginStatus();
      }
    });

    // 別タブでログアウトした場合は検索画面に飛ばす。
    window.addEventListener('storage', function(event){
      if (event.key == 'stjjaic-event-logout') { 
        location.reload();
      }
    });
  }

  checked = false;
  // セッションの生死に関わらずログインしたことがあるか
  @computedFrom("user")
  public get hasLogin() {
    return this.user != null;
  }

  // セッションが生きているか
  public syncLoginStatus(shouldEmit?: boolean) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return fetch(environment.BASE_URL + "/session", { method: 'POST', headers: headers, body: "", mode: 'cors', credentials: 'include' })
    .then(response => response.json()).then(json => {
      this.checked = true;
      if (json.alive) {
        this.user = json.account;
        if (shouldEmit) {
          // 別タブにログインを通知する
          localStorage.setItem('stjjaic-event-login', 'login' + Math.random());

          // ログイン前のURLに飛ばす
          const previousUrl = localStorage.getItem('stjjaic-tmp-url-before-login');
          if (previousUrl) {
            localStorage.removeItem('stjjaic-tmp-url-before-login');
            location.href = previousUrl;
          }
        }
        return true;
      } else {
        this.user = null;
        return false;
      }
    })
  }

  public logout() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch(environment.BASE_URL + "/logout", { method: 'POST', headers: headers, mode: 'cors', credentials: 'include' })
    .then(response => {
      // todo: 異常系を考える

      // 認証情報をフロントから消す
      this.user = null;
      // localStorage経由で別タブにもログアウトを通知する
      localStorage.setItem('stjjaic-event-logout', 'logout' + Math.random());
      // 検索画面に飛ばす
      location.href = environment.BASE_URL_FRONT + "/search_cards";
    });
  }

  public saveUrlBeforeLogin() {
    localStorage.setItem('stjjaic-tmp-url-before-login', location.href);
    location.href = environment.BASE_URL_FRONT + "#/login";
  }
}

export const authenticationService = new AuthenticationService();
