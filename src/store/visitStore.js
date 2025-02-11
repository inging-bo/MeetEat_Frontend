import { makeAutoObservable } from "mobx";
import axios from "axios";

const createVisitStore = () => {
  const store = {
    visit: [],

    async fetchVisitData() {
      try {
        const response = await axios.get("/restaurants/myreview", {
          matchingHistoryId: 1,
        });
        store.visit = response.data;
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다", error);
      }
    },
  };

  return makeAutoObservable(store);
};

const visitStore = createVisitStore();
export default visitStore;
