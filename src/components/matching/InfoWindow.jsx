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
    if (choicedNumber >= 3) setChoicedNumber(choicedNumber - 1);
    else setChoicedNumber(2);
  };
  const plus = () => {
    if (choicedNumber === 5) {
      return modalStore.openModal("oneBtn", {
        message: (
          <>
            <div>높은 매칭률을 위해 최대 5명까지 매칭 가능합니다.</div>
          </>
        ),
        onConfirm: async () => {
          setChoicedNumber(5);
          modalStore.closeModal();
        },
      });
    } else {
      setChoicedNumber(choicedNumber + 1);
    }
  };

  const navigate = useNavigate();

  const choicePlace = async (marker) => {
    if (!isLoggedIn)
      return modalStore.openModal("oneBtn", {
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
    if (!window.sessionStorage.getItem("isPenalty")) {
      return modalStore.openModal("oneBtn", {
        message: (
          <>
            <div>매칭 3분 후 취소로</div>
            <div>패널티가 부여된 계정입니다.</div>
          </>
        ),
        onConfirm: () => {
          modalStore.closeModal();
        },
      });
    }
    setIsMatching("true");
    setSelectedMarker(marker);
    setNumber(choicedNumber);
  };

  return (
    <>
      {window.innerWidth > 767 ? (
        <>
          <div className="fixed drop-shadow-lg">
            <div className="w-[320px] rounded-lg bg-white p-5">
              <div className="text-left">
                <div className="flex flex-row items-start justify-between pb-[8px]">
                  <p className="max-w-[200px] whitespace-normal text-base font-bold">
                    {marker.place_name}
                  </p>
                  <p className="text-sm text-[#555555]">
                    {marker.category_name.slice(
                      marker.category_name.lastIndexOf(">") + 2,
                    )}
                  </p>
                </div>
                <p className="text-sm text-[#555555]">
                  {marker.road_address_name}
                </p>
                <p className="pb-1 text-sm text-[#555555]">{marker.phone}</p>
                <a
                  href={marker.place_url}
                  className="block pb-2 text-sm text-[#555555]"
                >
                  가게 정보 더보기
                </a>
                <p className="pb-5 text-sm text-[#909090]">
                  내 위치에서 {marker.distance}m
                </p>
                <hr className="pb-5" />
                <div>
                  <p className="whitespace-normal pb-4 text-base font-bold">
                    방문할 인원을 선택해주세요.
                  </p>
                  <div className="flex flex-row justify-between text-sm">
                    <p>인원</p>
                    <div className="flex h-[30px] w-[100px] flex-row items-center justify-between rounded-lg border border-[#E8E8E8] text-[#909090]">
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
                className="mt-5 w-full rounded-lg bg-[#FF6445] py-2 text-white"
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
          <div className="fixed w-[250px] drop-shadow-lg">
            <div className="rounded-lg bg-white p-4">
              <div className="text-left">
                <div className="flex flex-row items-start justify-between pb-[8px]">
                  <p className="max-w-[200px] whitespace-normal text-sm font-bold">
                    {marker.place_name}
                  </p>
                  <p className="text-xs text-[#555555]">
                    {marker.category_name.slice(
                      marker.category_name.lastIndexOf(">") + 2,
                    )}
                  </p>
                </div>
                <p className="text-xs text-[#555555]">
                  {marker.road_address_name}
                </p>
                <p className="pb-1 text-xs text-[#555555]">{marker.phone}</p>
                <a
                  href={marker.place_url}
                  className="block pb-2 text-xs text-[#555555]"
                >
                  가게 정보 더보기
                </a>
                <p className="pb-4 text-xs text-[#909090]">
                  내 위치에서 {marker.distance}m
                </p>
                <hr className="pb-4" />
                <div>
                  <p className="whitespace-normal pb-4 text-sm font-bold">
                    방문할 인원을 선택해주세요.
                  </p>
                  <div className="flex flex-row justify-between text-xs">
                    <p>인원</p>
                    <div className="flex h-[30px] w-[100px] flex-row items-center justify-between rounded-lg border border-[#E8E8E8] text-[#909090]">
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
                className="mt-4 w-full rounded-lg bg-[#FF6445] py-[6px] text-xs text-white"
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
