import { makeAutoObservable } from "mobx";

class AuthStore {
  loggedIn = false;
  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
    this.checkLoggedIn(); // 새로고침 시 로그인 상태 불러오기
  }

  setLoggedIn(status) {
    this.loggedIn = status;
  }
  setIsAdmin(status) {
    this.isAdmin = status;
  }

  checkLoggedIn() {
    this.loggedIn = !!localStorage.getItem("token");
  }
}

const authStore = new AuthStore();
export default authStore;
