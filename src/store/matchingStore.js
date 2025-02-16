import { makeAutoObservable } from "mobx";

class MatchingStore {
  isMatching = false;
  isMatched = false;
  isCompleted = false;
  matchingData = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsMatching(status) {
    this.isMatching = status;
  }
  setIsMatched(status) {
    this.isMatched = status;
  }
  setIsCompleted(status) {
    this.isCompleted = status;
  }

  checkMatching() {
    this.isMatching = window.sessionStorage.getItem("isMatching");
  }
  checkMatched() {
    this.isMatched = window.sessionStorage.getItem("isMatched");
  }
  checkCompleted() {
    this.isCompleted = !!window.sessionStorage.getItem("matchedData");
  }
}

const matchingStore = new MatchingStore();
export default matchingStore;
