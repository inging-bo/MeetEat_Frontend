import { useEffect, useState } from "react";
import axios from "axios";
import FullStar from "../../assets/full-star.svg?react";
import Cancel from "../../assets/cancel-icon.svg?react";

export default function RestView({ close, pickedRest }) {
  // 스크롤방지
  useEffect(() => {
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
  }, []);

  return (
    <>
      <div className="bg-black/[0.1] absolute top-0 left-0 w-full h-full z-50 overflow-hidden"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-white p-8 rounded-lg w-[1024px] max-lg:w-full h-[664px] overflow-hidden z-50">
        <div className="flex flex-col gap-5 items-start">
          <div className="w-[340px] h-[200px] bg-gray-300 rounded-lg"></div>
          <div>
            <p className="text-xl font-bold text-left">
              {pickedRest.place_name}
            </p>
            <div className="flex">
              <div className="flex">
                <FullStar width="24px" className="text-[#FF6445]" />
                <FullStar width="24px" className="text-[#FF6445]" />
                <FullStar width="24px" className="text-[#FF6445]" />
                <FullStar width="24px" className="text-[#FF6445]" />
                <FullStar width="24px" className="text-[#FF6445]" />
              </div>
              <span className="text-gray-400">4</span>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold">연락처</p>
            <p className="text-gray-400">02-573-0211</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold">주소</p>
            <p className="text-gray-500">서울 관악구 관악로 148 1층</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold mb-2">지도</p>
            <div className="w-[320px] h-[140px] bg-gray-300 rounded-lg"></div>
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
