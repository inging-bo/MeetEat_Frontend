import { useState } from "react";

export default function InfoWindow({ marker }) {
  // 장소, 인원 선택
  const [choicedPlace, setChoicedPlace] = useState("");
  const [choicedNumber, setChoicedNumber] = useState(1);

  // 인원 버튼 함수수
  const minus = () => {
    if (choicedNumber >= 2) setChoicedNumber(choicedNumber - 1);
    else setChoicedNumber(1);
  };
  const plus = () => {
    setChoicedNumber(choicedNumber + 1);
  };

  const choicePlace = (marker) => {
    console.log(marker);
    setChoicedPlace(marker);
    // 매칭 시작 라우트
  };

  return (
    <div className="drop-shadow-lg fixed">
      <div className="bg-white p-5 rounded-lg w-[320px]">
        <div className="text-left">
          <div className="flex flex-row justify-between items-start pb-[8px]">
            <p className="font-bold text-base max-w-[200px] whitespace-normal">
              {marker.place_name}
            </p>
            <p className="text-sm text-[#555555]">
              {marker.category_name.slice(
                marker.category_name.lastIndexOf(">") + 2
              )}
            </p>
          </div>
          <p className="text-sm text-[#555555]">{marker.road_address_name}</p>
          <p className="text-sm pb-1 text-[#555555]">{marker.phone}</p>
          <a
            href={marker.place_url}
            className="block text-sm text-[#555555] pb-2"
          >
            가게 정보 더보기
          </a>
          <p className="text-sm pb-5 text-[#909090]">
            내 위치에서 {marker.distance}m
          </p>
          <hr className="pb-5" />
          <div>
            <p className="font-bold text-base whitespace-normal pb-4">
              방문할 인원을 선택해주세요.
            </p>
            <div className="flex flex-row justify-between text-sm ">
              <p>인원</p>
              <div className="flex flex-row items-center justify-between border border-[#E8E8E8] w-[100px] h-[30px] rounded-lg text-[#909090]">
                <button
                  className="w-[30px] text-center text-2xl"
                  onClick={minus}
                >
                  -
                </button>
                <p>{choicedNumber}</p>
                <button className="w-[30px] text-center text-xl" onClick={plus}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          id="choiceBtn"
          className="bg-[#FF6445] w-full rounded-lg py-2 mt-5 text-white"
          onClick={() => {
            choicePlace(marker);
          }}
        >
          매칭 시작
        </button>
      </div>
    </div>
  );
}
