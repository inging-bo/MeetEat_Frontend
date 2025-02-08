import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          Authorization: `KakaoAK ${import.meta.env.VITE_APP_RESTAPI_KEY}`,
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

  return (
    <>
      <div className=" flex flex-col gap-5">
        <div className="title-container text-2xl flex flex-col gap-5">
          <h1>매칭이 완료되었습니다.</h1>
          <h1>
            오늘 {Number(date.slice(11, 13)) + 1}시 {date.slice(14, 16)}분 까지
            해당 위치에 도착해주세요!
          </h1>
          <h1>{pickedRest.placeName}</h1>
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
                src: "../../../public/assets/map-pin.svg",
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
          <div>약속 장소 도착까지 남은 시간</div>
          <div>{distance}분</div>
        </div>
      </div>
    </>
  );
}
