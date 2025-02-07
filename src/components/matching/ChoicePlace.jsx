import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckPlace() {
  const navigate = useNavigate();

  const [position, setPosition] = useState("");
  const [matchingData, setMatchingData] = useState([]);
  const [pickedPlace, setPickedPlace] = useState();

  // 초기 설정
  useEffect(() => {
    // 유저가 매칭된 상태가 아니라면 메인페이지로 이동
    if (window.sessionStorage.getItem("isCompleted") !== "true") {
      return navigate("/");
    }

    // 저장된 매칭데이터 저장
    const jsonPosition = JSON.parse(
      window.sessionStorage.getItem("tempPosition")
    );
    const jsonData = JSON.parse(
      window.sessionStorage.getItem("matchingData")
    ).data;
    const jsonCurData = JSON.parse(
      window.sessionStorage.getItem("matchedData")
    ).data;
    setMatchingData(Object.entries(Object.entries(jsonData)[2][1]));
    setPickedPlace(Object.entries(jsonCurData)[3][1].restaurant.placeName);
    setPosition(jsonPosition);
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
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl">매칭 장소를 선택 중 입니다다.</h1>
        <div className="people-container w-[750px] flex flex-col gap-20 py-14 bg-slate-300 relative">
          {matchingData.map((item) => (
            <>
              <div className="people-info flex justify-center gap-20">
                <p className="place-name">{item[1].place[0].name}</p>
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

          <div className="pick-border w-[650px] h-[50px] absolute top-[68px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-600 rounded-lg"></div>
        </div>
        <p>5초 후 매칭 결과 확인 페이지로 넘어갑니다</p>
        <p>{second}</p>
      </div>
    </>
  );
}
