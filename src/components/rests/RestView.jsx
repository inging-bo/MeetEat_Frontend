import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import FullStar from "../../assets/full-star.svg?react";
import Cancel from "../../assets/cancel-icon.svg?react";
import Logo from "../../assets/header-logo.svg?react";
import { useEffect, useRef } from "react";
import RestReviewItem from "./RestReviewItem";
import axios from "axios";
import { motion } from "framer-motion";

export default function RestView({ center, close, pickedRest, star }) {
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current?.relayout();
    console.log(pickedRest);
    apiPOSTRestsLists(pickedRest.id, "0", "10");
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
    apiPOSTRestsLists(pickedRest.id, String(Number(page) + 1), 10);
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

  // //식당 리뷰 조회
  // async function apiPOSTRestsLists(restId, page, size) {
  //   await axios
  //     .get(
  //       `/restaurants/1`,
  //       {
  //         params: { restId: restId, page: page, size: size },
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       setReviews((prev) => [...prev, ...res.data.content]);
  //       setMaxNumber(res.data.page.totalElements);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  async function apiPOSTRestsLists(restId, page, size) {
    await axios
      .get(
        `${import.meta.env.VITE_BE_API_URL}/restaurants/${restId}/reviews`,
        {
          params: { page: page, size: size },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        setReviews((prev) => [...prev, ...res.data.content]);
        setMaxNumber(res.data.page.totalElements);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {window.innerWidth > 1024 ? (
        <>
          <div className="fixed left-0 top-0 z-50 h-screen w-screen overflow-hidden bg-black/[0.1]"></div>
          <div className="fixed left-1/2 top-1/2 z-50 flex h-[700px] w-[1024px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-lg bg-white p-8 shadow-xl max-lg:w-full">
            <div className="flex max-w-[340px] flex-col items-start justify-between gap-5 bg-white">
              <div className="flex h-[200px] w-[340px] items-center justify-center rounded-lg bg-gray-300 text-left">
                {pickedRest.thumbnail ? (
                  <>
                    {pickedRest.thumbnail.indexOf(",") !== -1 ? (
                      <>
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}${pickedRest.thumbnail.split(",")[0]}`}
                          className="h-[200px] w-full rounded-lg object-cover"
                        ></img>
                      </>
                    ) : (
                      <>
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}${pickedRest.thumbnail}`}
                          className="h-[200px] w-full rounded-lg object-cover"
                        ></img>
                      </>
                    )}
                  </>
                ) : (
                  <Logo />
                )}
              </div>
              <div>
                <p className="text-left text-xl font-bold">
                  {pickedRest.place_name}
                </p>
                <div className="flex">
                  <div className="flex">
                    {star.map((item) =>
                      item ? (
                        <>
                          <FullStar width="24px" className="text-[#FF6445]" />
                        </>
                      ) : (
                        <>
                          <FullStar width="24px" className="text-[#9ca3af]" />
                        </>
                      ),
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
                <p className="text-left text-gray-500">
                  {pickedRest.road_address_name}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="mb-2 font-bold">지도</p>
                <div className="h-[140px] w-[340px] rounded-lg">
                  <Map
                    className="z-50 h-full w-full"
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
            <div className="mx-8 w-0.5 bg-gray-100"></div>
            <div className="flex flex-1 flex-col gap-6 overflow-hidden">
              <div className="text-left text-xl font-bold">방문자 리뷰</div>
              <div className="flex h-[600px] min-w-40 flex-col overflow-x-hidden overflow-y-scroll scrollbar-hide">
                <ul className="flex flex-col gap-6">
                  {reviews.map((review, idx) =>
                    reviews.length - 1 === idx ? (
                      <>
                        <RestReviewItem review={review} ref={boxRef} />
                      </>
                    ) : (
                      <>
                        <RestReviewItem review={review} />
                      </>
                    ),
                  )}
                  {reviews.length === 0 && (
                    <div className="text-xs text-gray-500">
                      아직 등록된 방문자 리뷰가 없습니다.
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div
              className="absolute right-0 top-0 m-4 cursor-pointer p-4"
              onClick={close}
            >
              <Cancel width="20px" height="20px" />
            </div>
          </div>
        </>
      ) : (
        // 1024px 보다 작을 때
        <>
          <div className="fixed left-0 top-0 z-50 h-screen w-screen overflow-hidden bg-black/[0.1]"></div>
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 m-4 min-w-[320px] rounded-lg bg-white shadow-xl sm:left-1/2 sm:top-1/2 sm:h-[620px] sm:w-[370px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:transform">
            <div className="-shadow-lg absolute bottom-4 left-4 right-4 top-4 overflow-scroll rounded-lg bg-white shadow-[inset_0_15px_5px_-5px_rgba(0,0,0,0.03),inset_0_-15px_5px_-5px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col items-start gap-5">
                <div className="relative flex w-full flex-row gap-3">
                  <div className="h-[128px] max-h-[128px] w-[140px] basis-1/2 content-center justify-items-center rounded-lg bg-gray-300 text-left">
                    {pickedRest.thumbnail ? (
                      <>
                        {pickedRest.thumbnail.indexOf(",") !== -1 ? (
                          <>
                            <img
                              src={`${import.meta.env.VITE_IMG_URL}${pickedRest.thumbnail.split(",")[0]}`}
                              className="h-[128px] w-full rounded-lg object-cover"
                            ></img>
                          </>
                        ) : (
                          <>
                            <img
                              src={`${import.meta.env.VITE_IMG_URL}${pickedRest.thumbnail}`}
                              className="h-[128px] w-full rounded-lg object-cover"
                            ></img>
                          </>
                        )}
                      </>
                    ) : (
                      <Logo className="max-h-[100px] max-w-[120px]" />
                    )}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5">
                      <FullStar width="16px" className="text-primary" />
                      <span className="text-sm text-gray-400">
                        {pickedRest.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex basis-1/2 flex-col justify-between text-sm">
                    <div className="flex flex-row items-start gap-0.5">
                      <p className="text-wrap text-left font-bold">
                        {pickedRest.place_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="font-bold">연락처</p>
                      <p className="text-xs text-gray-400">
                        {pickedRest.phone}
                      </p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="min-w-fit font-bold">주소</p>
                      <p className="text-left text-xs text-gray-500">
                        {pickedRest.road_address_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start">
                  <p className="mb-2 font-bold">지도</p>
                  <div className="h-[200px] w-full rounded-lg">
                    <Map
                      className="h-full w-full"
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
                <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                  <div className="pt-5 text-left font-bold">방문자 리뷰</div>
                  <ul className="flex flex-col gap-6">
                    {reviews.map((review, idx) =>
                      reviews.length - 1 === idx ? (
                        <>
                          <RestReviewItem review={review} ref={boxRef} />
                        </>
                      ) : (
                        <>
                          <RestReviewItem review={review} />
                        </>
                      ),
                    )}
                    {reviews.length === 0 && (
                      <div className="text-xs text-gray-500">
                        아직 등록된 방문자 리뷰가 없습니다.
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <motion.div
              whileTap={{ scale: 0.95, backgroundColor: "rgb(230,80,50)" }}
              transition={{ duration: 0.1 }}
              className="fixed bottom-12 right-12 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary sm:bottom-7 sm:right-7"
              onClick={close}
            >
              <Cancel width="19px" height="19px" className="invert" />
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
