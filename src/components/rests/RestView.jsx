import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import FullStar from "../../assets/full-star.svg?react";
import Cancel from "../../assets/cancel-icon.svg?react";
import Logo from "../../assets/header-logo.svg?react";
import { useEffect, useRef } from "react";
import RestReviewItem from "./RestReviewItem";
import axios from "axios";
import { motion } from "framer-motion"

export default function RestView({ center, close, pickedRest, star }) {
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current?.relayout();
    apiPOSTRestsLists(pickedRest.restaurantId, "0", "10");
  }, []);

  // 무한스크롤
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState("0");
  const [maxNumber, setMaxNumber] = useState(0);
  const observerRef = useRef();
  const boxRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(intersectionObserver); // IntersectionObserver
    if (boxRef.current) {
      observerRef.current.observe(boxRef.current);
      return () => observerRef.current && observerRef.current.disconnect();
    }
  }, [reviews]);

  const getInfo = async () => {
    if (maxNumber > Number(page) * 10 && maxNumber < (Number(page) + 1) * 10)
      return console.log("마지막페이지입니다.");
    apiPOSTRestsLists(pickedRest.restaurantId, String(Number(page) + 1), 10);
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

  //식당 리뷰 조회
  async function apiPOSTRestsLists(restId, page, size) {
    await axios
      .get(`/restaurants/1`, {
        params: { restId: restId, page: page, size: size },
      })
      .then((res) => {
        setReviews((prev) => [...prev, ...res.data.content]);
        setMaxNumber(res.data.page.totalElements);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // async function apiPOSTRestsLists(restId, page, size) {
  //   await axios
  //     .get(`${import.meta.env.VITE_BE_API_URL}/restaurants/${restId}/reviews`, {
  //       params: { page: page, size: size },
  //     })
  //     .then((res) => {
  //       setReviews((prev) => [...prev, ...res.data.content]);
  //       setMaxNumber(res.data.page.totalElements);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  return (
    <>
      {window.innerWidth > 1024 ? (
        <>
          <div className="bg-black/[0.1] fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden"></div>
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white p-8 rounded-lg w-[1024px] max-lg:w-full h-[700px] overflow-hidden z-50">
            <div className="flex flex-col gap-5 justify-between items-start max-w-[340px]">
              <div className="w-[340px] h-[200px] bg-gray-300 rounded-lg text-left flex justify-center items-center">
                {pickedRest.thumbnail ? (
                  <>
                    <img
                      src={pickedRest.thumbnail}
                      className="w-full h-[200px] object-cover rounded-lg"
                    ></img>
                  </>
                ) : (
                  <Logo/>
                )}
              </div>
              <div>
                <p className="text-xl font-bold text-left">
                  {pickedRest.place_name}
                </p>
                <div className="flex">
                  <div className="flex">
                    {star.map((item) =>
                      item ? (
                        <>
                          <FullStar width="24px" className="text-[#FF6445]"/>
                        </>
                      ) : (
                        <>
                          <FullStar width="24px" className="text-[#9ca3af]"/>
                        </>
                      )
                    )}
                  </div>
                  <span className="text-gray-400">{pickedRest.rating}</span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">연락처</p>
                <p className="text-gray-400">{pickedRest.phone}</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">주소</p>
                <p className="text-gray-500 text-left">
                  {pickedRest.road_address_name}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold mb-2">지도</p>
                <div className="w-[340px] h-[140px] rounded-lg">
                  <Map
                    className="w-full h-full z-50"
                    id="map"
                    center={center}
                    level={3}
                    ref={mapRef}
                  >
                    <MapMarker
                      position={center}
                      image={{
                        src: "/assets/map-marker.svg",
                        size: { width: 30, height: 30 },
                      }}
                    />
                  </Map>
                </div>
              </div>
            </div>
            <div className="w-0.5 bg-gray-100 mx-8"></div>
            <div className="flex gap-6 flex-col flex-1 overflow-hidden">
              <div className="text-xl font-bold text-left">방문자 리뷰</div>
              <div className="flex flex-col overflow-y-scroll scrollbar-hide overflow-x-hidden min-w-40 h-[600px]">
                <ul className="flex flex-col gap-6">
                  {reviews.map((review, idx) =>
                    reviews.length - 1 === idx ? (
                      <>
                        <RestReviewItem review={review} ref={boxRef}/>
                      </>
                    ) : (
                      <>
                        <RestReviewItem review={review}/>
                      </>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div
              className="absolute right-0 top-0 p-4 m-4 cursor-pointer"
              onClick={close}
            >
              <Cancel width="20px" height="20px"/>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-black/[0.1] fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden"></div>
          <div
            className="fixed sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 min-w-[320px] bg-white p-3 m-3 rounded-lg sm:w-[350px] sm:h-[600px] left-0 right-0 top-0 bottom-0 overflow-scroll z-50">
            <div className="flex flex-col gap-5 items-start ">
              <div className="relative flex flex-row gap-3 w-full">
                <div
                  className="basis-1/2 min-w-[100px] min-h-[100px] bg-gray-300 rounded-lg text-left content-center justify-items-center">
                  {pickedRest.thumbnail ? (
                    <>
                      <img
                        src={pickedRest.thumbnail}
                        className="min-h-[100%] object-cover rounded-lg"
                      ></img>
                    </>
                  ) : (
                    <Logo/>
                  )}
                  <div className="absolute bg-white px-2 py-0.5 rounded-full left-1.5 bottom-1.5 flex gap-0.5 items-center">
                    <FullStar width="16px" className="text-primary"/>
                    <span className="text-gray-400 text-sm">{pickedRest.rating}.0</span>
                  </div>
                </div>
                <div className="flex basis-1/2 flex-col text-sm justify-between">
                  <div className="flex flex-row gap-0.5 items-start">
                    <p className="font-bold text-left text-wrap">
                      {pickedRest.place_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-bold">연락처</p>
                    <p className="text-gray-400 text-xs">{pickedRest.phone}</p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-bold min-w-fit">주소</p>
                    <p className="text-gray-500 text-left text-xs">
                      {pickedRest.road_address_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full">
                <p className="font-bold mb-2">지도</p>
                <div className="w-full h-[200px] rounded-lg">
                  <Map
                    className="w-full h-full z-50"
                    id="map"
                    center={center}
                    level={3}
                    ref={mapRef}
                  >
                    <MapMarker
                      position={center}
                      image={{
                        src: "/assets/map-marker.svg",
                        size: { width: 30, height: 30 },
                      }}
                    />
                  </Map>
                </div>
              </div>
              <div className="flex gap-2 flex-col flex-1 overflow-hidden">
                <div className="font-bold text-left pt-5">방문자 리뷰</div>
                <ul className="flex flex-col gap-6">
                  {reviews.map((review, idx) =>
                    reviews.length - 1 === idx ? (
                      <>
                        <RestReviewItem review={review} ref={boxRef}/>
                      </>
                    ) : (
                      <>
                        <RestReviewItem review={review}/>
                      </>
                    )
                  )}
                </ul>
              </div>
            </div>
            <motion.div
              whileTap={{ scale: 0.95, backgroundColor: "rgb(230,80,50)" }}
              transition={{ duration: 0.1 }}
              className="w-14 h-14 flex justify-center  items-center fixed right-7 bottom-7 cursor-pointer bg-primary rounded-full"
              onClick={close}
            >
              <Cancel width="19px" height="19px" className="invert"/>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
