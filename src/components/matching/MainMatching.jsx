import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Map, MapMarker, Circle, CustomOverlayMap } from "react-kakao-maps-sdk";
import { debounce } from "lodash";
import axios from "axios";
import AccIcon from "../../assets/acc-icon.svg?react";
import HeaderLogo from "../../assets/header-logo.svg?react";
import FoodIcon from "../../assets/food-line.svg?react";
import SearchList from "./SearchList";
import InfoWindow from "./InfoWindow";
import Matching from "./Matching";
import { useNavigate } from "react-router-dom";
import authStore from "../../store/authStore";
import matchingStore from "../../store/matchingStore";
import { BottomSheet } from "react-spring-bottom-sheet";
import "../../customBottomSheet.css";

export default function MainMatching() {
  const navigate = useNavigate();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState();
  const [isMatching, setIsMatching] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 로그인, 매칭 확인
  useLayoutEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BE_API_URL}/matching`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("MainMatching 36");
        console.log(res.data);
        if (res.data !== null) {
          matchingStore.setIsCompleted(true);
          window.sessionStorage.setItem("isCompleted", "true");
          window.sessionStorage.setItem(
            "matchedData",
            JSON.stringify(res.data)
          );
        } else matchingStore.setIsCompleted(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    authStore.checkLoggedIn();
    setLoggedIn(authStore.loggedIn);
    matchingStore.checkMatching();
    matchingStore.checkMatched();
    matchingStore.checkCompleted();
    setIsMatching(matchingStore.isMatching);
    setIsMatched(matchingStore.isMatched);
    setIsCompleted(matchingStore.isCompleted);
  }, []);

  useEffect(() => {
    console.log(matchingStore.isCompleted);
    if (isCompleted) {
      const now = new Date(); // 오늘 날짜
      const firstDay = new Date(
        JSON.parse(window.sessionStorage.getItem("matchedData")).createdAt
      ); // 시작 날짜
      console.log(now);
      console.log(firstDay);
      const toNow = now.getTime(); // 오늘까지 지난 시간(밀리 초)
      const toFirst = firstDay.getTime(); // 첫날까지 지난 시간(밀리 초)
      const passedTimeMin = (Number(toNow) - Number(toFirst)) / 60000; // 첫날부터 오늘까지 지난 시간(밀리 초)
      console.log(passedTimeMin);
      // 매칭 완료된 이후 60분 경과 후에는 리뷰페이지로 이동
      if (passedTimeMin >= 60) {
        const restsId = JSON.parse(window.sessionStorage.getItem("matchedData"))
          .matching.restaurant.id;
        const restsName = JSON.parse(
          window.sessionStorage.getItem("matchedData")
        ).matching.restaurant.name;
        const matchedId = JSON.parse(
          window.sessionStorage.getItem("matchedData")
        ).matching.id;
        return navigate(`/rests/write/${restsId}`, {
          state: {
            restId: `${restsId}`,
            restName: `${restsName}`,
            matchedId: `${matchedId}`,
          },
        });
      }
      const id = JSON.parse(window.sessionStorage.getItem("matchedData")).id;
      return navigate(`/matching/complete/${id}`);
    }
  }, [isMatching, isMatched]);

  // 브라우저 종료, 새로고침, 뒤로가기의 경우 매칭 취소 api 전송
  // sse의 경우 새로고침시 이전 메세지를 다시 받을 수 없음
  // 새로고침, 창닫기 방지
  const beforeunloadFunc = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", beforeunloadFunc);
    return () => {
      window.removeEventListener("beforeunload", beforeunloadFunc);
    };
  }, [isMatching]);

  async function apiPOSTCancel() {
    await axios
      .post(
        `${import.meta.env.VITE_BE_API_URL}/matching/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //새로고침 확인을 눌렀을 경우 unload 이벤트 실행
  const unloadFunc = () => {
    console.log("실행");
    setIsMatching("false");
    window.sessionStorage.removeItem("isMatching");
    apiPOSTCancel();
  };
  //unload 이벤트
  window.addEventListener("unload", unloadFunc);

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
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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

  // 2000m이내 키워드 검색
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0);
  const [curText, setCurText] = useState("");
  const [selectedMarker, setSelectedMarker] = useState();
  const [number, setNumber] = useState(2);

  // 입력 값이 변경될 때마다 타이머 설정
  useEffect(() => {
    if (isMounted.current) {
      const delayDebounceTimer = setTimeout(() => {
        setMarkers([]);
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
              Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_REST_KEY}`,
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
                distance: res.data.documents[i].distance,
              });
            }

            setMarkers((prevMarkers) => [...prevMarkers, ...markers]);
            setBottomSheetOpen(true);

            if (res.data.meta.is_end === false) {
              setHasMore(true);
              setPage(page + 1);
            } else {
              setHasMore(false);
              setPage(1);
            }
          });
      }, 500); // 디바운스 지연 시간
      return () => clearTimeout(delayDebounceTimer);
    } else {
      isMounted.current = true;
      return;
    }
  }, [curText]);

  function handleInputChange(event) {
    setCurText(event.target.value);
  }

  const searchPlaces = () => {
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
          Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_REST_KEY}`,
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
            distance: res.data.documents[i].distance,
          });
        }

        setMarkers((prevMarkers) => [...prevMarkers, ...markers]);
        if (res.data.documents.length !== 0) setBottomSheetOpen(true);
        if (res.data.documents.length === 0) setBottomSheetOpen(false);

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

  // 현재 위치 변경 감지시 state 초기화
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setPage(1);
      setHasMore(false);
      setMarkers([]);
      setInfo(false);
      setCurText("");
      const searchBtn = document.getElementById("search-btn");
      if (searchBtn !== null) searchBtn.classList.remove("hidden");
    } else {
      isMounted.current = true;
      return;
    }
  }, [position]);

  return (
    <>
      {!isMatching && (
        <>
          <header className="fixed top-0 left-0 right-0 shadow-lg z-10 flex justify-center h-[77px] py-3 bg-white">
            <div className="flex w-full justify-between max-w-screen-xl">
              <Link
                to="/"
                className="hidden h-full sm:px-4 sm:flex sm:items-center"
              >
                <HeaderLogo />
              </Link>

              <div className="search-bar w-[70%] lg:max-w-[600px] flex flex-row mx-4 bg-emerald-600 border border-[#3BB82D] rounded-full relative">
                <input
                  className="w-full lg:max-w-[600px] rounded-full px-5 focus:outline-none"
                  id="keyword"
                  type="text"
                  onChange={handleInputChange}
                  value={curText}
                  placeholder="함께 먹고싶은 식당을 검색해요."
                />
              </div>
              {isLoggedIn ? (
                <>
                  <Link
                    to={`/mypage`}
                    className="h-full min-w-[80px] px-4 flex items-center text-xs sm:text-base"
                  >
                    마이
                    <br />
                    페이지
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/account" className="h-full px-4 flex items-center">
                    로그인
                  </Link>
                </>
              )}
            </div>
          </header>
          <div className="relative w-full h-full">
            <Map
              className="w-full h-full"
              id="map"
              center={center}
              level={5}
              onCenterChanged={updateCenterWhenMapMoved}
              disableDoubleClick={true}
              disableDoubleClickZoom={true}
            >
              {/* 검색 된 마커 표시 */}
              {markers.map((marker) => (
                <>
                  <MapMarker
                    key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    position={marker.position}
                    onClick={() => {
                      setInfo(marker);
                      setCenter({
                        lat: `${Number(marker.position.lat) - 0.007}`,
                        lng: `${Number(marker.position.lng) + 0.005}`,
                      });
                      setInfoWindowOpen(true);
                    }}
                    image={{
                      src: "/assets/map-marker.svg",
                      size: { width: 25, height: 25 },
                    }}
                  />
                  {window.innerWidth > 767 &&
                    isInfoWindowOpen &&
                    info &&
                    info.place_name === marker.place_name &&
                    info.phone === marker.phone && (
                      <CustomOverlayMap
                        position={marker.position}
                        yAnchor={1.3}
                        id="infoWindow"
                      >
                        <InfoWindow
                          marker={marker}
                          setIsMatching={setIsMatching}
                          setSelectedMarker={setSelectedMarker}
                          setNumber={setNumber}
                          isLoggedIn={isLoggedIn}
                        />
                      </CustomOverlayMap>
                    )}
                  {window.innerWidth <= 767 &&
                    isInfoWindowOpen &&
                    info &&
                    info.place_name === marker.place_name &&
                    info.phone === marker.phone && (
                      <CustomOverlayMap
                        position={marker.position}
                        id="infoWindow"
                      >
                        <InfoWindow
                          marker={marker}
                          setIsMatching={setIsMatching}
                          setSelectedMarker={setSelectedMarker}
                          setNumber={setNumber}
                          isLoggedIn={isLoggedIn}
                        />
                      </CustomOverlayMap>
                    )}
                </>
              ))}

              {/* 검색 된 리스트 표시 */}
              <div
                key={key}
                className="hidden md:block bg-white text-black absolute z-10 top-[20%] left-10 min-w-[320px] max-w-[320px] rounded-lg max-h-[650px] overflow-y-scroll scrollbar-hide px-5 drop-shadow-2xl"
              >
                {markers.length !== 0 && (
                  <div className="font-bold py-[15px] text-left">검색결과</div>
                )}
                {markers.map((marker) => (
                  <>
                    <div
                      onClick={() => {
                        setInfo(marker);
                        setCenter({
                          lat: `${Number(marker.position.lat) - 0.007}`,
                          lng: `${Number(marker.position.lng) + 0.005}`,
                        });
                        setInfoWindowOpen(true);
                      }}
                    >
                      <SearchList marker={marker} />
                    </div>
                  </>
                ))}
                {hasMore && (
                  <button
                    className="py-2 font-bold drop-shadow-md"
                    onClick={() => searchPlaces()}
                  >
                    더보기
                  </button>
                )}
              </div>
              {/*검색된 리스트 표시 : 모바일 */}
              {window.innerWidth <= 767 && (
                <>
                  <BottomSheet
                    open={bottomSheetOpen}
                    blocking={false}
                    // the first snap points height depends on the content, while the second one is equivalent to 60vh
                    snapPoints={({ minHeight, maxHeight }) => [
                      minHeight * 0 + 120,
                      maxHeight / 2.5,
                    ]}
                    // Opens the largest snap point by default, unless the user selected one previously
                    defaultSnap={({ lastSnap, snapPoints }) =>
                      lastSnap ?? Math.max(...snapPoints)
                    }
                  >
                    {markers.length === 0 && (
                      <>
                        <div className="font-bold py-[15px] text-left">
                          검색결과
                        </div>
                        <div>검색 결과가 없습니다.</div>
                      </>
                    )}
                    {markers.length !== 0 && (
                      <div className="font-bold py-[15px] text-left">
                        검색결과
                      </div>
                    )}
                    {markers.map((marker) => (
                      <>
                        <div
                          onClick={() => {
                            setInfo(marker);
                            setCenter({
                              lat: `${Number(marker.position.lat) - 0.007}`,
                              lng: `${Number(marker.position.lng) + 0.005}`,
                            });
                            setInfoWindowOpen(true);
                          }}
                        >
                          <SearchList marker={marker} />
                        </div>
                      </>
                    ))}
                    {hasMore && (
                      <button
                        className="py-3 font-bold drop-shadow-md w-full"
                        onClick={() => searchPlaces()}
                      >
                        더보기
                      </button>
                    )}
                  </BottomSheet>
                </>
              )}

              {/* 현위치 표시 */}
              <MapMarker
                image={{
                  src: "/assets/map-pin.svg",
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
            <div className="flex flex-col gap-[10px] absolute z-[10] top-[5.5rem] right-2 p-[10px]">
              <button
                className="flex justify-center items-center cursor-pointer rounded-full w-[45px] h-[45px] bg-white shadow-[0_0_8px_#00000025]"
                onClick={setCenterToMyPosition}
              >
                <AccIcon className="w-[20px] sm:w-[25px]" />
              </button>
            </div>

            {/* 맛집탐방단, 내돈내산맛집 */}
            <div className="flex flex-col gap-[10px] absolute z-[1] top-[9rem] sm:top-[10rem] sm:bottom-2 right-2 p-[10px]">
              {/* <Link
                to="/openchat"
                className="flex flex-col justify-center items-center rounded-lg w-[80px] h-[80px] bg-[#FF6445] text-white text-sm"
              >
                <ChatIcon width="15px" />
                맛집
                <br />
                탐방단
              </Link> */}
              <Link
                to="meeteatdb"
                className="flex flex-col justify-center items-center rounded-full sm:rounded-lg w-[45px] h-[45px] sm:w-[80px] sm:h-[80px] bg-[#FF6445] text-white text-sm shadow-[0_0_8px_#00000025]"
              >
                <FoodIcon width="15px" />
                <div className="hidden sm:block">
                  내돈내산
                  <br />
                  맛집
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
      {isMatching && (
        <Matching
          setIsMatching={setIsMatching}
          setIsMatched={setIsMatched}
          selectedMarker={selectedMarker}
          position={position}
          number={number}
        />
      )}
    </>
  );
}
