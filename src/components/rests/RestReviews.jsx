import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TwoBtnModal from "../common/TwoBtnModal.jsx";
import axios from "axios";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";

export default function RestReviews() {
  // ✅ 확인용 방문 히스토리
  const [visit, setVisit] = useState([])


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/restaurants/myreview", {
          matchingHistoryId: 1,
        });
        setVisit(response.data);
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다", error);
      }
    };
    fetchProfile();
  }, []); // 🔥 최초 한 번만 실행

  // ✅ 신고하기 차단하기 팝오버 창 표시
  // 클릭된 요소의 ID를 관리
  const [activePopOver, setActivePopOver] = useState(null);
  const popOverRef = useRef(null); // 현재 열린 popOver의 ref

  // 팝오버 토글 함수
  const popOver = (id) => {
    setActivePopOver(activePopOver === id ? null : id);
  };

  // 외부 클릭 감지하여 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popOverRef.current && !popOverRef.current.contains(event.target)) {
        setActivePopOver(null);
      }
    };
    if (activePopOver !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopOver]);

  // ✅ 차단, 신고 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 차단 or 신고 구분
  const [userId, setUserId] = useState(null); // 차단 or 신고 구분

  // ✅ 모달 열고 닫기 함수
  const toggleModal = (type, id) => {
    setModalType(type); // 클릭한 버튼의 타입 저장
    setIsModalOpen(true);
    setActivePopOver(null);
    setUserId(id);
  };

  // 수정 을 다시 좀 했습니다.
  const [showOneBtnModal, setShowOneBtnModal] = useState(false);

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


  // ✅ 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setShowOneBtnModal(false);
  };

  // ✅ 차단 or 신고 표시
  const benOrBlock = (visitor) => {
    if (visitor.report === true && visitor.block === true) {
      return (
        <>
          <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">신고 유저</span>
          <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">차단 유저</span>
        </>
      );
    } else if (visitor.block === true) {
      return <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">차단 유저</span>;
    } else if (visitor.report === true) {
      return <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">신고 유저</span>;
    }
  };

  // 매칭 횟수별 메달 표시
  const viewMedal = (matchingCount) => {
    if (matchingCount >= 5) {
      return (
        <GoldMedal width="16px" height="16px"/>
      )
    } else if (matchingCount >= 3) {
      return (
        <SilverMedal width="16px" height="16px"/>
      )
    } else if (matchingCount >= 1) {
      return (
        <BronzeMedal width="16px" height="16px"/>
      )
    } else {
      return (
        <></>
      )
    }
  }

  return (
    <div
      className="flex flex-col gap-10 flex-auto min-w-fit border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl py-10 px-14">
      <p className="font-bold text-[28px] text-left">나의 방문기록</p>
      {/* 식당 별 매칭 히스토리 박스*/}
      <ul className="flex flex-col flex-1 gap-4 overflow-y-scroll scrollbar-hide">
        {/* 방문한 식당이 있으면 방문 한 식당 히스토리 표시*/}
        {visit.length > 0 ? (
          // 같이 방문한 사람들 리스트 표시
          visit.map((visitItem) => (
            <li
              key={visitItem.id}
              className="flex flex-col gap-4 rounded-2xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-shrink-0 items-end">
                  <span>{visitItem.place_name}</span>
                  <span className="text-sm text-gray-400 pl-2">
                    {visitItem.category_name}
                  </span>
                </div>
                <span
                  className="flex flex-shrink-0 text-[15px] text-[#909090] border border-[#909090] px-1.5 rounded-md">
                  {visitItem.myReview === true ? (
                    <Link>리뷰 확인하기</Link>
                  ) : (
                    <Link>리뷰 작성하기</Link>
                  )}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2.5">
                {visitItem.visitors.map((visitor) => (
                  <li
                    key={visitor.id}
                    className={`relative flex text-sm justify-between items-center bg-[#F8F8F8] flex-[1_1_calc(50%-5px)] p-3 rounded-lg`}
                  >
                    <div className="w-full flex flex-col gap-1">
                      <div className="flex gap-0.5">
                        <p className="whitespace-nowrap">
                          {visitor.nickname}
                        </p>
                        <div className="flex flex-1 flex-shrink-0 items-center">
                          <div>{viewMedal(visitor.matchingCount)}</div>
                          {benOrBlock(visitor)}
                        </div>
                      </div>
                      <div className="text-left text-[#555555]">
                        {visitor.description}
                      </div>
                    </div>
                    <div>
                      <p
                        className="font-bold tracking-[-0.15rem] [writing-mode:vertical-rl] cursor-pointer"
                        onClick={() => popOver(visitor.id)}
                      >
                        ···
                      </p>
                      {activePopOver === visitor.id && (
                        <div
                          ref={popOverRef} // ✅ popOverRef 설정
                          className="absolute flex flex-col gap-1 z-50 top-10 right-1 bg-white p-2 border border-gray-300 rounded-lg"
                        >
                          {visitor.block === false ? (
                            <button
                              onClick={() => toggleModal("block", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              차단하기
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("unBlock", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              차단해제
                            </button>
                          )}
                          {visitor.report === false ? (
                            <button
                              onClick={() => toggleModal("report", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              신고하기
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("unReport", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              신고해제
                            </button>
                          )}
                          <div
                            className="absolute -top-1.5 right-3 rotate-45  w-2.5 h-2.5 bg-white border-l border-t border-gray-300">
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          /* 방문한 식당이 없을 때 보일 화면 */
          <div className="text-2xl text-gray-500">방문한 식당이 없습니다.</div>
        )}
      </ul>

      {/* 모달이 열려 있을 때만 표시 */}
      {/* {isModalOpen && (
        <TwoBtnModal type={modalType} userId={userId} onClose={closeModal} />
      )} */}

      {/* 아래부분 컴포넌트화 필요 */}
      {isModalOpen && (
        <div className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full">
          {!showOneBtnModal ? (
            <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg">
              <div>정말{modalType}하시겠습니까?</div>
              <div className="flex closeModal(true)-8 justify-center">
                <button onClick={closeModal}>아니요</button>
                <button onClick={() => changeState(modalType, userId)}>
                  예
                </button>
              </div>
            </div>
          ) : (
            <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg">
              <div>사용자를{modalType}했습니다.</div>
              <div className="flex gap-8 justify-center">
                <button onClick={closeModal}>확인</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
