import { useState } from "react";
import axios from "axios";

export default function InfoWindow({ position, marker, setIsMatching }) {
  // 인원 선택
  const [choicedNumber, setChoicedNumber] = useState(2);

  // 인원 버튼 함수
  const minus = () => {
    if (choicedNumber >= 3) setChoicedNumber(choicedNumber - 1);
    else setChoicedNumber(2);
  };
  const plus = () => {
    if (choicedNumber === 5) {
      alert("높은 매칭률을 위해 최대 5명까지 매칭 가능합니다 :)");
      setChoicedNumber(5);
    } else {
      setChoicedNumber(choicedNumber + 1);
    }
  };

  // POST
  async function apiPOSTMatching(lng, lat, size, time, placeInfo) {
    console.log(lng);
    await axios
      .post("/matching/request", {
        userLon: lng,
        userLat: lat,
        groupSize: size,
        matchingStartTime: time,
        place: placeInfo,
      })
      .then((res) => {
        console.log(res.data);
        setIsMatching(true);
        window.sessionStorage.setItem("isMatching", true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const choicePlace = (marker, position) => {
    // 매칭 시작 라우트
    const place = {
      id: marker.id,
      name: marker.place_name,
      category_name: marker.category_name,
      road_address_name: marker.road_address_name,
      phone: marker.phone,
      lon: marker.x,
      lat: marker.y,
      place_url: marker.place_url,
    };
    apiPOSTMatching(
      position.lng,
      position.lat,
      choicedNumber,
      new Date(),
      place
    );
  };

  return (
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
              choicePlace(marker, position);
            }}
          >
            매칭 시작
          </button>
        </div>
      </div>
    </>
  );
}
