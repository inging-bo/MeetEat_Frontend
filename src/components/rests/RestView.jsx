import FullStar from "../../assets/full-star.svg?react"
import Cancel from "../../assets/cancel-icon.svg?react"

export default function RestView({close}) {

  return (
    <div className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full">
      <div className="relative flex bg-white p-8 rounded-lg w-[1024px] max-lg:w-full h-[664px] overflow-hidden">
        <div className="flex flex-col gap-5 items-start">
          <div className="w-[340px] h-[200px] bg-gray-300 rounded-lg"></div>
          <div>
            <p className="text-xl font-bold">정남옥 서울대입구점</p>
            <div className="flex">
              <div className="flex">
                <FullStar width="24px" className="text-[#FF6445]"/>
                <FullStar width="24px" className="text-[#FF6445]"/>
                <FullStar width="24px" className="text-[#FF6445]"/>
                <FullStar width="24px" className="text-[#FF6445]"/>
                <FullStar width="24px" className="text-[#FF6445]"/>
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
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">마우스 슬라이드 기능 넣기</li>
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg"></li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 items-start">
                <p className="font-bold">맛도리</p>
                <div className="flex gap-1">
                  <div className="flex">
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">마우스 슬라이드 기능 넣기</li>
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
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">마우스 슬라이드 기능 넣기</li>
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
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">마우스 슬라이드 기능 넣기</li>
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
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                    <FullStar width="16px" className="text-[#FF6445]"/>
                  </div>
                  <span className="text-gray-400 text-sm">2025.01.13</span>
                </div>
                <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
                  <li className="shrink-0 w-[100px] h-[100px] bg-gray-300 rounded-lg">마우스 슬라이드 기능 넣기</li>
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
          <Cancel width="20px" height="20px"/>
        </div>
      </div>
    </div>
  )
}
