// profile.js
import { useLocalObservable } from "mobx-react-lite";
import { observable, action, runInAction } from "mobx";
import axios from "axios";

const useProfileStore = () => {
  const store = useLocalObservable(() => ({
    profile: null,

    fetchProfile: action(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BE_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        runInAction(() => {
          store.profile = response.data;
        });
      } catch (error) {
        console.error("프로필 정보를 가져오는 데 실패했습니다.", error);
      }
    }),
  }));

  return store;
};

// 기본 내보내기
export default useProfileStore;
