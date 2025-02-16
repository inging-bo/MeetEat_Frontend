import { useState, useEffect, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StaticMap } from "react-kakao-maps-sdk";
import CheckTitle from "../../assets/check-title.svg?react";
import Waiting from "../../assets/waiting.svg?react";
import Check from "../../assets/check.svg?react";
import modalStore from "../../store/modalStore.js";
import authStore from "../../store/authStore";
import matchingStore from "../../store/matchingStore";
import { EventSourcePolyfill } from "event-source-polyfill";

export default function CheckPlace() {
  const [isLoggedIn, setLoggedIn] = useState();
  const [isMatching, setIsMatching] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  // 로그인, 매칭 확인
  useLayoutEffect(() => {
    authStore.checkLoggedIn();
    setLoggedIn(authStore.loggedIn);
    matchingStore.checkMatching();
    matchingStore.checkMatched();
    setIsMatching(matchingStore.isMatching);
    setIsMatched(matchingStore.isMatched);

    // 유저가 매칭된 상태가 아니라면 메인페이지로 이동
    if (!isMatched) {
      if (isMatching) {
        window.sessionStorage.removeItem("isMatching");
        matchingStore.checkMatching();
      }
      return navigate("/");
    }
    if (!isMatching) {
      alert("잘못된 접근입니다.");
      return navigate("/");
    }
    if (!isLoggedIn) {
      alert("로그인 후 이용해주세요 :)");
      navigate("/");
    }
  }, []);

  // SSE 재연결
  useEffect(() => {
    fetchSSE();
    const jsonData = JSON.parse(
      window.sessionStorage.getItem("matchingData")
    ).data;
    setMatchingData(jsonData.restaurantList);
  }, []);

  // 뒤로가기 발생시 매칭 취소
  history.pushState(null, document.title, location.href); // push
  const preventBack = () => {
    alert("페이지를 이동하여 자동으로 매칭이 취소됩니다.");
    apiDisagree();
    window.sessionStorage.removeItem("position");
    window.sessionStorage.removeItem("isMatching");
    location.href("/");
  };

  useEffect(() => {
    window.addEventListener("popstate", preventBack);
    return window.removeEventListener("popstate", preventBack);
  }, []);

  const navigate = useNavigate();
  const position = JSON.parse(window.sessionStorage.getItem("tempPosition"));
  const [matchingData, setMatchingData] = useState([]);
  const [user, setUser] = useState(new Map());
  const [agree, setAgree] = useState(false);

  // SSE fetch
  const fetchSSE = () => {
    // header 보내기 위해 EventSourcePolyfill 사용
    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_BE_API_URL}/sse/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    eventSource.onopen = () => {
      // 연결 시 할 일
    };

    // 방법1. onmessage 이용
    // eventSource.onmessage = async (e) => {
    //   const res = await e.data;
    //   const parsedData = JSON.parse(res);
    //   // 받아오는 data로 할 일
    //   if (parsedData.message === "수락 알림이 도착했습니다.") {
    //     if (parsedData.user.join === false) {
    //       alert("매칭 인원 중 누군가가 거절하였습니다");
    //       window.sessionStorage.clear();
    //       return navigate("/");
    //     }
    //     setUser((prev) => {
    //       const newState = new Map(prev);
    //       newState.set(parsedData.user.nickname, true);
    //       return newState;
    //     });
    //   }
    //   if (parsedData.message === "모임이 생성되었습니다") {
    //     window.sessionStorage.setItem("matchedData", JSON.stringify(res));
    //     window.sessionStorage.removeItem("isMatching");
    //     window.sessionStorage.removeItem("isMatched");
    //     window.sessionStorage.setItem("isCompleted", "true");
    //     navigate(`/matching/choice-place/${res.data.id}`);
    //   }
    // };

    // 방법2. EventListener
    eventSource.addEventListener("Join", (e) => {
      if (e.data.user.join === false) {
        alert("매칭 인원 중 누군가가 거절하였습니다");
        window.sessionStorage.clear();
        return navigate("/");
      }
      setUser((prev) => {
        const newState = new Map(prev);
        newState.set(e.data.user.nickname, true);
        return newState;
      });
    });
    eventSource.addEventListener("Team", (e) => {
      window.sessionStorage.setItem("matchedData", JSON.stringify(e.data));
      window.sessionStorage.removeItem("isMatching");
      window.sessionStorage.removeItem("isMatched");
      window.sessionStorage.setItem("isCompleted", "true");
      navigate(`/matching/choice-place/${e.data.id}`);
      eventSource.close();
    });

    eventSource.onerror = (e) => {
      // 종료 또는 에러 발생 시 할 일
      eventSource.close();
      if (e.error) {
        // 에러 발생 시 할 일
      }
      if (e.target.readyState === EventSource.CLOSED) {
        // 종료 시 할 일
      }
    };
  };

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      matchingData.map((data) => {
        setUser((pre) => new Map([...pre, [data.user.nickname, false]]));
      });
      // apiGetU2();
      // apiGetU3();
      // apiGetU4();
    } else {
      isMounted.current = true;
    }
  }, [matchingData]);

  useEffect(() => {
    if (
      isMounted.current &&
      agree &&
      [...user.values()].indexOf(false) === -1
    ) {
      // apiCompleted();
    } else {
      isMounted.current = true;
    }
  }, [user]);

  useEffect(() => {
    user.forEach((value, key) => {
      if (value === true) {
        console.log(key);
        console.log(`#${key}waiting`);
        console.log(document.querySelector(`#${key}waiting`));
        document.querySelector(`#${key}waiting`).classList.add("hidden");
        document.querySelector(`#${key}check`).classList.remove("hidden");
      }
    });
  }, [user]);

  // 거리계산 함수
  const getDistance = (lat1, lng1, lat2, lng2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lng2 - lng1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    d = Math.round((d / 4.8) * 60);
    return d;
  };

  // 타이머
  const MINUTES_IN_MS = 1 * 60 * 1000;
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const second = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  const beforeunloadFunc = (e) => {
    e.preventDefault();
    e.returnValue = "새로고침시 진행중인 매칭이 종료됩니다.";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", beforeunloadFunc);
    return () => {
      window.removeEventListener("beforeunload", beforeunloadFunc);
    };
  }, []);

  //새로고침 확인을 눌렀을 경우 unload 이벤트 실행
  const unloadFunc = () => {
    window.sessionStorage.setItem("isMatched", "false");
    apiDisagree();
    window.sessionStorage.removeItem("position");
    window.sessionStorage.removeItem("isMatching");
  };
  //unload 이벤트
  window.addEventListener("unload", unloadFunc);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("선택 시간이 초과되어 매칭이 종료됩니다");
      unloadFunc();
      navigate("/");
      modalStore.isOpen && modalStore.closeModal();
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  // 장소 동의
  const handleAgree = () => {
    apiAgree();
    document.querySelector(`#사과waiting`).classList.add("hidden");
    document.querySelector(`#사과check`).classList.remove("hidden");
    setAgree(true);
    setUser((prev) => {
      const newState = new Map(prev);
      newState.set("사과", true);
      return newState;
    });
  };
  // 장소 거절
  const handleDisAgree = async () => {
    try {
      await modalStore.openModal("twoBtn", {
        message: "매칭을 거절 하시겠습니까?",
        onConfirm: async () => {
          await setAgree(false);
          apiDisagree();
          unloadFunc();
          /////////////////////////////////////////
          // 추후 삭제
          ////////////////////////////////////////
          location.reload();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////////////////////////////////////////////////
  //임시 함수 ////////////////////////////
  /////////////////////////////////////////////////////////////
  async function apiGetU2() {
    setTimeout(() => {
      console.log("3초 지남");
      axios
        .get(`${import.meta.env.VITE_BE_API_URL}/matching/nickname2`, {
          headers: {
            Authorization: `${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.user.join === false) {
            alert("매칭 인원 중 누군가가 거절하였습니다");
            window.sessionStorage.clear();
            return navigate("/");
          }
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.user.nickname, true);
            return newState;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }, [3000]);
  }

  async function apiGetU3() {
    setTimeout(() => {
      console.log("9초 지남");
      axios
        .get(`${import.meta.env.VITE_BE_API_URL}/matching/nickname3`, {
          headers: {
            Authorization: `${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.user.join === false) {
            alert("매칭 인원 중 누군가가 거절하였습니다");
            window.sessionStorage.clear();
            return navigate("/");
          }
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.user.nickname, true);
            return newState;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }, [9000]);
  }

  async function apiGetU4() {
    setTimeout(() => {
      console.log("7초 지남");
      axios
        .get(`${import.meta.env.VITE_BE_API_URL}/matching/nickname4`, {
          headers: {
            Authorization: `${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.user.join === false) {
            alert("매칭 인원 중 누군가가 거절하였습니다");
            window.sessionStorage.clear();
            return navigate("/");
          }
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.user.nickname, true);
            return newState;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }, [7000]);
  }

  async function apiAgree() {
    axios
      .get(
        `${import.meta.env.VITE_BE_API_URL}/matching?response=accept`,
        {
          teamId: JSON.parse(window.sessionStorage.getItem("matchingData")).data
            .teamId,
          isJoin: true,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function apiDisagree() {
    axios
      .get(
        `${import.meta.env.VITE_BE_API_URL}/matching?response=reject`,
        {
          teamId: JSON.parse(window.sessionStorage.getItem("matchingData")).data
            .teamId,
          isJoin: false,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function apiPOSTCancel() {
    await axios
      .post(
        `${import.meta.env.VITE_BE_API_URL}/matching/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function apiCompleted() {
    axios
      .get(`${import.meta.env.VITE_BE_API_URL}/matching/completed`, {
        headers: {
          Authorization: `${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        window.sessionStorage.setItem("matchedData", JSON.stringify(res));
        window.sessionStorage.removeItem("isMatching");
        window.sessionStorage.removeItem("isMatched");
        window.sessionStorage.setItem("isCompleted", "true");
        navigate(`/matching/choice-place/${res.data.id}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  return (
    <>
      <div className="bg-map relative w-full h-full">
        <div className="bg-black/40 absolute w-full h-full z-10"></div>
        {position && (
          <StaticMap
            id="map"
            className="w-full h-full"
            center={position}
            level={5}
          />
        )}
      </div>
      <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[790px] h-[525px] bg-white rounded-lg drop-shadow-2xl z-20 py-[40px]">
        <div className="flex flex-col items-center">
          <CheckTitle />
          <p className="text-base md:text-xl pb-1 pt-[30px] font-semibold">
            매칭 인원을 찾았어요.
          </p>
          <p className="text-base md:text-xl pb-3 font-semibold">
            모든 인원 동의시 매칭이 계속 진행됩니다.
          </p>
          <p className="pb-5 text-sm md:text-base">
            남은시간 {minutes}:{second}
          </p>
        </div>
        <div className="people-container w-[340px] md:w-[700px] h-[200px] flex flex-col justify-center gap-6 md:gap-4 py-3 bg-[#F8F8F8] rounded-lg text-[#555555] text-xs md:text-[14px]">
          {matchingData.map((item, idx) => (
            <>
              <div
                key={idx}
                className="people-info grid w-[700px] grid-cols-[40px_75px_75px_75px_75px] md:grid-cols-[100px_150px_150px_150px_150px] h-[15px] justify-items-center"
              >
                <Waiting
                  id={item.user.nickname + `waiting`}
                  width="25px"
                  className="waiting w-[20px] md:w-[25px]"
                />
                <Check
                  id={item.user.nickname + `check`}
                  width="25px"
                  className="check hidden text-[#FF6445] w-[20px] md:w-[25px]"
                />
                <p className="text-overflow">{item.user.nickname}</p>
                <p className="text-overflow">{item.place.name}</p>
                <p className="text-overflow">
                  {item.place.category_name.slice(
                    item.place.category_name.indexOf(">") + 2
                  )}
                </p>
                <p>
                  {getDistance(
                    item.place.lat,
                    item.place.lon,
                    position.lat,
                    position.lng
                  )}
                  분 소요
                </p>
              </div>
            </>
          ))}
        </div>
        <div className="check-container flex flex-col justify-center">
          <button
            onClick={handleAgree}
            className="w-[200px] pt-1 pb-[6px] bg-[#A2A2A2] rounded-lg text-white text-sm md:text-[16px] mt-6 md:mt-4 mb-3 hover:bg-[#FF6445]"
          >
            모든 장소에 대해 동의
          </button>
        </div>
        <button
          onClick={handleDisAgree}
          className="text-xs md:text-[14px] absolute bottom-5"
        >
          매칭취소
        </button>
      </div>
    </>
  );
}
