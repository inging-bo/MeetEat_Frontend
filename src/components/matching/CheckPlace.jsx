import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckPlace() {
  const navigate = useNavigate();

  const [matchingTime, setMatchingTime] = useState([]);
  const [matchingData, setMatchingData] = useState([]);

  useEffect(() => {
    if (window.sessionStorage.getItem("isMatched") === "false")
      return navigate("/");
    // 매칭데이터 불러오기
    const jsonData = JSON.parse(
      window.sessionStorage.getItem("matchingData")
    ).data;
    setMatchingData(Object.entries(Object.entries(jsonData)[1][1]));
    setMatchingTime(new Date(Object.entries(jsonData)[0][1]));
  }, []);

  // 타이머
  const MINUTES_IN_MS = 1 * 60 * 1000;
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const second = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  // 타이머 종료시, 새로고침시 매칭 취소 api 전송
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

  const beforeunloadFunc = (e) => {
    e.preventDefault();
    e.returnValue = "";
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
    window.sessionStorage.removeItem("matchingData");
  };
  //unload 이벤트
  window.addEventListener("unload", unloadFunc);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      clearInterval(timer);
      console.log("타이머가 종료되었습니다.");
      apiPOSTCancel();
      navigate("/");
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  return (
    <>
      <div className="flex flex-col gap-10 z-20">
        <h1 className="text-2xl">매칭 가능한 인원을 찾았습니다.</h1>
        <div className="people-container w-[750px] flex flex-col gap-20 py-14 bg-slate-300">
          {matchingData.map((item) => (
            <>
              <div className="people-info flex justify-center gap-20">
                <div>O</div>
                <p>{item[1].place[0].name}</p>
                <p>{item[1].place[0].category_name}</p>
                <p>내 위치 기준 거리</p>
              </div>
            </>
          ))}
        </div>
        <p>
          {minutes}:{second}
        </p>
        <div className="check-container flex flex-row justify-center gap-20">
          <button>거절</button>
          <button>동의</button>
        </div>
      </div>
    </>
  );
}
