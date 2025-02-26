import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Map, Circle } from "react-kakao-maps-sdk";
import ReactLoading from "react-loading";
import modalStore from "../../store/modalStore.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import matchingStore from "../../store/matchingStore";
import { callApi } from "../hooks/useAxios";

export default function Matching({
  setIsMatching,
  selectedMarker,
  setInfo,
  position,
  number,
}) {
  const navigate = useNavigate();

  const apiPOSTCancel = async () => {
    const resPostCancel = await callApi("/matching/cancel", "POST", {});
    if (resPostCancel.status === 200) {
      window.sessionStorage.removeItem("isMatching");
      window.sessionStorage.removeItem("isMatched");
      matchingStore.setIsMatching(false);
      matchingStore.setIsMatched(false);
      setIsMatching(false);
      setInfo(false);
    }
  };

  // 뒤로가기 방지
  history.pushState(null, null, "/");
  useEffect(() => {
    const popStateFunc = () => {
      alert("페이지를 이동하여 자동으로 매칭이 취소됩니다.");
      window.sessionStorage.removeItem("tempPosition");
      window.sessionStorage.removeItem("isMatching");
      apiPOSTCancel();
    };

    window.addEventListener("popstate", () => {
      popStateFunc;
    });

    window.removeEventListener("popstate", popStateFunc);
  }, []);

  // fetchSSE
  const categoryName = selectedMarker.category_name.slice(
    selectedMarker.category_name.lastIndexOf(">") + 2,
  );
  useEffect(() => {
    const place = {
      id: selectedMarker.id,
      name: selectedMarker.place_name,
      category_name: selectedMarker.category_name,
      road_address_name: selectedMarker.road_address_name,
      phone: selectedMarker.phone,
      lon: selectedMarker.position.lng,
      lat: selectedMarker.position.lat,
      place_url: selectedMarker.place_url,
    };

    // SSE fetch
    const fetchSSE = (lng, lat, size, time, placeInfo) => {
      // header 보내기 위해 EventSourcePolyfill 사용
      const eventSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_BE_API_URL}/sse/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          heartbeatTimeout: 10 * 60 * 1000,
          withCredentials: true,
        },
      );

      // SSE fetch 완료 후 매칭 요청 전송
      eventSource.onopen = () => {
        console.log("lng:" + position.lng + ",lat:" + position.lat);
        const resPostReq = callApi("/matching/request", "POST", {
          userLon: lng,
          userLat: lat,
          groupSize: size,
          matchingStartTime: time,
          place: placeInfo,
        });
        console.log("resPostReq");
        console.log(resPostReq);
        setIsMatching("true");
        window.sessionStorage.setItem("isMatching", true);
      };

      // 임시 모임 생성 Event 발생
      eventSource.addEventListener("TempTeam", (e) => {
        window.sessionStorage.setItem("tempPosition", JSON.stringify(position));
        window.sessionStorage.setItem("isMatched", true);
        window.sessionStorage.setItem("matchingData", e.data);
        console.log(JSON.parse(e.data));
        navigate(`/matching/check-place/${JSON.parse(e.data).teamId}`);
        eventSource.close();
      });

      eventSource.onerror = () => {
        console.log("eventsource 에러");
        apiPOSTCancel();
        eventSource.close();
      };
    };

    const getConnectionCheck = async () => {
      const resConnectionCheck = await callApi("/sse/connection-check", "GET");
      console.log("/sse/connection-check");
      console.log(resConnectionCheck.data);
      if (resConnectionCheck.data) {
        window.sessionStorage.removeItem("isMatching");
        window.sessionStorage.removeItem("isMatched");
        matchingStore.setIsMatching(false);
        matchingStore.setIsMatched(false);
        setIsMatching(false);
        setInfo(false);
        return alert("매칭중인 세션이 존재하여 서비스 이용이 불가능합니다.");
      } else {
        fetchSSE(position.lng, position.lat, number, new Date(), place);
      }
    };
    getConnectionCheck();
  }, []);

  // // POST
  // async function apiPOSTMatching(lng, lat, size, time, placeInfo) {
  //   await axios
  //     .get(`${import.meta.env.VITE_BE_API_URL}/sse/subscribe`, {
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
  //           window.sessionStorage.setItem("isMatching", true);
  //           setTimeout(
  //             () =>
  //               axios
  //                 .get(`${import.meta.env.VITE_BE_API_URL}/matching/complete`, {
  //                   headers: {
  //                     Authorization: `${window.localStorage.getItem("token")}`,
  //                   },
  //                 })
  //                 .then((res) => {
  //                   setIsMatched(true);
  //                   window.sessionStorage.setItem(
  //                     "tempPosition",
  //                     JSON.stringify(position)
  //                   );
  //                   window.sessionStorage.setItem("isMatched", true);
  //                   window.sessionStorage.setItem(
  //                     "matchingData",
  //                     JSON.stringify(res)
  //                   );
  //                   navigate(`/matching/check-place/${res.data.teamId}`);
  //                 })
  //                 .catch(function (error) {
  //                   console.log(error);
  //                 }),
  //             [5000]
  //           );
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
    "0",
  );
  const second = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - INTERVAL);
    }, INTERVAL);

    if (timeLeft <= 0) {
      // 타이머 종료시 매칭 취소
      clearInterval(timer);
      console.log("타이머가 종료되었습니다.");
      apiPOSTCancel();
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  const cancelMatching = () => {
    // 모달을 열고 콜백 함수 전달
    modalStore.openModal("twoBtn", {
      message: "매칭을 취소하시겠습니까?",
      onConfirm: () => {
        apiPOSTCancel();
        modalStore.closeModal();
      },
    });
  };

  return (
    <>
      <div className="bg-map relative h-full w-full">
        <div className="absolute z-10 h-full w-full bg-black/40"></div>
        <Map className="h-full w-full" id="map" center={position} level={5}>
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
      <div className="matching-container absolute left-1/2 top-1/2 z-20 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white drop-shadow-2xl sm:h-[380px] sm:w-[380px]">
        <div className="info-container absolute left-1/2 top-[49%] flex h-full w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-4 sm:top-[47%]">
          <ReactLoading
            type={"spin"}
            color={"#FF6445"}
            height={40}
            width={40}
          />
          <p className="pt-0 text-base font-bold sm:pt-5 sm:text-xl">
            {number}명의 인원과 매칭할 수 있는
            <br /> 주변 사람들을 찾고 있어요
          </p>
          <p className="text-sm sm:text-base">
            남은시간 {minutes}:{second}
          </p>
          <div className="h-[70px] w-[270px] rounded-lg bg-[#F8F8F8] sm:h-[90px] sm:w-[310px]">
            <div className="flex flex-row items-center px-[16px] pb-[5px] pt-[12px] text-left">
              <p className="text-overflow max-w-[200px] text-sm sm:text-base">
                {selectedMarker.place_name}
              </p>
              <p className="text-overflow max-w-[90px] pl-2 text-xs text-[#A2A2A2] sm:text-[12px]">
                {categoryName}
              </p>
            </div>
            <p className="px-[16px] text-left text-xs text-[#555555] sm:text-[14px]">
              {selectedMarker.road_address_name}
            </p>
          </div>
        </div>
        <button
          className="absolute bottom-3 left-1/2 -translate-x-1/2 transform text-xs text-[#555555] sm:bottom-5 sm:text-[14px]"
          onClick={cancelMatching}
        >
          매칭취소
        </button>
      </div>
    </>
  );
}
