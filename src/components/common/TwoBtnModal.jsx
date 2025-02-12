import modalStore from "../../store/modalStore.js";
import axios from "axios";
import visitStore from "../../store/visitStore.js";
import { useNavigate } from "react-router-dom";
import authStore from "../../store/authStore.js";

export default function TwoBtnModal({ type, userId }) {
  // ✅ 버튼 별 메세지 선택
  console.log(userId);
  const navigate = useNavigate();

  const choiceMessage = (type, userId) => {
    switch (type) {
      case "ban":
        return `정말 ${userId}을 차단 하시겠습니까?`;
      case "unBan":
        return `정말 ${userId}을 차단 해제 하시겠습니까?`;
      case "report":
        return `정말 ${userId}을 신고 하시겠습니까?`;
      case "unReport":
        return `정말 ${userId}을 신고 해제 하시겠습니까?`;
      case "logOut":
        return `정말 로그아웃 하시겠습니까?`;
      default:
        return "정말 실행하시겠습니까?"; // 기본 메시지 추가
    }
  };

  // "예" 버튼 클릭 시 OneBtnModal 표시
  const handleYesClick = async (type, userId) => {
    switch (type) {
      case "ban":
      case "unBan":
      case "report":
      case "unReport":
        await changeState(type, userId);
        break;
      case "logOut":
        await logOut();
        break;
      default:
        console.error(`handleYesClick: Unknown type "${type}"`);
    }
  };

  const changeState = async (type, userId) => {
    try {
      let response;
      if (type === "ban") {
        response = await axios.post(`/ban?bannedId=${userId}`); // 차단 요청
      } else if (type === "unBan") {
        response = await axios.delete(`/ban?bannedId=${userId}`); // 차단 해제 요청
      } else if (type === "report") {
        response = await axios.post(`/report?reportedId=${userId}`); // 신고 요청
      } else if (type === "unReport") {
        response = await axios.delete(`/report?reportedId=${userId}`); // 신고 해제 요청
      }
      if (response.status === 200) {
        await visitStore.fetchVisitData();
        modalStore.openModal("oneBtn", { type, userId });
      }
    } catch (error) {
      console.error("서버 요청 실패:", error);
    }
  };

  // 로그아웃하시겠습니까? `예` 인경우
  const logOut = async () => {
    try {
      const accessToken = window.localStorage.getItem("token"); // 저장된 토큰 가져오기

      if (!accessToken) {
        console.error("로그아웃 요청 실패: 토큰이 없습니다.");
        return;
      }

      const response = await axios.post(
        "/users/signout",
        {}, // 본문 필요 없음
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            "Content-Type": "application/json",
          },
        }
      );

      console.log("로그아웃 응답 데이터:", response.data);

      // 토큰값 제거
      window.localStorage.removeItem("token"); // token 삭제
      authStore.setLoggedIn(false);
      modalStore.closeModal();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 요청 실패!:", error);
    }
  };
  return (
    <>
      <div>
        {/* 클릭한 요소별 다른 메세지 전달 */}
        {choiceMessage(type, userId)}
      </div>
      <div className="flex gap-8 justify-center">
        <button
          onClick={() => modalStore.closeModal()}
          className="h-full px-4 flex items-center"
        >
          아니요
        </button>
        {/* "예" 클릭 시 상태 변경 */}
        <button
          className="h-full px-4 flex items-center"
          onClick={() => handleYesClick(type, userId)}
        >
          예
        </button>
      </div>
    </>
  );
}
