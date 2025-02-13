import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Map, Circle } from "react-kakao-maps-sdk";
import ReactLoading from "react-loading";
import axios from "axios";
import modalStore from "../../store/modalStore.js";
import { EventSourcePolyfill } from "event-source-polyfill";

export default function Matching({
  setIsMatching,
  setIsMatched,
  selectedMarker,
  position,
  number,
}) {
  const navigate = useNavigate();

  // 뒤로가기 방지
  history.pushState(null, document.title, location.href); // push

  const categoryName = selectedMarker.category_name.slice(
    selectedMarker.category_name.lastIndexOf(">") + 2
  );

  useEffect(() => {
    const place = {
      id: selectedMarker.id,
      name: selectedMarker.place_name,
      category_name: selectedMarker.category_name,
      road_address_name: selectedMarker.road_address_name,
      phone: selectedMarker.phone,
      lon: selectedMarker.x,
      lat: selectedMarker.y,
      place_url: selectedMarker.place_url,
    };
    // apiPOSTMatching(position.lng, position.lat, number, new Date(), place);
    fetchSSE(position.lng, position.lat, number, new Date(), place);
  }, []);

  // SSE fetch
  const fetchSSE = (lng, lat, size, time, placeInfo) => {
    // header 보내기 위해 EventSourcePolyfill 사용
    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_BE_API_URL}/api/sse/subscribe`,
      {
        headers: {
          Authorization: `${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    eventSource.onopen = () => {
      // 연결 시 매칭 요청 api 실행
      axios
        .post(
          `${import.meta.env.VITE_BE_API_URL}/matching/request`,
          {
            userLon: lng,
            userLat: lat,
            groupSize: size,
            matchingStartTime: time,
            place: placeInfo,
          },
          {
            headers: {
              Authorization: `${window.localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setIsMatching("true");
          window.sessionStorage.setItem("isMatching", "true");
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // 방법1. onmessage 이용용
    // eventSource.onmessage = async (e) => {
    //   const res = await e.data;
    //   const parsedData = JSON.parse(res);
    //   받아오는 data로 할 일
    //   if (parsedData === "임시 모임이 생성되었습니다.") {
    //     setIsMatched(true);
    //     window.sessionStorage.setItem("tempPosition", JSON.stringify(position));
    //     window.sessionStorage.setItem("isMatched", "true");
    //     window.sessionStorage.setItem(
    //       "matchingData",
    //       JSON.stringify(parsedData)
    //     );
    //     navigate(`/matching/check-place/${parsedData.teamId}`);
    //   }
    // };

    // 방법2. EventListener
    eventSource.addEventListener("TempTeam", (e) => {
      setIsMatched(true);
      window.sessionStorage.setItem("tempPosition", JSON.stringify(position));
      window.sessionStorage.setItem("isMatched", "true");
      window.sessionStorage.setItem("matchingData", JSON.stringify(e.data));
      navigate(`/matching/check-place/${e.data.teamId}`);
    });

    eventSource.onerror = (e) => {
      // 종료 또는 에러 발생 시 할 일
      eventSource.close();
      if (e.error) {
        // 에러 발생 시 할 일
      }
      if (e.target.readyState === EventSource.CLOSED) {
        // 종료 시 할 일
      }
    };
  };

  // // POST
  // async function apiPOSTMatching(lng, lat, size, time, placeInfo) {
  //   await axios
  //     .get(`${import.meta.env.VITE_BE_API_URL}/api/sse/subscribe`, {
  //       headers: {
  //         Authorization: `${window.localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then(() => {
  //       console.log("SSE구독");
  //       axios
  //         .post(
  //           `${import.meta.env.VITE_BE_API_URL}/matching/request`,
  //           {
  //             userLon: lng,
  //             userLat: lat,
  //             groupSize: size,
  //             matchingStartTime: time,
  //             place: placeInfo,
  //           },
  //           {
  //             headers: {
  //               Authorization: `${window.localStorage.getItem("token")}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           console.log(res.data);
  //           setIsMatching("true");
  //           window.sessionStorage.setItem("isMatching", "true");
  //           // setTimeout(
  //           //   () =>
  //           //     axios
  //           //       .get(
  //           //         `http://${import.meta.env.VITE_BE_API_URL}/api/matching/complete`,
  //           //         {
  //           //           headers: {
  //           //             Authorization: `${window.localStorage.getItem("token")}`,
  //           //           },
  //           //         }
  //           //       )
  //           //       .then((res) => {
  //           //         setIsMatched(true);
  //           //         window.sessionStorage.setItem(
  //           //           "tempPosition",
  //           //           JSON.stringify(position)
  //           //         );
  //           //         window.sessionStorage.setItem("isMatched", "true");
  //           //         window.sessionStorage.setItem(
  //           //           "matchingData",
  //           //           JSON.stringify(res)
  //           //         );
  //           //         navigate(`/matching/check-place/${res.data.teamId}`);
  //           //       })
  //           //       .catch(function (error) {
  //           //         console.log(error);
  //           //       }),
  //           //   [5000]
  //           // );
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  // 타이머
  const MINUTES_IN_MS = 10 * 60 * 1000;
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const second = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      // 타이머 종료시 매칭 취소 api 전송
      clearInterval(timer);
      console.log("타이머가 종료되었습니다.");
      apiPOSTCancel();
      window.sessionStorage.removeItem("isMatching");
      setIsMatching(false);
      setIsMatched(false);
      history.go(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  async function apiPOSTCancel() {
    await axios
      .post(`${import.meta.env.VITE_BE_API_URL}/matching/cancel`, {
        headers: {
          Authorization: `${window.localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const cancelMatching = () => {
    // 모달을 열고 콜백 함수 전달
    modalStore.openModal("twoBtn", {
      message: "매칭을 취소하시겠습니까?",
      onConfirm: async () => {
        // 예를 선택했을 때 실행할 코드
        await apiPOSTCancel();
        window.sessionStorage.removeItem("isMatching");
        window.sessionStorage.removeItem("isMatched");
        setIsMatching(false);
        setIsMatched(false);
        history.go(0);
        modalStore.closeModal();
      },
    });
  };

  return (
    <>
      <div className="bg-map relative w-full h-full">
        <div className="bg-black/40 absolute w-full h-full z-10"></div>
        <Map className="w-full h-full" id="map" center={position} level={5}>
          <Circle
            center={position}
            radius={2000}
            strokeColor={"#81be67"}
            strokeWeight={1}
            strokeOpacity={1}
            fillColor={"#b2e39d"}
            fillOpacity={0.23}
          />
        </Map>
      </div>
      <div className="matching-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-white rounded-lg drop-shadow-2xl z-20">
        <div className="info-container absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 w-full h-full">
          <ReactLoading
            type={"spin"}
            color={"#FF6445"}
            height={40}
            width={40}
          />
          <p className="text-xl font-bold pt-5">
            {number}명의 인원과 매칭할 수 있는
            <br /> 주변 사람들을 찾고 있어요
          </p>
          <p className="text-base">
            남은시간 {minutes}:{second}
          </p>
          <div className="bg-[#F8F8F8] w-[310px] h-[90px] rounded-lg">
            <div className="flex flex-row items-center pt-[12px] pb-[5px] px-[16px] text-left">
              <p className="max-w-[200px] text-overflow">
                {selectedMarker.place_name}
              </p>
              <p className="max-w-[90px] text-overflow text-[12px] text-[#A2A2A2] pl-2">
                {categoryName}
              </p>
            </div>
            <p className="text-[#555555] text-left text-[14px] px-[16px]">
              {selectedMarker.road_address_name}
            </p>
          </div>
        </div>
        <button
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-[#555555] text-[14px]"
          onClick={cancelMatching}
        >
          매칭취소
        </button>
      </div>
    </>
  );
}
