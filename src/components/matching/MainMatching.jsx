import { useEffect, useState, useMemo } from "react";
import { Map, MapMarker, Circle, CustomOverlayMap } from "react-kakao-maps-sdk";
import { debounce } from "lodash";
import axios from "axios";
import AccIcon from "../../assets/acc-icon.svg?react";
import SearchList from "./SearchList";

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
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [preKeyword, setPreKeyword] = useState("");
  const [key, setKey] = useState(0);
  const [curText, setCurText] = useState("");

  // input필드 관찰
  const onChange = (e) => {
    setCurText(e.target.value);
    const searchBtn = document.getElementById("search-btn");
    searchBtn.classList.remove("hidden");
  };

  const searchPlaces = () => {
    if (!curText.replace(/^\s+|\s+$/g, "")) {
      alert("검색어를 입력해주세요!");
      return false;
    }

    const searchBtn = document.getElementById("search-btn");
    searchBtn.classList.add("hidden");

    // 기존 keyword와 다른 keyword 검색시 기존 marker와 정보 초기화
    if (curText !== preKeyword && curText !== "") {
      setMarkers([]);
      setPage(1);
      setHasMore(false);
      setInfo(false);
      setKey(key + 1);
    }

    setPreKeyword(curText);

    axios
      .get(`https://dapi.kakao.com/v2/local/search/keyword?`, {
        params: {
          x: position.lng,
          y: position.lat,
          radius: 2000,
          query: curText,
          sort: "distance",
          page: page,
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

        setMarkers((prevMarkers) => [...prevMarkers, ...markers]);

        if (res.data.meta.is_end === false) {
          setHasMore(true);
          setPage(page + 1);
        } else {
          setHasMore(false);
          setPage(1);
        }
      });
  };

  // 인포윈도우 바깥 클릭시 닫힘
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

  // 장소 선택
  const [choicedPlace, setChoicedPlace] = useState();
  const [isChoiced, setIsChoiced] = useState(false);
  const choicePlace = (marker) => {
    setChoicedPlace(marker);
    setIsChoiced(true);
    const keywordInput = document.getElementById("keyword");
    keywordInput.value = marker.place_name;
    keywordInput.disabled = true;
  };

  // 장소 리셋
  const resetChoice = () => {
    setChoicedPlace("");
    setIsChoiced(false);
    const keywordInput = document.getElementById("keyword");
    keywordInput.value = "";
    keywordInput.disabled = false;
  };

  // 현재 위치 변경 감지시 state 초기화
  useEffect(() => {
    setPage(1);
    setHasMore(false);
    setMarkers([]);
    setChoicedPlace("");
    setIsChoiced(false);
    setInfo(false);
    const keywordInput = document.getElementById("keyword");
    keywordInput.value = "";
    keywordInput.disabled = false;
  }, [position]);

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
          {!isChoiced &&
            markers.map((marker) => (
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
                      yAnchor={1.3}
                      id="infoWindow"
                    >
                      <div className="drop-shadow-lg">
                        <div className="bg-white p-5 rounded-lg w-[200px]">
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
                          <button
                            id="choiceBtn"
                            className="bg-green-800 rounded-lg px-2 p-1 mt-3 text-white"
                            onClick={() => {
                              choicePlace(marker);
                            }}
                          >
                            선택
                          </button>
                        </div>
                        <div className="w-0 h-0 justify-self-center border-l-[10px] border-l-transparent border-t-[12px] border-t-white border-r-[10px] border-r-transparent"></div>
                      </div>
                    </CustomOverlayMap>
                  )}
              </>
            ))}

          {/* 검색 된 리스트 표시 */}
          <div
            key={key}
            className="bg-slate-400 bg-opacity-60 text-white absolute z-10 top-1/4 right-10 min-w-[250px] max-w-[250px] rounded-lg max-h-[400px] overflow-y-scroll scrollbar-hide"
          >
            {!isChoiced &&
              markers.map((marker) => (
                <>
                  <SearchList marker={marker} />
                </>
              ))}
            {hasMore ? (
              <button
                className="py-2 font-bold drop-shadow-md"
                onClick={searchPlaces}
              >
                더보기
              </button>
            ) : (
              <></>
            )}
          </div>
          {/* 선택된 마커만 표시 */}
          {isChoiced && (
            <>
              <MapMarker
                position={choicedPlace.position}
                onClick={() => {
                  setInfo(choicedPlace);
                  setCenter(choicedPlace.position);
                  setInfoWindowOpen(true);
                }}
                image={{
                  src: "../../../public/assets/map-marker.svg",
                  size: { width: 30, height: 30 },
                }}
              />
              {isInfoWindowOpen && (
                <CustomOverlayMap
                  position={choicedPlace.position}
                  yAnchor={1.3}
                  id="infoWindow"
                >
                  <div className="drop-shadow-lg">
                    <div className="bg-white p-5 rounded-lg w-[200px]">
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
                        {choicedPlace.place_name}
                      </div>
                      <button
                        id="resetBtn"
                        className="bg-green-800 rounded-lg px-2 p-1 mt-3 text-white"
                        onClick={() => {
                          resetChoice();
                        }}
                      >
                        다시 선택
                      </button>
                    </div>
                    <div className="w-0 h-0 justify-self-center border-l-[10px] border-l-transparent border-t-[12px] border-t-white border-r-[10px] border-r-transparent"></div>
                  </div>
                </CustomOverlayMap>
              )}
            </>
          )}

          {/* 현위치 표시 */}
          <MapMarker
            image={{
              src: "../../../public/assets/map-pin.svg",
              size: { width: 20, height: 20 },
            }}
            position={position}
          />

          {/* 가능 반경 표시 */}
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
          <input id="keyword" type="text" onChange={onChange} value={curText} />
          <button
            id="search-btn"
            className="bg-white rounded-sm px-5"
            onClick={searchPlaces}
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}
