import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authStore from "../../store/authStore";

export default function DeleteID() {
  const navigate = useNavigate();
  // 로그인 확인
  useEffect(() => {
    authStore.checkLoggedIn();
    !authStore.loggedIn && alert("로그인 후 이용해주세요!");
    !authStore.loggedIn && window.location.replace("/");
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BE_API_URL}/users/withdrawal`);

      if (response) {
        navigate("/successnotice", {
          state: { message: "탈퇴가 완료되었습니다." },
        });
        window.localStorage.removeItem("token");
        authStore.setLoggedIn(false);
      }
    } catch (e) {
      alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-red-600">!</p>
        <p className="text-red-600">탈퇴 시 모든 정보가 삭제됩니다.</p>
        <p className="text-red-600">정말로 탈퇴하시겠습니까?</p>
      </div>
      <div className="bg-gray-300 p-5">탈퇴 약관</div>
      <div className="flex gap-8 justify-center">
        <button onClick={() => navigate("/mypage")}>아니오</button>
        <button onClick={handleDelete}>예</button>
      </div>
    </div>
  );
}
