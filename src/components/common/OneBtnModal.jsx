import { useNavigate } from "react-router-dom";
import axios from "axios";
import modalStore from "../../store/modalStore.js";

export default function OneBtnModal({ type, userId }) {

  // ✅ 버튼 별 메세지 선택
  const choiceYes = (type) => {
    switch (type) {
      case "block" :
        return "사용자를 차단 했습니다."
      case "unBlock" :
        return "사용자를 차단 해제했습니다."
      case "report" :
        return "사용자를 신고 하였습니다."
      case "unReport" :
        return "사용자를 신고 해제했습니다."
      case "signUp" :
        return (
          <>
            회원가입이 완료되었어요. <br/>
            로그인 후 근처 이웃들과 식사를 즐겨보세요.
          </>
        );
      case "signIn" :
        return (
          <>
            로그인이 완료되었어요. <br/>
            이웃들과 식사를 즐겨보세요.
          </>
        );

      case "logOut" :
        return "로그아웃 되었습니다."
    }
  }
  // ✅ 확인 눌러을 때 동작
  const check = async (type) => {
    switch (type) {
      case "block" :
        blockUser()
        break
      case "unBlock" :
        blockUser()
        return
      case "report" :
        reportUser()
        break
      case "unReport" :
        reportUser()
        return
      case "signUp" :
        signUp()
        break
      case "signIn" :
        signIn()
        break
      case "logOut" :
        await logOut()
        break

    }
  }
  const navigate = useNavigate();
  // ✅ 타입별 실행 변수
  // 차단하시겠습니까? `예` 인경우
  const blockUser = () => {
    // onClose()
  }
  // 신고하시겠습니까? `예` 인경우
  const reportUser = () => {
    // onClose()
  };
  // 회원가입이 완료된 경우? `예` 인경우
  const signUp = () => {
    navigate("/account")
    // onClose()
  }
  // 로그인이 완료된 경우? `예` 인경우
  const signIn = () => {
    modalStore.closeModal()
    navigate("/")
    // onClose()
  }
  const logOut = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken"); // 저장된 토큰 가져오기

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
      window.localStorage.removeItem("accessToken"); // accessToken 삭제
      navigate("/");
      modalStore.closeModal()
    } catch (error) {
      console.error("로그아웃 요청 실패!:", error);
    }
  };
  return (
    <>
      <div>
        {choiceYes(type)}
      </div>
      <div className="flex gap-8 justify-center">
        <button onClick={() => check(type)}>확인</button>
      </div>
    </>
  )
}

