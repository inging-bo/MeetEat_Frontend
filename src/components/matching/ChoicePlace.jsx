import { useState, useEffect } from "react";

export default function CheckPlace() {
  // 타이머
  const MINUTES_IN_MS = 1 * 5 * 1000;
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  const second = String(Math.floor((timeLeft / 1000) % 60));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      // 타이머 종료시 최종 매칭 완료 페이지 이동동
      clearInterval(timer);
      console.log("타이머가 종료되었습니다.");
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    const pickedPlace = "식당2";
    let choicedIdx = 0;
    const placeList = document.querySelectorAll(".place-name").values();
    [...placeList].map((item, idx) => {
      if (item.innerText === pickedPlace) choicedIdx = idx;
    });
    console.log(`pick-border-2-${choicedIdx}`);
    document
      .querySelector(".pick-border")
      .classList.add(`pick-border-2-${choicedIdx}`);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl">매칭 장소를 선택 중 입니다다.</h1>
        <div className="people-container w-[750px] flex flex-col gap-20 py-14 bg-slate-300 relative">
          <div className="people-info flex justify-center gap-20">
            <p className="place-name">식당1</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          <div className="people-info flex justify-center gap-20">
            <p className="place-name">식당2</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          {/* <div className="people-info flex justify-center gap-20">
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div>
          <div className="people-info flex justify-center gap-20">
            <p>식당명</p>
            <p>카테고리</p>
            <p>내 위치 기준 거리</p>
          </div> */}
          <div className="pick-border w-[650px] h-[50px] absolute top-[68px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-950"></div>
        </div>
        <p>5초 후 매칭 결과 확인 페이지로 넘어갑니다</p>
        <p>{second}</p>
      </div>
    </>
  );
}
