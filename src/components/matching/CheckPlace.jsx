import { useState, useEffect } from "react";

export default function CheckPlace() {
  // 타이머
  const MINUTES_IN_MS = 1 * 60 * 1000;
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const second = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      // 타이머 종료시 매칭 취소 api 전송
      clearInterval(timer);
      console.log("타이머가 종료되었습니다.");
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
          <div className="people-info flex justify-center gap-20">
            <div>O</div>
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          <div className="people-info flex justify-center gap-20">
            <div>O</div>
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          <div className="people-info flex justify-center gap-20">
            <div>O</div>
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          <div className="people-info flex justify-center gap-20">
            <div>O</div>
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
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
