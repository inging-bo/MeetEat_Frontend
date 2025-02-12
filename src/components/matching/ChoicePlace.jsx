import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StaticMap } from "react-kakao-maps-sdk";
import CheckTitle from "../../assets/check-title.svg?react";

export default function CheckPlace() {
  const navigate = useNavigate();

  const position = JSON.parse(window.sessionStorage.getItem("tempPosition"));
  const [matchingData, setMatchingData] = useState([]);
  const [pickedPlace, setPickedPlace] = useState();

  // 초기 설정
  useEffect(() => {
    // 유저가 매칭된 상태가 아니라면 메인페이지로 이동
    if (window.sessionStorage.getItem("isCompleted") !== "true") {
      alert("잘못된 접근입니다.");
      return navigate("/");
    }

    // 저장된 매칭데이터 저장
    const jsonData = JSON.parse(
      window.sessionStorage.getItem("matchingData")
    ).data;
    const jsonCurData = JSON.parse(
      window.sessionStorage.getItem("matchedData")
    ).data;
    console.log(jsonData);
    setMatchingData(jsonData.restaurantList);
    setPickedPlace(jsonCurData.matching.restaurant.placeName);
  }, []);

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
      window.sessionStorage.removeItem("matchingData");
      window.sessionStorage.removeItem("tempPosition");
      const id = JSON.parse(window.sessionStorage.getItem("matchedData")).data
        .id;
      navigate(`/matching/complete/${id}`);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    let choicedIdx = 0;
    const placeList = document.querySelectorAll(".place-name").values();
    [...placeList].map((item, idx) => {
      if (item.innerText === pickedPlace) choicedIdx = idx;
    });
    console.log(`pick-border-${matchingData.length}-${choicedIdx}`);
    document
      .querySelector(".pick-border")
      .classList.add(`pick-border-${matchingData.length}-${choicedIdx}`);
  }, [matchingData]);

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

  return (
    <>
      <div className="bg-map relative w-full h-full">
        <div className="bg-black/40 absolute w-full h-full z-10"></div>
        {position && (
          <StaticMap
            id="map"
            className="w-full h-full"
            center={JSON.parse(window.sessionStorage.getItem("tempPosition"))}
            level={5}
          />
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[790px] h-[412px] bg-white rounded-lg drop-shadow-2xl z-20 place-items-center py-[40px] will-change-transform">
        <div className="place-items-center ">
          <CheckTitle />
          <p className="text-xl pb-1 pt-[30px] font-semibold">
            방문할 음식점을 선택하는 중이에요.
          </p>
          <p className="text-xl pb-3 font-semibold">
            {second}초 뒤에 음식점이 공개됩니다!
          </p>
        </div>
        <div className="people-container w-[700px] h-[200px] flex flex-col justify-center gap-4 py-3 bg-[#F8F8F8] rounded-lg text-[#555555] text-[14px] relative">
          {matchingData.map((item) => (
            <>
              <div className="people-info grid w-[700px] grid-cols-[200px_200px_200px] justify-center">
                <p className="place-name text-overflow">{item.place.name}</p>
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
          <div className="pick-border w-[650px] h-[35px] absolute top-[68px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#FF6445] rounded-lg"></div>
        </div>
      </div>
    </>
  );
}
