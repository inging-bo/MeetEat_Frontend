import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";
import modalStore from "../../store/modalStore.js";
import visitStore from "../../store/visitStore.js";

const RestReviews = observer(() => {
  useEffect(() => {
    visitStore.fetchVisitData();
  }, []);

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

  // ✅ 모달 열고 닫기 함수
  const toggleModal = (type, userId ) => {
    modalStore.openModal("twoBtn", { type, userId });
    setActivePopOver(null);
  };

  const banOrReport = (visitor) => {
    if (visitor.report && visitor.ban) {
      return (
        <>
          <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">
            신고 유저
          </span>
          <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">
            차단 유저
          </span>
        </>
      );
    } else if (visitor.ban) {
      return (
        <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">
          차단 유저
        </span>
      );
    } else if (visitor.report) {
      return (
        <span className="ml-2 px-1.5 py-0.5 bg-[#FFACAC] text-[#E62222] rounded-md whitespace-nowrap">
          신고 유저
        </span>
      );
    }
  };

  // 매칭 횟수별 메달 표시
  const viewMedal = (matchingCount) => {
    if (matchingCount >= 5) {
      return <GoldMedal width="16px" height="16px" />;
    } else if (matchingCount >= 3) {
      return <SilverMedal width="16px" height="16px" />;
    } else if (matchingCount >= 1) {
      return <BronzeMedal width="16px" height="16px" />;
    } else {
      return <></>;
    }
  };

  return (
    <div className="flex flex-col gap-10 flex-auto min-w-fit border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl py-10 px-14">
      <p className="font-bold text-[28px] text-left">나의 방문기록</p>
      <ul className="flex flex-col flex-1 gap-4 overflow-y-scroll scrollbar-hide">
        {visitStore.visit.length > 0 ? (
          visitStore.visit.map((visitItem) => (
            <li key={visitItem.id} className="flex flex-col gap-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-shrink-0 items-end">
                  <span>{visitItem.place_name}</span>
                  <span className="text-sm text-gray-400 pl-2">
                    {visitItem.category_name}
                  </span>
                </div>
                <span className="flex flex-shrink-0 text-[15px] text-[#909090] border border-[#909090] px-1.5 rounded-md">
                  {visitItem.myReview ? (
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
                    className="relative flex text-sm justify-between items-center bg-[#F8F8F8] flex-[1_1_calc(50%-5px)] p-3 rounded-lg"
                  >
                    <div className="w-full flex flex-col gap-1">
                      <div className="flex gap-0.5">
                        <p className="whitespace-nowrap">{visitor.nickname}</p>
                        <div className="flex flex-1 flex-shrink-0 items-center">
                          <div>{viewMedal(visitor.matchingCount)}</div>
                          {banOrReport(visitor)}
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
                          ref={popOverRef}
                          className="absolute flex flex-col gap-1 z-50 top-10 right-1 bg-white p-2 border border-gray-300 rounded-lg"
                        >
                          {visitor.ban ? (
                            <button
                              onClick={() => toggleModal("unBan", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              차단해제
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("ban", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              차단하기
                            </button>
                          )}

                          {visitor.report ? (
                            <button
                              onClick={() => toggleModal("unReport", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              신고해제
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("report", visitor.id)}
                              className="py-1 px-2 rounded-lg hover:bg-gray-200"
                            >
                              신고하기
                            </button>
                          )}
                          <div className="absolute -top-1.5 right-3 rotate-45  w-2.5 h-2.5 bg-white border-l border-t border-gray-300"></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <div className="text-2xl text-gray-500">방문한 식당이 없습니다.</div>
        )}
      </ul>
    </div>
  );
});

export default RestReviews;
