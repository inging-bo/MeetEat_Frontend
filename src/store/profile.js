import { makeAutoObservable } from "mobx";
import axios from "axios";

const createProfileStore = () => {
  const store = {
    visit: [],

    async fetchProfileData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_API_URL}/users/profile`, {});
        store.profile = response.data;
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다", error);
      }
    },
  };

  return makeAutoObservable(store);
};

const profileStore = createProfileStore();
export default profileStore;
