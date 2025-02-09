import OneBtnModal from "./OneBtnModal.jsx";
import { useEffect, useRef, useState } from "react";

export default function TwoBtnModal({ type, userId, onClose }) {
  const twoModalRef = useRef(null);
  // 모달이 열릴 때 이벤트 리스너 추가, 닫힐 때 제거
  useEffect(() => {
    // 배경 클릭 시 모달 닫기
    const handleOuterClick = (e) => {
      // twoModalRef.current가 존재하고, 클릭한 요소가 twoModalRef.current 내부가 아닐 때만 닫기
      if (twoModalRef.current && !twoModalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOuterClick);
    return () => document.removeEventListener("mousedown", handleOuterClick);
  }, [onClose]);

  // ✅ 버튼 별 메세지 선택
  const choiceMessage = (type) => {
    switch (type) {
      case "block":
        return "정말 차단 하시겠습니까?";
      case "unBlock":
        return "정말 차단 해제 하시겠습니까?";
      case "report":
        return "정말 신고 하시겠습니까?";
      case "unReport":
        return "정말 신고 해제 하시겠습니까?";
      case "logOut":
        return "정말 로그아웃 하시겠습니까?";
      default:
        return "정말 실행하시겠습니까?"; // 기본 메시지 추가
    }
  };

  // ✅ 예 클릭시 모달 구현 위한 곳
  const [showOneBtnModal, setShowOneBtnModal] = useState(false);

  // "예" 버튼 클릭 시 OneBtnModal 표시
  const handleYesClick = (type) => {
    switch (type) {
      case "block" :
        blockUser(userId)
        break
      case "unBlock" :
        blockUser(userId)
        break
      case "report" :
        reportUser(userId)
        break
      case "unReport" :
        reportUser(userId)
        break
      case "logOut" :
        logOut()
        break
    }
    setShowOneBtnModal(true);
  };

  // 1️⃣ localStorage에서 데이터 가져오기
  const restaurantReviews = localStorage.getItem("restaurantReviews");

  // 2️⃣ JSON 파싱
  const parse = JSON.parse(restaurantReviews);

  // ✅ 타입별 실행 변수
  // 차단하시겠습니까? `예` 인경우
  const blockUser = () => {
    // 3️⃣ 특정 userId를 찾아 blcok 값을 변경
    const updatedBlock = parse.map(rest => {
      return {
        ...rest,
        visitors: rest.visitors.map(visitor =>
          visitor.id === userId ? { ...visitor, block: !visitor.block } : visitor
        )
      };
    })
    // 4️⃣ 변경된 데이터를 다시 localStorage에 저장
    localStorage.setItem("restaurantReviews", JSON.stringify(updatedBlock));
  }
  // 신고하시겠습니까? `예` 인경우
  const reportUser = (userId) => {
    // 3️⃣ 특정 userId를 찾아 report 값을 변경
    const updatedReport = parse.map(rest => {
      return {
        ...rest,
        visitors: rest.visitors.map(visitor =>
          visitor.id === userId ? { ...visitor, report: !visitor.report } : visitor
        )
      };
    });

    // 4️⃣ 변경된 데이터를 다시 localStorage에 저장
    localStorage.setItem("restaurantReviews", JSON.stringify(updatedReport));

    // console.log("Updated Data:", updatedBen); // 확인용
  };
  // 로그아웃하시겠습니까? `예` 인경우
  const logOut = () => {
  }
  return (
    <>
      {!showOneBtnModal ? (
        <div
          className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full"
        >
          <div className="w-80 p-10 min-w-fit bg-white rounded-lg drop-shadow-lg"
               ref={twoModalRef} // 모달 내부 요소 참조
          >
            <div>
              {/* 클릭한 요소별 다른 메세지 전달 */}
              {choiceMessage(type)}
            </div>
            <div className="flex gap-8 justify-center">
              <button onClick={onClose}>아니요</button>
              <button onClick={() => handleYesClick(type)}>예</button>
              {/* "예" 클릭 시 상태 변경 */}
            </div>
          </div>
        </div>
      ) : (
        // OneBtnModal 표시
        <OneBtnModal type={type} onClose={onClose}/>
      )}
    </>
  )
}