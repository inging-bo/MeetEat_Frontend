import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";
import modalStore from "../../store/modalStore.js";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import RestReviewItem from "./RestReviewItem.jsx";
import ReactLoading from "react-loading";

const RestReviews = observer(() => {
  const [historyData, setHistoryData] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 무한 스크롤 관련
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [moreHistory, inView] = useInView({
    threshold: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  // ✅ 매칭 히스토리 가져오기 (4개씩 추가)
  const initialFetchHistory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BE_API_URL}/matching/history?page=0&size=4`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setHistoryData(data.content);
      setTotalPage(data.page.totalPages);
      setHasMore(data.page.totalPages > 1);
    } catch (error) {
      console.error(
        "초기 매칭 히스토리 정보를 불러오는데 실패했습니다.",
        error,
      );
      setHasMore(false);
    }
  };

  const fetchMoreHistory = async () => {
    if (page >= totalPage) {
      setHasMore(false);
      return;
    }
    console.log(page, "page");
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BE_API_URL}/matching/history?page=${page}&size=4`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setHistoryData((prevData) => {
        const newContent = { ...prevData };
        Object.keys(data.content).forEach((key) => {
          newContent[Object.keys(newContent).length] = data.content[key];
        });
        return newContent;
      });
      setPage((prevPage) => prevPage + 1);
      setHasMore(page + 1 < data.page.totalPages);
    } catch (error) {
      console.error(
        "추가 매칭 히스토리 정보를 불러오는데 실패했습니다.",
        error,
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialFetchHistory();
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      fetchMoreHistory();
    }
  }, [inView, hasMore]);
  console.log(historyData);
  console.log(page, totalPage);
  // ✅ 신고하기/차단하기 팝오버 관련 상태 및 ref
  const [activePopOver, setActivePopOver] = useState(null);
  const popOverRef = useRef(null);

  // 팝오버 토글 함수
  const popOver = (itemId, userId) => {
    const uniqueId = `${itemId}-${userId}`;
    setActivePopOver(activePopOver === uniqueId ? null : uniqueId);
  };

  // 외부 클릭 시 팝오버 닫기
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
  const toggleModal = async (type, userId, matchingId) => {
    console.log(typeof userId);
    try {
      let modalMessage = "";
      switch (type) {
        case "ban":
          modalMessage = `${userId}를 차단하시겠습니까?`;
          break;
        case "unBan":
          modalMessage = `${userId}를 차단 해제하시겠습니까?`;
          break;
        case "report":
          modalMessage = `${userId}를 신고하시겠습니까?`;
          break;
        case "unReport":
          modalMessage = `${userId}를 신고 해제하시겠습니까?`;
          break;
        default:
          modalMessage = "해당 작업을 진행하시겠습니까?";
          break;
      }

      modalStore.openModal("twoBtn", {
        message: modalMessage,
        onConfirm: async () => {
          try {
            let response;
            if (type === "ban") {
              response = await axios.post(
                `${import.meta.env.VITE_BE_API_URL}/ban?bannedId=${userId}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
            } else if (type === "unBan") {
              response = await axios.delete(
                `${import.meta.env.VITE_BE_API_URL}/ban?bannedId=${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
            } else if (type === "report") {
              response = await axios.post(
                `${import.meta.env.VITE_BE_API_URL}/report?reportedId=${userId}&matchingId=${matchingId}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
            } else if (type === "unReport") {
              response = await axios.delete(
                `${import.meta.env.VITE_BE_API_URL}/report?reportedId=${userId}&matchingId=${matchingId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
            }
            if (response.status === 200) {
              // 성공 메시지를 담은 모달 띄우기
              let successMsg = "";
              switch (type) {
                case "ban":
                  successMsg = `${userId}를 차단했습니다.`;
                  break;
                case "unBan":
                  successMsg = `${userId}를 차단 해제했습니다.`;
                  break;
                case "report":
                  successMsg = `${userId}를 신고했습니다.`;
                  break;
                case "unReport":
                  successMsg = `${userId}를 신고 해제했습니다.`;
                  break;
                default:
                  break;
              }
              modalStore.openModal("oneBtn", {
                message: successMsg,
                onConfirm: async () => {
                  await modalStore.closeModal();
                },
              });
              // 매칭 히스토리 정보 갱신
              const updatedHistoryData = await fetchUpdatedHistory();
              setHistoryData((prevData) => ({
                ...prevData,
                ...updatedHistoryData,
              }));
            }
          } catch (error) {
            console.error("서버 요청 실패:", error);
          }
        },
      });
    } catch (error) {
      console.error("모달 열기 실패:", error);
    }
    setActivePopOver(null);
  };

  // 차단, 신고 변경 시 함수: 업데이트된 히스토리 데이터 가져오기
  const fetchUpdatedHistory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BE_API_URL}/matching/history?page=0&size=${Object.keys(historyData).length}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return data.content;
    } catch (error) {
      console.error(
        "업데이트된 매칭 히스토리 정보를 불러오는데 실패했습니다.",
        error,
      );
      return {};
    }
  };

  // ✅ 신고 , 차단 위치 모호해서 주석주석
  const banOrReport = (user) => {
    if (user.ban && user.report) {
      return (
        <span className="ml-2 whitespace-nowrap rounded-md bg-[#FFACAC] px-1.5 py-0.5 text-[#E62222]">
          차단 및 신고 유저
        </span>
      );
    } else if (user.ban) {
      return (
        <span className="ml-2 whitespace-nowrap rounded-md bg-[#FFACAC] px-1.5 py-0.5 text-[#E62222]">
          차단 유저
        </span>
      );
    } else if (user.report) {
      return (
        <span className="ml-2 whitespace-nowrap rounded-md bg-[#FFACAC] px-1.5 py-0.5 text-[#E62222]">
          신고 유저
        </span>
      );
    }
    return null;
  };

  // 매칭 횟수별 메달 표시 함수
  const viewMedal = (count) => {
    if (count >= 5) return <GoldMedal width="16px" height="16px" />;
    if (count >= 3) return <SilverMedal width="16px" height="16px" />;
    if (count >= 1) return <BronzeMedal width="16px" height="16px" />;
    return null;
  };

  // 리뷰 작성 페이지로 이동
  const writeReview = (restsId, restsName, matching) => {
    navigate(`/rests/write/${restsId}`, {
      state: {
        restId: `${restsId}`,
        restName: `${restsName}`,
        matching: `${matching}`,
      },
    });
  };

  const myReviewChk = async (thisID) => {
    try {
      const matchingHistoryId = thisID;
      const token = window.localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BE_API_URL}/restaurants/myreview?matchingHistoryId=${matchingHistoryId}`,
        {
          headers: {
            "Content-Type": "application/json", // Content-Type 설정
            Authorization: `Bearer ${token}`, // Authorization 설정
          },
        },
      );

      if (response.status === 200) {
        const reviewData = response.data;
        modalStore.openModal("oneBtn", {
          message: <RestReviewItem review={reviewData} />, // 모달 메시지 설정
          onConfirm: async () => {
            await modalStore.closeModal();
          },
        });
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      modalStore.openModal("oneBtn", {
        message: "리뷰를 불러오는 데 실패했습니다.",
        onConfirm: async () => {
          await modalStore.closeModal();
        },
      });
    }
  };

  console.log(Object.values(historyData));
  return (
    <div className="mb-5 flex max-w-[300px] flex-col gap-10 rounded-2xl border border-[#ff6445] bg-white px-7 py-7 drop-shadow-lg min-[400px]:min-w-[380px] min-[600px]:h-full">
      <p className="text-left text-[28px] font-bold">나의 매칭 히스토리</p>
      <ul className="flex flex-1 flex-col gap-4 overflow-y-scroll scrollbar-hide">
        {Object.values(historyData) && Object.values(historyData).length > 0 ? (
          Object.values(historyData).map((item) => (
            <li key={item.id} className="flex flex-col gap-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-shrink-0 items-baseline">
                  <span className="text-sm min-[600px]:text-base">
                    {item.matching.restaurant.name}
                  </span>
                  <span className="pl-1 text-xs text-gray-400">
                    {item.matching.restaurant.category_name.slice(
                      item.matching.restaurant.category_name.lastIndexOf(">") +
                        2,
                    )}
                  </span>
                </div>
                <span>
                  {!item.matching.userList
                    .find((user) => user.id === item.userId)
                    ?.review?.description?.trim() ? (
                    <div
                      onClick={() =>
                        writeReview(
                          item.id,
                          item.matching.restaurant.name,
                          item.matching,
                        )
                      }
                      className="flex flex-shrink-0 cursor-pointer rounded-md border border-[#909090] px-1.5 text-xs text-[#909090] min-[600px]:text-sm"
                    >
                      리뷰 작성하기
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => myReviewChk(item.id)}
                        className="flex flex-shrink-0 cursor-pointer rounded-md border border-[#909090] px-1.5 text-xs text-[#909090] min-[600px]:text-sm"
                      >
                        리뷰 확인하기
                      </div>
                    </>
                  )}
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {item.matching.userList.map((user, idx) => (
                  <li
                    key={idx}
                    className="relative flex items-center justify-between rounded-lg bg-[#F8F8F8] p-3 text-sm"
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex gap-0.5">
                        <p className="whitespace-nowrap">{user.nickname}</p>
                        <div className="flex flex-1 flex-shrink-0 items-center">
                          {viewMedal(user.matchingCount)}
                          {banOrReport(user)}
                        </div>
                      </div>
                      <div className="text-left text-[#555555]">
                        {user?.review?.description}
                      </div>
                    </div>
                    <div>
                      {item.userId !== user.id && (
                        <p
                          className="rotate-90 cursor-pointer font-bold tracking-[-0.15rem]"
                          onClick={() => popOver(user.id, item.id)}
                        >
                          ···
                        </p>
                      )}
                      {activePopOver === `${user.id}-${item.id}` && (
                        <div
                          ref={popOverRef}
                          className="absolute right-1 top-10 z-50 flex flex-col gap-1 rounded-lg border border-gray-300 bg-white p-2"
                        >
                          {user.ban ? (
                            <button
                              onClick={() => toggleModal("unBan", user.id)}
                              className="rounded-lg px-2 py-1 hover:bg-gray-200"
                            >
                              차단해제
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("ban", user.id)}
                              className="rounded-lg px-2 py-1 hover:bg-gray-200"
                            >
                              차단하기
                            </button>
                          )}
                          {user.report ? (
                            <button
                              onClick={() => toggleModal("unReport", user.id)}
                              className="rounded-lg px-2 py-1 hover:bg-gray-200"
                            >
                              신고해제
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleModal("report", user.id)}
                              className="rounded-lg px-2 py-1 hover:bg-gray-200"
                            >
                              신고하기
                            </button>
                          )}
                          <div className="absolute -top-1.5 right-3 h-2.5 w-2.5 rotate-45 border-l border-t border-gray-300 bg-white"></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <div className="text-2xl text-gray-500">
            매칭 히스토리가 없습니다.
          </div>
        )}
        {page !== totalPage && hasMore && (
          <div ref={moreHistory} className="relative h-8 w-full pb-8">
            더 보기
          </div>
        )}
        {isLoading && (
          <div className="h-30 relative w-full">
            <ReactLoading
              type={"spokes"}
              color={"#000000"}
              height={25}
              width={25}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            />
          </div>
        )}
        {/*{isLoading && (*/}
        {/*  <div className="relative h-30 w-full">*/}
        {/*    */}
        {/*  </div>*/}
        {/*)}*/}
      </ul>
    </div>
  );
});

export default RestReviews;
