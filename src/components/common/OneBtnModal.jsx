import { useNavigate } from "react-router-dom";
import modalStore from "../../store/modalStore.js";

export default function OneBtnModal({ type, userId }) {
  // ✅ 버튼 별 메세지 선택
  const choiceYes = (type, userId) => {
    switch (type) {
      case "ban" :
        return `${userId}를 차단 했습니다.`
      case "unBan" :
        return `${userId}를 차단 해제했습니다.`
      case "report" :
        return `${userId}를 신고 하였습니다.`
      case "unReport" :
        return `${userId}를 신고 해제했습니다.`
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
      case "signUp" :
        signUp()
        break
      case "signIn" :
        signIn()
        break
      case "logOut" :
        await logOut()
        break
      default:
        modalStore.closeModal()
    }
  }
  const navigate = useNavigate();
  // ✅ 타입별 실행 변수
  // 차단하시겠습니까? `예` 인경우
  // 회원가입이 완료된 경우? `예` 인경우
  const signUp = () => {
    modalStore.closeModal()
    navigate("/account")
  }
  // 로그인이 완료된 경우? `예` 인경우
  const signIn = () => {
    modalStore.closeModal()
    navigate("/")
    // onClose()
  }
  const logOut = async () => {
    modalStore.closeModal()
    navigate("/")
  };
  return (
    <>
      <div>
        {choiceYes(type, userId)}
      </div>
      <div className="flex gap-8 justify-center">
        <button onClick={() => check(type)}>확인</button>
      </div>
    </>
  )
}

