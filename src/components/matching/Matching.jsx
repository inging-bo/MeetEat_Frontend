import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Map, Circle } from "react-kakao-maps-sdk";
import Logo from "../../assets/header-logo.svg?react";
import ReactLoading from "react-loading";
import axios from "axios";

export default function Matching({
  setIsMatching,
  setIsMatched,
  selectedMarker,
  position,
  number,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const place = {
      id: selectedMarker.id,
      name: selectedMarker.place_name,
      category_name: selectedMarker.category_name,
      road_address_name: selectedMarker.road_address_name,
      phone: selectedMarker.phone,
      lon: selectedMarker.x,
      lat: selectedMarker.y,
      place_url: selectedMarker.place_url,
    };
    apiPOSTMatching(position.lng, position.lat, number, new Date(), place);
  }, []);

  // POST
  async function apiPOSTMatching(lng, lat, size, time, placeInfo) {
    await axios
      .post("/matching/request", {
        userLon: lng,
        userLat: lat,
        groupSize: size,
        matchingStartTime: time,
        place: placeInfo,
      })
      .then((res) => {
        console.log(res.data);
        setIsMatching("true");
        window.sessionStorage.setItem("isMatching", "true");
        setTimeout(
          () =>
            axios
              .get("/matching/complete")
              .then((res) => {
                setIsMatched(true);
                window.sessionStorage.setItem(
                  "tempPosition",
                  JSON.stringify(position)
                );
                window.sessionStorage.setItem("isMatched", "true");
                window.sessionStorage.setItem(
                  "matchingData",
                  JSON.stringify(res)
                );
                navigate(`/matching/check-place/${res.data.teamId}`);
              })
              .catch(function (error) {
                console.log(error);
              }),
          [5000]
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
      apiPOSTCancel();
      window.sessionStorage.removeItem("isMatching");
      setIsMatching(false);
      setIsMatched(false);
      history.go(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

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

  const cancelMatching = () => {
    apiPOSTCancel();
    window.sessionStorage.removeItem("isMatching");
    setIsMatching(false);
    setIsMatched(false);
    history.go(0);
  };

  return (
    <>
      <div className="bg-map relative w-full h-full">
        <div className="bg-black opacity-50 absolute w-full h-full z-10"></div>
        <Map className="w-full h-full" id="map" center={position} level={5}>
          <Circle
            center={position}
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
          <p>
            {selectedMarker.place_name}에서 {number}명과
          </p>
          <p>매칭 가능한 인원을 찾고 있습니다</p>
          <p>
            {minutes}:{second}
          </p>
          <button onClick={cancelMatching}>매칭취소</button>
        </div>
      </div>
    </>
  );
}
