import SearchIcon from "../../assets/search.svg?react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import Arrow from "../../assets/updown-arrow-icon.svg?react";
import FullStar from "../../assets/full-star.svg?react";
import Logo from "../../assets/header-logo.svg?react";
import Review from "../../assets/review.svg?react";
import RestView from "./RestView.jsx";

export default function RestList() {
  // ✅ 확인용 식당 리스트
  const [restaurants, setRestaurants] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState("0");
  useEffect(() => {
    apiPOSTRestsLists(page);
  }, []);

  const [searchFilter, setSearchFilter] = useState("");

  const openSearchFilter = (filter) => {
    setSearchFilter(searchFilter === "" ? filter : "");
  };

  const filterList = (type) => {
    switch (type) {
      case "category":
        return (
          <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
            <li>한식</li>
            <li>중식</li>
            <li>일식</li>
            <li>양식</li>
          </ul>
        );
      case "region":
        return (
          <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
            <li>서울</li>
            <li>부산</li>
            <li>대구</li>
            <li>인천</li>
            <li>광주</li>
            <li>대전</li>
            <li>울산</li>
            <li>세종</li>
            <li>경기</li>
            <li>강원</li>
            <li>충북</li>
            <li>충남</li>
            <li>전북</li>
            <li>전남</li>
            <li>경북</li>
            <li>경남</li>
            <li>제주</li>
          </ul>
        );
      case "option":
        return (
          <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
            <li>거리순</li>
            <li>평점순</li>
          </ul>
        );
    }
  };

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
      apiPOSTRestDetailView(rest.id - 1);
      setCenter({ lat: rest.x, lng: rest.y });
    }
    setRestViewModal(!restViewModal);
  };

  // 무한스크롤
  const observerRef = useRef();
  const boxRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(intersectionObserver); // IntersectionObserver
    boxRef.current && observerRef.current.observe(boxRef.current);
  }, [restaurants]);

  const getInfo = async () => {
    if (maxPage < Number(page) + 1) return console.log("마지막페이지입니다.");
    apiPOSTRestsLists(String(Number(page) + 1));
    setPage((prev) => prev + 1);
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

  //////////////////////////////////////////////////
  // 임시함수
  //////////////////////////////////////////////////
  async function apiPOSTRestsLists(page) {
    await axios
      .post("/restaurants/search", {
        region: "서울",
        categoryName: "전체",
        placeName: "",
        userY: "위도",
        userX: "경도",
        sorted: "DEFAULT",
        page: page,
        size: "20",
      })
      .then((res) => {
        setRestaurants((prev) => [...prev, ...res.data.content]);
        setMaxPage(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function apiPOSTRestDetailView(restId) {
    await axios
      .get("/restaurants", { params: { restaurantId: restId } })
      .then((res) => {
        setPickedRest(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [center, setCenter] = useState({});

  return (
    <>
      <div className="absolute top-40 min-w-fit flex max-xl:ml-auto flex-col mb-auto items-center">
        <div className="w-72 md:w-96 mb-7 search-bar border border-[#3BB82D] rounded-full relative">
          <input
            className="w-full h-10 rounded-full pl-5 pr-12 focus:outline-none"
            id="keyword"
            type="text"
            placeholder="실제 방문한 식당을 검색해요."
          />
          <button id="search-btn" className="absolute px-4 right-0 top-[8px]">
            <SearchIcon width="22px" />
          </button>
        </div>
        <div className="flex gap-2 mb-3 ml-auto mr-2">
          <ul
            onClick={() => openSearchFilter("category")}
            className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "category" && "border-b-[transparent] rounded-b-none"}`}
          >
            <li className="flex justify-center gap-2 items-center">
              전체
              <Arrow
                className={`${searchFilter === "category" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}
              />
            </li>
            {searchFilter === "category" && filterList("category")}
          </ul>
          <ul
            onClick={() => openSearchFilter("region")}
            className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "region" && "border-b-[transparent] rounded-b-none"}`}
          >
            <li className="flex justify-center gap-2 items-center">
              서울
              <Arrow
                className={`${searchFilter === "region" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}
              />
            </li>
            {searchFilter === "region" && filterList("region")}
          </ul>
          <ul
            onClick={() => openSearchFilter("option")}
            className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "option" && "border-b-[transparent] rounded-b-none"}`}
          >
            <li className="flex justify-center gap-2 items-center">
              평점순
              <Arrow
                className={`${searchFilter === "option" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}
              />
            </li>
            {searchFilter === "option" && filterList("option")}
          </ul>
        </div>
        <div className="grid sm:grid-cols-[350px] min-[750px]:grid-cols-[350px_350px] min-[1150px]:grid-cols-[350px_350px_350px] gap-7 pb-10">
          {restaurants.map((rest, idx) =>
            restaurants.length - 3 === idx ? (
              <>
                <li
                  key={rest.id}
                  className="flex flex-col w-[340px] items-start bg-white rounded-lg drop-shadow-lg p-4 cursor-pointer text-left"
                  onClick={() => RestViewToggle(rest)}
                  ref={boxRef}
                >
                  <div className="bg-gray-300 h-40 w-full rounded-lg mb-3 content-center justify-items-center">
                    {rest.thumbnail ? (
                      <>
                        <img
                          src={rest.thumbnail}
                          className="w-full max-h-40 object-cover rounded-lg"
                        ></img>
                      </>
                    ) : (
                      <Logo />
                    )}
                  </div>
                  <p className="text-lg text-overflow">{rest.place_name}</p>
                  <p className="max-w-[330px] mb-1.5 text-gray-600 text-overflow">
                    {rest.road_address_name}
                  </p>
                  <div className="flex h-6 gap-2 items-start text-base text-gray-500">
                    <div className="flex gap-1 h-6">
                      <span className="flex justify-center items-center ">
                        <FullStar className="w-full h-full text-[#FF6445]" />
                      </span>
                      <span>{rest.rating}</span>
                    </div>
                    <div className="flex gap-1 h-6">
                      <span className="flex justify-center items-center ">
                        <Review className="mt-0.5" width="20px" height="20px" />
                      </span>
                      <span>{rest.reviews}</span>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li
                  key={rest.id}
                  className="flex flex-col w-[340px] items-start bg-white rounded-lg drop-shadow-lg p-4 cursor-pointer text-left"
                  onClick={() => RestViewToggle(rest)}
                >
                  <div className="bg-gray-300 h-40 w-full rounded-lg mb-3 content-center justify-items-center">
                    {rest.thumbnail ? (
                      <>
                        <img
                          src={rest.thumbnail}
                          className="w-full max-h-40 object-cover rounded-lg"
                        ></img>
                      </>
                    ) : (
                      <Logo />
                    )}
                  </div>
                  <p className="text-lg text-overflow">{rest.place_name}</p>
                  <p className="max-w-[330px] mb-1.5 text-gray-600 text-overflow">
                    {rest.road_address_name}
                  </p>
                  <div className="flex h-6 gap-2 items-start text-base text-gray-500">
                    <div className="flex gap-1 h-6">
                      <span className="flex justify-center items-center ">
                        <FullStar className="w-full h-full text-[#FF6445]" />
                      </span>
                      <span>{rest.rating}</span>
                    </div>
                    <div className="flex gap-1 h-6">
                      <span className="flex justify-center items-center ">
                        <Review className="mt-0.5" width="20px" height="20px" />
                      </span>
                      <span>{rest.reviews}</span>
                    </div>
                  </div>
                </li>
              </>
            )
          )}
        </div>
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
