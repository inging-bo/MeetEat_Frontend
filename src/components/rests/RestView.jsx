import { Map, MapMarker } from "react-kakao-maps-sdk";
import FullStar from "../../assets/full-star.svg?react";
import Cancel from "../../assets/cancel-icon.svg?react";
import Logo from "../../assets/header-logo.svg?react";
import { useEffect, useRef } from "react";

export default function RestView({ center, close, pickedRest, star }) {
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current?.relayout();
  }, []);

  return (
    <>
      <div className="bg-black/[0.1] fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white p-8 rounded-lg w-[1024px] max-lg:w-full h-[664px] overflow-hidden z-50">
        <div className="flex flex-col gap-5 items-start max-w-[340px]">
          <div className="w-[340px] h-[200px] bg-gray-300 rounded-lg text-left content-center justify-items-center">
            {pickedRest.imgUrl ? (
              <>
                <img src={pickedRest.imgUrl}></img>
              </>
            ) : (
              <Logo />
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
                      <FullStar width="24px" className="text-[#FF6445]" />
                    </>
                  ) : (
                    <>
                      <FullStar width="24px" className="text-[#9ca3af]" />
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
                    src: "../../../public/assets/map-marker.svg",
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
          <div className="flex flex-col overflow-y-scroll scrollbar-hide overflow-x-hidden min-w-40 h-[548px]">
            <ul className="flex flex-col gap-6">
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">
                  반찬까지 맛있다맛있다맛있다맛있다요
                </p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">
                    마우스 슬라이드 기능 넣기
                  </li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">
                  반찬까지 맛있다맛있다맛있다맛있다요
                </p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">
                    마우스 슬라이드 기능 넣기
                  </li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">
                  반찬까지 맛있다맛있다맛있다맛있다요
                </p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">
                    마우스 슬라이드 기능 넣기
                  </li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">
                  반찬까지 맛있다맛있다맛있다맛있다요
                </p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">
                    마우스 슬라이드 기능 넣기
                  </li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                    <FullStar width="16px" className="text-[#FF6445]" />
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">
                  반찬까지 맛있다맛있다맛있다맛있다요
                </p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">
                    마우스 슬라이드 기능 넣기
                  </li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 p-4 m-4 cursor-pointer"
          onClick={close}
        >
          <Cancel width="20px" height="20px" />
        </div>
      </div>
    </>
  );
}
