import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StaticMap } from "react-kakao-maps-sdk";
import CheckTitle from "../../assets/check-title.svg?react";
import Waiting from "../../assets/waiting.svg?react";
import Check from "../../assets/check.svg?react";

export default function CheckPlace() {
  const navigate = useNavigate();

  const position = JSON.parse(window.sessionStorage.getItem("tempPosition"));
  const [matchingData, setMatchingData] = useState([]);
  const [user, setUser] = useState(new Map());
  const [agree, setAgree] = useState(false);

  // 초기 설정
  useEffect(() => {
    // 유저가 매칭된 상태가 아니라면 메인페이지로 이동
    if (window.sessionStorage.getItem("isMatched") === "false") {
      if (window.sessionStorage.getItem("isMatching") === "true") {
        window.sessionStorage.setItem("isMatching", "false");
      }
      alert("잘못된 접근입니다.");
      return navigate("/");
    }
    if (window.sessionStorage.getItem("isMatching") === "false") {
      alert("잘못된 접근입니다.");
      return navigate("/");
    }
    const jsonData = JSON.parse(
      window.sessionStorage.getItem("matchingData")
    ).data;
    setMatchingData(Object.entries(Object.entries(jsonData)[2][1]));
  }, []);

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      matchingData.map((data) =>
        setUser((pre) => new Map([...pre, [data[1].nickName, false]]))
      );
      apiGetU2();
      apiGetU3();
      apiGetU4();
    } else {
      isMounted.current = true;
    }
  }, [matchingData]);

  useEffect(() => {
    console.log([...user.values()]);
    if (
      isMounted.current &&
      agree &&
      [...user.values()].indexOf(false) === -1
    ) {
      apiCompleted();
    } else {
      isMounted.current = true;
    }
  }, [user]);

  useEffect(() => {
    user.forEach((value, key) => {
      if (value === true) {
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
    apiPOSTCancel();
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
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  // 장소 동의
  const handleAgree = () => {
    apiAgree();
    document.querySelector(`#닉네임1waiting`).classList.add("hidden");
    document.querySelector(`#닉네임1check`).classList.remove("hidden");
    setAgree(true);
    setUser((prev) => {
      const newState = new Map(prev);
      newState.set("닉네임1", true);
      return newState;
    });
  };

  // 장소 거절
  const handleDisAgree = () => {
    alert("거절을 선택하여 매칭이 종료됩니다");
    setAgree(false);
    apiDisagree();
    unloadFunc();

    navigate("/");
    /////////////////////////////////////////
    // 추후 삭제
    ////////////////////////////////////////
    history.go(0);
  };

  ///////////////////////////////////////////////////////////////
  // 임시 함수 ////////////////////////////
  ///////////////////////////////////////////////////////////////
  async function apiGetU2() {
    setTimeout(() => {
      console.log("3초 지남");
      axios
        .get("/matching/nickname2")
        .then((res) => {
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.message, true);
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
        .get("/matching/nickname3")
        .then((res) => {
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.message, true);
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
        .get("/matching/nickname4")
        .then((res) => {
          setUser((prev) => {
            const newState = new Map(prev);
            newState.set(res.data.message, true);
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
      .get("/matching?response=accept")
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function apiDisagree() {
    axios
      .get("/matching?response=reject")
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function apiPOSTCancel() {
    await axios
      .post("/matching/cancel", {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function apiCompleted() {
    axios
      .get("/matching/completed")
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[790px] h-[525px] bg-white rounded-lg drop-shadow-2xl z-20 place-items-center py-[40px]">
        <div className="place-items-center ">
          <CheckTitle />
          <p className="text-xl pb-1 pt-[30px] font-semibold">
            매칭 인원을 찾았어요.
          </p>
          <p className="text-xl pb-3 font-semibold">
            모든 인원 동의시 매칭이 계속 진행됩니다.
          </p>
          <p className="pb-5">
            남은시간 {minutes}:{second}
          </p>
        </div>
        <div className="people-container w-[700px] h-[200px] flex flex-col justify-center gap-4 py-3 bg-[#F8F8F8] rounded-lg text-[#555555] text-[14px]">
          {matchingData.map((item, idx) => (
            <>
              <div key={idx} className="people-info flex justify-center gap-20">
                <Waiting
                  id={item[1].nickName + `waiting`}
                  width="25px"
                  className="waiting"
                />
                <Check
                  id={item[1].nickName + `check`}
                  width="25px"
                  className="check hidden text-[#FF6445]"
                />
                <p>{item[1].nickName}</p>
                <p>{item[1].place[0].name}</p>
                <p>{item[1].place[0].category_name}</p>
                <p>
                  {getDistance(
                    item[1].place[0].lat,
                    item[1].place[0].lon,
                    position.lat,
                    position.lng
                  )}
                  분 소요
                </p>
              </div>
            </>
          ))}
        </div>
        <div className="check-container flex flex-col justify-center ">
          <button
            onClick={handleAgree}
            className="w-[200px] pt-1 pb-[6px] bg-[#A2A2A2] rounded-lg text-white text-[16px] mt-4 mb-3 hover:bg-[#FF6445]"
          >
            모든 장소에 대해 동의
          </button>
          <button onClick={handleDisAgree} className="text-[14px]">
            매칭취소
          </button>
        </div>
      </div>
    </>
  );
}
