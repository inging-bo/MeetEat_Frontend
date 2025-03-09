import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Arrow from "../../assets/updown-arrow-icon.svg?react";
import FullStar from "../../assets/full-star.svg?react";
import Logo from "../../assets/header-logo.svg?react";
import RestView from "./RestView.jsx";

export default function RestList() {
  // ✅ 확인용 식당 리스트
  const [restaurants, setRestaurants] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState("0");
  const [regionName, setRegionName] = useState("");
  const [categoryName, setCategoryName] = useState("전체");
  const [sortedName, setSortedName] = useState("거리순");
  const [placeName, setPlaceName] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [position, setPosition] = useState({
    lat: 37.503081,
    lng: 127.04158,
  });

  // 현위치
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
          let geocoder = new window.kakao.maps.services.Geocoder();
          let callback = function (result) {
            console.log(result);
            regionName !==
              result[0].address.address_name.slice(
                0,
                result[0].address.address_name.indexOf(" "),
              ) &&
              setRegionName(
                result[0].address.address_name.slice(
                  0,
                  result[0].address.address_name.indexOf(" "),
                ),
              );
          };

          geocoder.coord2Address(
            pos.coords.longitude,
            pos.coords.latitude,
            callback,
          );
        }
      },
      gpsError,
      geolocationOptions,
    );

    // navigator.geolocation.watchPosition(
    //   (pos) => {
    //     if (
    //       pos.coords.latitude !== position.lat ||
    //       pos.coords.longitude !== position.lng
    //     ) {
    //       setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    //       let geocoder = new window.kakao.maps.services.Geocoder();
    //       let callback = function (result) {
    //         regionName !==
    //           result[0].address.address_name.slice(
    //             0,
    //             result[0].address.address_name.indexOf(" "),
    //           ) &&
    //           setRegionName(
    //             result[0].address.address_name.slice(
    //               0,
    //               result[0].address.address_name.indexOf(" "),
    //             ),
    //           );
    //       };

    //       geocoder.coord2Address(
    //         pos.coords.longitude,
    //         pos.coords.latitude,
    //         callback,
    //       );
    //     }
    //   },
    //   gpsError,
    //   geolocationOptions,
    // );
  }, []);

  // 필터 적용시 다시 불러오기 ( 키워드 공백 변경 )
  useEffect(() => {
    setRestaurants([]);
    setPage("0");
    setPlaceName("");
    document.getElementById("keyword").value = "";
    let sort = "DISTANCE";
    if (sortedName === "거리순") sort = "DISTANCE";
    else if (sortedName === "평점순") sort = "RATING";
    regionName !== "" &&
      apiPOSTRestsLists(regionName, categoryName, "", position, sort, "0");
  }, [regionName, categoryName]);

  // 필터 적용시 다시 불러오기 ( 키워드 유지 in sorted변경 )
  useEffect(() => {
    setRestaurants([]);
    setPage("0");
    let sort = "DISTANCE";
    if (sortedName === "거리순") sort = "DISTANCE";
    else if (sortedName === "평점순") sort = "RATING";
    regionName !== "" &&
      apiPOSTRestsLists(
        regionName,
        categoryName,
        placeName,
        position,
        sort,
        "0",
      );
  }, [sortedName]);

  const openSearchFilter = (filter) => {
    setSearchFilter(searchFilter === "" ? filter : "");
    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("toggle")) {
        return setSearchFilter("");
      }
    });
  };

  const category = ["전체", "한식", "중식", "일식", "양식"];
  const region = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];
  const sorted = ["거리순", "평점순"];

  // 입력 값이 변경될 때마다 타이머 설정
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      const delayDebounceTimer = setTimeout(() => {
        setRestaurants([]);
        setPage("0");
        let sort = "DISTANCE";
        if (sortedName === "거리순") sort = "DISTANCE";
        else if (sortedName === "평점순") sort = "RATING";
        apiPOSTRestsLists(
          regionName,
          categoryName,
          placeName,
          position,
          sort,
          "0",
        );
      }, 1000); // 디바운스 지연 시간
      return () => clearTimeout(delayDebounceTimer);
    } else {
      isMounted.current = true;
      return;
    }
  }, [placeName]);

  function handleInputChange(event) {
    setPlaceName(event.target.value);
  }

  // 식당 상세조회 모달 변수, 함수
  const [restViewModal, setRestViewModal] = useState(false);
  const [pickedRest, setPickedRest] = useState("");
  const [star, setStar] = useState(new Array(5).fill(false));
  useEffect(() => {
    if (restViewModal) {
      document.body.style.cssText = `
          position: fixed;
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = "";
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      };
    }
  }, [restViewModal]);

  const RestViewToggle = (rest) => {
    setStar(new Array(5).fill(false));
    if (!restViewModal) {
      let temp = [...star];
      for (let i = 0; i < 5; i++) {
        if (rest.rating >= i + 1) {
          temp[i] = true;
        }
        setStar(temp);
      }
      axios
        .get(`${import.meta.env.VITE_BE_API_URL}/restaurants/${rest.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setPickedRest(res.data);
          setCenter({ lng: res.data.x, lat: res.data.y });
          setRestViewModal(!restViewModal);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRestViewModal(!restViewModal);
    }
  };

  // 무한스크롤
  const observerRef = useRef();
  const boxRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(intersectionObserver); // IntersectionObserver
    if (boxRef.current) {
      observerRef.current.observe(boxRef.current);
      return () => observerRef.current && observerRef.current.disconnect();
    }
  }, [restaurants]);

  const getInfo = async () => {
    console.log(maxPage);
    console.log(Number(page) + 1);
    if (maxPage < Number(page) + 1) return console.log("마지막페이지입니다.");
    let sort = "DISTANCE";
    if (sortedName === "거리순") sort = "DISTANCE";
    else if (sortedName === "평점순") sort = "RATING";
    apiPOSTRestsLists(
      regionName,
      categoryName,
      placeName,
      position,
      sort,
      String(Number(page) + 1),
    );
    setPage((prev) => String(Number(prev) + 1));
    console.log("info data add...");
  };

  // IntersectionObserver 설정
  const intersectionObserver = (entries, io) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 관찰하고 있는 entry가 화면에 보여지는 경우
        io.unobserve(entry.target); // entry 관찰 해제
        getInfo(); // 데이터 가져오기
      }
    });
  };

  async function apiPOSTRestsLists(
    region,
    categoryName,
    placeName,
    position,
    sorted,
    page,
  ) {
    await axios
      .post(
        `${import.meta.env.VITE_BE_API_URL}/restaurants/search`,
        {
          region: region,
          categoryName: categoryName,
          placeName: placeName,
          userY: position.lat,
          userX: position.lng,
          sorted: sorted,
          page: page,
          size: "20",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        setRestaurants((prev) => [...prev, ...res.data.content]);
        setMaxPage(res.data.page.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // async function apiPOSTRestDetailView(restId) {
  //   await axios
  //     .get(`http://ggone.site/api/restaurants/${restId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       setPickedRest(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // async function apiPOSTRestDetailView(restId) {
  //   await axios
  //     .get(`${import.meta.env.VITE_BE_API_URL}/restaurants/${restId}`)
  //     .then((res) => {
  //       setPickedRest(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  const [center, setCenter] = useState({});

  return (
    <>
      <div className="absolute left-0 right-0 top-[101px] flex flex-col items-center min-[750px]:top-40">
        {/* 식당 검색 Input*/}
        <div className="search-bar relative mb-6 w-72 rounded-full border border-[#3BB82D] min-[750px]:mb-7 md:w-96">
          <input
            className="h-10 w-full rounded-full pl-5 pr-12 focus:outline-none"
            id="keyword"
            onChange={handleInputChange}
            value={placeName}
            type="text"
            placeholder="실제 방문한 식당을 검색해요."
          />
        </div>
        {/* 검색 필터 */}
        <div className="mb-3 mr-2 flex justify-end gap-2 min-[750px]:w-[700px] min-[1150px]:w-[1100px]">
          <ul
            onClick={() => openSearchFilter("category")}
            className={`toggle relative flex flex-col items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 ${searchFilter === "category" && "rounded-b-none border-b-[transparent]"}`}
          >
            <li className="toggle flex items-center justify-center gap-2">
              {categoryName}
              <Arrow
                className={`${searchFilter === "category" ? "toggle rotate-180 duration-300 ease-in-out" : "toggle duration-300"} `}
              />
            </li>
            {searchFilter === "category" && (
              <>
                <ul className="toggle absolute top-[105%] z-10 flex w-[67.41px] flex-col gap-2 rounded-b-md border border-t-0 bg-[#eeeeee] py-1">
                  {category
                    .filter((item) => categoryName !== item)
                    .map((item) => (
                      <li
                        key={`${item}category`}
                        onClick={() => setCategoryName(item)}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </ul>
          <ul
            onClick={() => openSearchFilter("region")}
            className={`toggle relative flex flex-col items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 ${searchFilter === "region" && "rounded-b-none border-b-[transparent]"}`}
          >
            <li className="toggle flex items-center justify-center gap-2">
              {regionName}
              <Arrow
                className={`${searchFilter === "region" ? "toggle rotate-180 duration-300 ease-in-out" : "toggle duration-300"} `}
              />
            </li>
            {searchFilter === "region" && (
              <>
                <ul className="toggle absolute top-[105%] z-10 flex w-[67.41px] flex-col gap-2 rounded-b-md border border-t-0 bg-[#eeeeee] py-1">
                  {region
                    .filter((item) => regionName !== item)
                    .sort()
                    .map((item) => (
                      <li
                        key={`${item}region`}
                        onClick={() => setRegionName(item)}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </ul>
          <ul
            onClick={() => openSearchFilter("option")}
            className={`toggle relative flex flex-col items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 ${searchFilter === "option" && "rounded-b-none border-b-[transparent]"}`}
          >
            <li className="toggle flex items-center justify-center gap-2">
              {sortedName}
              <Arrow
                className={`${searchFilter === "option" ? "toggle rotate-180 duration-300 ease-in-out" : "toggle duration-300"} `}
              />
            </li>
            {searchFilter === "option" && (
              <>
                <ul className="toggle absolute top-[105%] z-10 flex w-[82.1px] flex-col gap-2 rounded-b-md border border-t-0 bg-[#eeeeee] py-1">
                  {sorted
                    .filter((item) => sortedName !== item)
                    .sort()
                    .map((item) => (
                      <li
                        key={`${item}sorted`}
                        onClick={() => setSortedName(item)}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </ul>
        </div>
        {/* 방문 식당 리스트 */}
        <ul className="grid grid-cols-1 gap-7 px-2 pb-10 min-[360px]:grid-cols-[350px] min-[750px]:grid-cols-[350px_350px] min-[1150px]:grid-cols-[350px_350px_350px]">
          {restaurants.map((rest, idx) =>
            restaurants.length - 3 === idx ? (
              <li
                key={rest.id}
                className="flex w-full cursor-pointer flex-col items-start rounded-lg bg-white p-4 text-left drop-shadow-lg"
                onClick={() => RestViewToggle(rest)}
                ref={boxRef}
              >
                <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-gray-300">
                  {rest.thumbnail ? (
                    <>
                      <img
                        src={rest.thumbnail}
                        className="h-full max-h-40 w-full rounded-lg object-cover"
                      ></img>
                    </>
                  ) : (
                    <Logo className="" />
                  )}
                </div>
                <p className="text-overflow text-lg">{rest.place_name}</p>
                <p className="text-overflow mb-1.5 max-w-[300px] text-gray-600">
                  {rest.road_address_name}
                </p>
                <div className="flex h-6 items-start gap-2 text-base text-gray-500">
                  <div className="flex h-6 gap-1">
                    <span className="flex items-center justify-center">
                      <FullStar className="h-full w-full text-[#FF6445]" />
                    </span>
                    <span>{rest.rating}</span>
                  </div>
                </div>
              </li>
            ) : (
              <li
                key={rest.id}
                className="flex w-full cursor-pointer flex-col items-start rounded-lg bg-white p-4 text-left drop-shadow-lg"
                onClick={() => RestViewToggle(rest)}
              >
                <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-gray-300">
                  {rest.thumbnail ? (
                    <>
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}${rest.thumbnail.split(",")[0]}`}
                        className="h-full max-h-40 w-full rounded-lg object-cover"
                      ></img>
                    </>
                  ) : (
                    <Logo />
                  )}
                </div>
                <p className="text-overflow text-lg">{rest.place_name}</p>
                <p className="text-overflow mb-1.5 max-w-[300px] text-gray-600">
                  {rest.road_address_name}
                </p>
                <div className="flex h-6 items-start gap-2 text-base text-gray-500">
                  <div className="flex h-6 gap-1">
                    <span className="flex items-center justify-center">
                      <FullStar
                        width="20px"
                        height="20px"
                        className="text-[#FF6445]"
                      />
                    </span>
                    <span>{rest.rating}</span>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
      {restViewModal && (
        <RestView
          center={center}
          close={RestViewToggle}
          pickedRest={pickedRest}
          star={star}
        />
      )}
    </>
  );
}
