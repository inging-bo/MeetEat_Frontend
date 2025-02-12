import { makeAutoObservable } from "mobx";

class AuthStore {
  loggedIn = false;
  isAdmin = false;
  constructor() {
    makeAutoObservable(this);
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
