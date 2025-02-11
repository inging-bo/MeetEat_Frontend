import { useState } from "react";
import modalStore from "../../store/modalStore.js";
import axios from "axios";

export default function TwoBtnModal({ type, userId }) {
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

  // "예" 버튼 클릭 시 OneBtnModal 표시
  const handleYesClick = (type) => {
    switch (type) {
      case "block" :
        changeState(userId)
        break
      case "unBlock" :
        changeState(userId)
        break
      case "report" :
        changeState(userId)
        break
      case "unReport" :
        changeState(userId)
        break
      case "logOut" :
        logOut()
        break
    }
  };

  const changeState = async (type, id) => {
    let visitIdx = 0;
    let idIdx = 0;
    let copyArr = [...visit]; // ✅ 배열을 복사하여 변경

    visit.forEach((visitItem, idx) => {
      visitItem.visitors.forEach((item, itemIndex) => {
        if (item.id === id) {
          visitIdx = idx;
          idIdx = itemIndex;
        }
      });
    });

    const user = copyArr[visitIdx].visitors[idIdx];

    try {
      if (type === "block") {
        const newBlockState = !user.block; // 차단 상태 변경
        await axios.post(`/ban?bannedId=${id}`); // 차단 요청
        user.block = newBlockState;
      } else if (type === "unBlock") {
        const newBlockState = !user.block; // 차단 해제 상태 변경
        await axios.delete(`/ban?bannedId=${id}`); // 차단 해제 요청
        user.block = newBlockState;
      } else if (type === "report") {
        const newReportState = !user.report; // 신고 상태 변경
        await axios.post(`/report?reportedId=${id}`); // 신고 요청
        user.report = newReportState;
      } else if (type === "unReport") {
        const newReportState = !user.report; // 신고 해제 상태 변경
        await axios.delete(`/report?reportedId=${id}`); // 신고 해제 요청
        user.report = newReportState;
      }
      setVisit(copyArr); // ✅ 상태 업데이트
      setShowOneBtnModal(true);
    } catch (error) {
      console.error("서버 요청 실패:", error);
    }
  };

  // 로그아웃하시겠습니까? `예` 인경우
  const logOut = () => {
  }
  return (
    <>
      <div>
        {/* 클릭한 요소별 다른 메세지 전달 */}
        {choiceMessage(type)}
      </div>
      <div className="flex gap-8 justify-center">
        <button
          onClick={() => modalStore.closeModal()}
          className="h-full px-4 flex items-center"
        >
          아니요
        </button>
        {/* "예" 클릭 시 상태 변경 */}
        <button onClick={() => handleYesClick(type)}>예</button>
        <button
          onClick={() => modalStore.openModal("oneBtn", { type })}
          className="h-full px-4 flex items-center"
        >
          예
        </button>
      </div>
    </>
  )
}