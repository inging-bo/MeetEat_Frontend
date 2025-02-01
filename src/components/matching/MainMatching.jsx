import { useEffect, useState, useMemo } from "react";
import { Map, MapMarker, Circle, CustomOverlayMap } from "react-kakao-maps-sdk";
import { debounce } from "lodash";
import axios from "axios";
import AccIcon from "../../assets/acc-icon.svg?react";

export default function MainMatching() {
  // 지도의 중심좌표
  const [center, setCenter] = useState({
    lat: 37.503081,
    lng: 127.04158,
  });

  // 현재 위치
  const [position, setPosition] = useState({
    lat: 37.503081,
    lng: 127.04158,
  });

  // 지도의 중심을 유저의 현재 위치로 변경
  const setCenterToMyPosition = () => {
    setCenter(position);
  };

  // 지도 중심좌표 이동 감지 시 지도의 중심좌표를 이동된 중심좌표로 설정
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map) => {
        setCenter({
          lat: map.getCenter().getLat(),
          lng: map.getCenter().getLng(),
        });
      }, 100),
    []
  );

  // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    navigator.geolocation.watchPosition((pos) => {
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  // 2000m이내 키워드 검색
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);

  const searchPlaces = () => {
    let keyword = document.getElementById("keyword").value;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("검색어를 입력해주세요!");
      return false;
    }

    axios
      .get(`https://dapi.kakao.com/v2/local/search/keyword?`, {
        params: {
          x: position.lng,
          y: position.lat,
          radius: 2000,
          query: keyword,
        },
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_APP_RESTAPI_KEY}`,
        },
      })
      .then((res) => {
        let markers = [];
        for (let i = 0; i < res.data.documents.length; i++) {
          markers.push({
            position: {
              lat: res.data.documents[i].y,
              lng: res.data.documents[i].x,
            },
            place_name: res.data.documents[i].place_name,
            category_name: res.data.documents[i].category_name,
            id: res.data.documents[i].id,
            phone: res.data.documents[i].phone,
            place_url: res.data.documents[i].place_url,
            road_address_name: res.data.documents[i].road_address_name,
          });
        }
        setMarkers(markers);
      });
  };

  // 인포윈도우 바깥 클릭시 닫힘힘
  const [isInfoWindowOpen, setInfoWindowOpen] = useState(false);
  const handleClickOutside = (e) => {
    if (e.target.id.includes("daum-maps")) {
      setInfoWindowOpen(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
  }, [isInfoWindowOpen]);

  return (
    <>
      <div className="relative w-full h-full">
        <Map
          className="w-full h-full"
          id="map"
          center={center}
          level={5}
          onCenterChanged={updateCenterWhenMapMoved}
        >
          {/* 검색 된 마커 표시 */}
          {markers.map((marker) => (
            <>
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => {
                  setInfo(marker);
                  setCenter(marker.position);
                  setInfoWindowOpen(true);
                }}
                image={{
                  src: "../../../public/assets/map-marker.svg",
                  size: { width: 30, height: 30 },
                }}
              />
              {isInfoWindowOpen &&
                info &&
                info.place_name === marker.place_name && (
                  <CustomOverlayMap
                    position={marker.position}
                    yAnchor={1.4}
                    id="infoWindow"
                  >
                    <div className="drop-shadow-lg">
                      <div className="bg-white p-5 rounded-md w-[200px]">
                        <button
                          className="absolute top-0 right-0 px-[10px]"
                          onClick={() => {
                            setInfo(false);
                            setInfoWindowOpen(false);
                          }}
                        >
                          x
                        </button>
                        <div className="break-words whitespace-normal">
                          {marker.place_name}
                        </div>
                      </div>
                      <div className="w-0 h-0 justify-self-center border-l-[10px] border-l-transparent border-t-[12px] border-t-white border-r-[10px] border-r-transparent"></div>
                    </div>
                  </CustomOverlayMap>
                )}
            </>
          ))}

          {/* 현위치 표시 */}
          <MapMarker
            image={{
              src: "../../../public/assets/map-pin.svg",
              size: { width: 30, height: 30 },
            }}
            position={position}
          />

          {/* 가능 반경 표시 */}
          <Circle
            center={position}
            radius={2000}
            strokeWeight={1}
            strokeOpacity={0}
            fillColor={"#b2e39d"}
            fillOpacity={0.2}
          />
        </Map>

        {/* 현위치로 지도도 이동 버튼 */}
        <div className="flex flex-col gap-[10px] absolute z-[1] top-0 right-0 p-[10px]">
          <button
            className="flex justify-center items-center cursor-pointer rounded-full w-[45px] h-[45px] bg-white shadow-[0_0_8px_#00000025]"
            onClick={setCenterToMyPosition}
          >
            <AccIcon width="25px" />
          </button>
        </div>
        {/* 검색바 */}
        <div className="flex flex-row absolute z-[1] bottom-20 w-1/2 h-10 bg-emerald-600 translate-x-[-50%] left-[50%]">
          <input id="keyword" />
          <button className="bg-white rounded-sm px-5" onClick={searchPlaces}>
            검색
          </button>
        </div>
      </div>
    </>
  );
}
