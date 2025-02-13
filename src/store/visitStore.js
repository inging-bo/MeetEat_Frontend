import { makeAutoObservable } from "mobx";
import axios from "axios";

const createVisitStore = () => {
  const store = {
    visit: { content: [] },

    async fetchVisitData(page) {
      try {
        const response = await axios.get("/matching/history", {
          params: { page, size: 20 }
        });
        if (page === 0) {
          store.visit = response.data;
        } else {
          store.visit.content = [...store.visit.content, ...response.data.content];
        }
      } catch (error) {
        console.error("방문 기록을 가져오는데 실패했습니다", error);
      }
    },
  };

  return makeAutoObservable(store);
};

const visitStore = createVisitStore();
export default visitStore;
