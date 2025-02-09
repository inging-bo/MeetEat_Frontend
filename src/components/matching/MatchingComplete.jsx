import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Info from "../../assets/cancelInfo.svg?react";

export default function MatchingComplete() {
  // 현재 위치
  const [position, setPosition] = useState({
    lat: 37.503081,
    lng: 127.05,
  });

  // 도착 위치
  const [positionTo, setPositionTo] = useState({
    lat: 37.503081,
    lng: 127.05,
  });

  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [pickedRest, setPickedRest] = useState([]);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  // 초기 설정
  useEffect(() => {
    // 유저가 매칭된 상태가 아니라면 메인페이지로 이동
    if (window.sessionStorage.getItem("isCompleted") !== "true") {
      console.log("매칭완료된 상태가 아닙니다.");
      return navigate("/");
    }
    if (window.sessionStorage.getItem("matchedData") === undefined) {
      console.log("매칭완료된 데이터가 없습니다.");
      return navigate("/");
    }

    const now = new Date(); // 오늘 날짜
    const firstDay = new Date(
      JSON.parse(window.sessionStorage.getItem("matchedData")).data.createdAt
    ); // 시작 날짜
    console.log(firstDay);
    const toNow = now.getTime(); // 오늘까지 지난 시간(밀리 초)
    const toFirst = firstDay.getTime(); // 첫날까지 지난 시간(밀리 초)
    const passedTimeMin = (Number(toNow) - Number(toFirst)) / 60000; // 첫날부터 오늘까지 지난 시간(밀리 초)
    console.log(passedTimeMin + "min");
    // 매칭 완료된 이후 60분 경과 후에는 리뷰페이지로 이동
    if (passedTimeMin >= 60) {
      const restsId = JSON.parse(window.sessionStorage.getItem("matchedData"))
        .data.matching.restaurant.id;
      return navigate(`/rests/write/${restsId}`);
    }

    // 저장된 매칭데이터 저장
    const jsonCurData = JSON.parse(
      window.sessionStorage.getItem("matchedData")
    ).data;
    setDate(Object.entries(jsonCurData)[1][1]);
    setUserList(Object.entries(jsonCurData)[3][1].userList);
    setPickedRest(Object.entries(jsonCurData)[3][1].restaurant);
    setPositionTo({
      lat: Object.entries(jsonCurData)[3][1].restaurant.lat,
      lng: Object.entries(jsonCurData)[3][1].restaurant.lon,
    });
  }, []);

  // 거리계산
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

  // 선 Path
  const [polyPath, setPolyPath] = useState([{}]);

  // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지
  const gpsError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const geolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 5 * 60 * 1000,
    timeout: 7000,
  };

  // geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (
          pos.coords.latitude !== position.lat ||
          pos.coords.longitude !== position.lng
        ) {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      },
      gpsError,
      geolocationOptions
    );

    navigator.geolocation.watchPosition(
      (pos) => {
        if (
          pos.coords.latitude !== position.lat ||
          pos.coords.longitude !== position.lng
        ) {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      },
      gpsError,
      geolocationOptions
    );
  }, []);

  // 카카오 모빌리티 API
  useEffect(() => {
    const origin = `${position.lng},${position.lat}`;
    const destination = `${positionTo.lng},${positionTo.lat}`;

    axios
      .get(`https://apis-navi.kakaomobility.com/v1/directions?`, {
        params: {
          origin: origin,
          destination: destination,
        },
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_REST_KEY}`,
        },
      })
      .then((response) => {
        setPolyPath([]);
        response.data.routes[0].sections[0].roads.forEach((road) => {
          road.vertexes.forEach((vertex, index) => {
            if (index % 2 === 0) {
              setPolyPath((prev) => [
                ...prev,
                {
                  lat: road.vertexes[index + 1],
                  lng: vertex,
                },
              ]);
            }
          });
        });
        console.log(polyPath);
      });

    const distance = getDistance(
      position.lat,
      position.lng,
      positionTo.lat,
      positionTo.lng
    );
    setDistance(distance);
  }, [position]);

  // 3분 전 매칭취소
  async function apiPOSTCancel() {
    await axios
      .post("/matching/cancel/illegal", {})
      .then(() => {
        navigate("/");
        window.sessionStorage.removeItem("isMatched");
        window.sessionStorage.removeItem("isCompleted");
        window.sessionStorage.removeItem("matchedData");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 3분 후 매칭취소
  async function apiPOSTCancelIllegal() {
    await axios
      .post("/matching/cancel/illegal", {})
      .then(() => {
        navigate("/");
        window.sessionStorage.removeItem("isMatched");
        window.sessionStorage.removeItem("isCompleted");
        window.sessionStorage.removeItem("matchedData");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const cancelMatched = () => {
    const now = new Date();
    const firstDay = new Date(
      JSON.parse(window.sessionStorage.getItem("matchedData")).data.createdAt
    );
    const toNow = now.getTime();
    const toFirst = firstDay.getTime();
    const passedTimeMin = (Number(toNow) - Number(toFirst)) / 60000;
    console.log(passedTimeMin + "min");
    // 매칭 완료된 이후 60분 경과 후에는 리뷰페이지로 이동
    if (passedTimeMin >= 3) {
      alert("매칭 3분 이후 취소시 패널티가 부과됩니다.");
      return apiPOSTCancelIllegal();
    }
    alert("매칭 3분 이전 취소로 패널티가 부과되지 않습니다.");
    return apiPOSTCancel();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  function handleClickOutside(e) {
    const modalBox = document.getElementById("modalBg");
    if (isModalOpen && modalBox === e.target) {
      setIsModalOpen(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="title-container text-2xl flex flex-col gap-5">
          <h1>매칭이 완료되었습니다.</h1>
          <h1>
            오늘 {Number(date.slice(11, 13)) + 1}시 {date.slice(14, 16)}분 까지
            해당 위치에 도착해주세요!
          </h1>
          <h1 className="flex flex-row justify-center gap-5">
            <div>{pickedRest.placeName}</div>
            <div>{pickedRest.roadAddressName}</div>
          </h1>
        </div>
        <div className="center-container h-[450px] flex flex-row gap-10 justify-center">
          <Map
            className="map-container min-w-[450px] h-full"
            id="map"
            center={position}
            level={5}
          >
            <MapMarker
              image={{
                src: "../../../public/assets/map-pin.svg",
                size: { width: 20, height: 20 },
              }}
              position={position}
            />
            <MapMarker
              image={{
                src: "../../../public/assets/positionTo.svg",
                size: { width: 20, height: 20 },
              }}
              position={positionTo}
            />
            <Polyline
              path={polyPath}
              strokeWeight={5} // 선의 두께 입니다
              strokeColor={"#00900a"} // 선의 색깔입니다
              strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle={"solid"} // 선의 스타일입니다
            />
          </Map>
          <div className="people-container flex flex-col gap-2 min-w-[450px] h-full overflow-y-scroll scrollbar-hide">
            {userList.map((user) => (
              <>
                <div className="people-item border border-slate-200 text-left rounded-lg p-3">
                  <div className="flex flex-row">
                    <p>{user.nickname}</p>
                    <p>메달</p>
                  </div>
                  <p>{user.introduce}</p>
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="title-container">
          <div>현재 위치부터 약속 장소 도착까지</div>
          <div>약 {distance}분</div>
        </div>
      </div>
      <div className="flex flex-row fixed bottom-0 max-w-3xl w-full h-[60px] justify-center">
        <button onClick={() => setIsModalOpen(true)}>
          <Info className="block my-auto" width="50px" />
        </button>
        <button onClick={cancelMatched} className=" text-slate-400">
          매칭을 취소하시겠습니까?
        </button>
      </div>
      {isModalOpen && (
        <>
          <div className="absolute w-full h-full">
            <div
              id={"modalBg"}
              className="bg-black opacity-50 absolute top-0 left-0 w-full h-full z-10"
            ></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-20">
            <div className="bg-white p-5 rounded-lg w-[320px] text-left">
              <p className="font-bold text-base max-w-[200px] pb-3">
                취소 유의사항
              </p>
              <p className="font-semibold text-base max-w-[200px]">
                매칭 완료 3분 이내 취소
              </p>
              <p className="text-sm max-w-[200px] pb-2">→ 패널티 없음</p>
              <p className="font-semibold text-base max-w-[200px]">
                매칭 완료 3분 이후 취소
              </p>
              <p className="text-sm max-w-[200px]">→ 일주일간 매칭 불가</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
