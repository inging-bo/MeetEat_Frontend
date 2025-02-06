import { useState, useEffect } from "react";
import { Map, Circle } from "react-kakao-maps-sdk";
import Logo from "../../assets/header-logo.svg?react";
import ReactLoading from "react-loading";

export default function Matching() {
  // 지도의 중심좌표
  // 추후 사용자의 매칭 시작 누를 때 좌표로 변경
  const center = {
    lat: 37.503081,
    lng: 127.04158,
  };

  // 타이머
  const MINUTES_IN_MS = 10 * 60 * 1000;
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
      <div className="bg-map relative w-full h-full ">
        <div className="bg-black opacity-50 absolute w-full h-full z-10"></div>
        <Map className="w-full h-full" id="map" center={center} level={5}>
          <Circle
            center={center}
            radius={2000}
            strokeColor={"#81be67"}
            strokeWeight={1}
            strokeOpacity={1}
            fillColor={"#b2e39d"}
            fillOpacity={0.23}
          />
        </Map>
      </div>
      <div className="matching-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-lg drop-shadow-2xl z-20">
        <p className="py-10">현재 00명과 함께 매칭중</p>
        <div className="info-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-7 h-full">
          <Logo />
          <ReactLoading
            type={"bubbles"}
            color={"#555555"}
            height={64}
            width={64}
          />
          <p>선택장소에서 00명과</p>
          <p>매칭 가능한 인원을 찾고 있습니다</p>
          <p>
            {minutes}:{second}
          </p>
          <button>매칭취소</button>
        </div>
      </div>
    </>
  );
}
