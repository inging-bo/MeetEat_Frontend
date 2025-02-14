import { useState } from "react";
import modalStore from "../../store/modalStore.js";
import { useNavigate } from "react-router-dom";

export default function InfoWindow({
  marker,
  setIsMatching,
  setSelectedMarker,
  setNumber,
  isLoggedIn,
}) {
  // 인원 선택
  const [choicedNumber, setChoicedNumber] = useState(2);

  // 인원 버튼 함수
  const minus = () => {
    if (choicedNumber >= 2) setChoicedNumber(choicedNumber - 1);
    else setChoicedNumber(1);
  };
  const plus = () => {
    if (choicedNumber === 5) {
      alert("높은 매칭률을 위해 최대 5명까지 매칭 가능합니다 :)");
      setChoicedNumber(5);
    } else {
      setChoicedNumber(choicedNumber + 1);
    }
  };

  const navigate = useNavigate();

  const choicePlace = async (marker) => {
    if (!isLoggedIn)
      return modalStore.openModal("twoBtn", {
        message: (
          <>
            <div>로그인 후 이용할 수 있습니다.</div>
            <div>로그인 하시겠어요?</div>
          </>
        ),
        onConfirm: async () => {
          await navigate("/account");
          modalStore.closeModal();
        },
      });
    setIsMatching("true");
    setSelectedMarker(marker);
    setNumber(choicedNumber);
  };

  return (
    <>
      {window.innerWidth > 767 ? (
        <>
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
                <p className="text-sm text-[#555555]">
                  {marker.road_address_name}
                </p>
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
                      <button
                        className="w-[30px] text-center text-xl"
                        onClick={plus}
                      >
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
        </>
      ) : (
        <>
          <div className="drop-shadow-lg fixed w-[250px]">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-left">
                <div className="flex flex-row justify-between items-start pb-[8px]">
                  <p className="font-bold text-sm max-w-[200px] whitespace-normal">
                    {marker.place_name}
                  </p>
                  <p className="text-xs text-[#555555]">
                    {marker.category_name.slice(
                      marker.category_name.lastIndexOf(">") + 2
                    )}
                  </p>
                </div>
                <p className="text-xs text-[#555555]">
                  {marker.road_address_name}
                </p>
                <p className="text-xs pb-1 text-[#555555]">{marker.phone}</p>
                <a
                  href={marker.place_url}
                  className="block text-xs text-[#555555] pb-2"
                >
                  가게 정보 더보기
                </a>
                <p className="text-xs pb-4 text-[#909090]">
                  내 위치에서 {marker.distance}m
                </p>
                <hr className="pb-4" />
                <div>
                  <p className="font-bold text-sm whitespace-normal pb-4">
                    방문할 인원을 선택해주세요.
                  </p>
                  <div className="flex flex-row justify-between text-xs">
                    <p>인원</p>
                    <div className="flex flex-row items-center justify-between border border-[#E8E8E8] w-[100px] h-[30px] rounded-lg text-[#909090]">
                      <button
                        className="w-[30px] text-center text-2xl"
                        onClick={minus}
                      >
                        -
                      </button>
                      <p>{choicedNumber}</p>
                      <button
                        className="w-[30px] text-center text-xl"
                        onClick={plus}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                id="choiceBtn"
                className="bg-[#FF6445] w-full rounded-lg py-[6px] mt-4 text-white  text-xs"
                onClick={() => {
                  choicePlace(marker);
                }}
              >
                매칭 시작
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
