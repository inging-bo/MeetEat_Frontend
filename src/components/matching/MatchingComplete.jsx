import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
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
  }, [position]);

  return (
    <>
      <div className=" flex flex-col gap-5">
        <div className="title-container text-2xl flex flex-col gap-5">
          <h1>매칭이 완료되었습니다.</h1>
          <h1>20000.00.00 00시 00분까지 해당 위치에 도착해주세요!</h1>
          <h1>식당1</h1>
        </div>
        <div className="center-container h-[450px] flex flex-row gap-10 justify-center">
          <Map
            className="map-container min-w-[450px] h-full"
            id="map"
            center={position}
            level={8}
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
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
            <div className="people-item border border-slate-200 text-left rounded-lg p-3">
              <div className="flex flex-row">
                <p>닉네임</p>
                <p>메달</p>
              </div>
              <p>한줄소개</p>
            </div>
          </div>
        </div>
        <div className="title-container">
          <div>약속 장소 도착까지 남은 시간</div>
          <div>00분</div>
        </div>
      </div>
    </>
  );
}
