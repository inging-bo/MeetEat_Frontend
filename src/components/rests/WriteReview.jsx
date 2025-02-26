import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import EmptyStar from "../../assets/empty-star.svg?react";
import FullStar from "../../assets/full-star.svg?react";
import { Map } from "react-kakao-maps-sdk";
import authStore from "../../store/authStore";

export default function WriteReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const info = { ...location.state };
  // 로그인 확인
  useEffect(() => {
    !authStore.loggedIn && alert("로그인 후 이용해주세요!");
    !authStore.loggedIn && window.location.replace("/");
    if (Object.keys(info).length === 0) return window.location.replace("/");
  }, []);

  // 초기 빈 별 그리기
  const [starScore, setStarScore] = useState(1);
  const handleRatingStar = () => {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(
        <span
          className="w-[50px] text-[#FF6445]"
          key={i + 1}
          onClick={() => setStarScore(i + 1)}
        >
          {i + 1 <= starScore ? (
            <FullStar className="star" />
          ) : (
            <EmptyStar className="star" />
          )}
        </span>,
      );
    }
    return result;
  };

  // 이미지 핸들러
  const [imageList, setImageList] = useState([]);
  const [postImageList, setPostImageList] = useState([]);

  const handleAddImages = (e) => {
    const files = e.target.files;
    let imageUrlLists = [...imageList];
    let postImageLists = [...postImageList];
    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlLists.push(currentImageUrl);
      postImageLists.push(files[i]);
    }

    if (imageUrlLists.length > 7) {
      imageUrlLists = imageUrlLists.slice(0, 7);
      postImageLists = postImageLists.slice(0, 7);
      alert("사진은 최대 7장까지 첨부 가능합니다.");
    }
    setImageList(imageUrlLists);
    setPostImageList(postImageLists);
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (idx) => {
    const tempArr = [...imageList].filter((_, index) => index !== idx);
    const tempPostArr = [...postImageList].filter((_, index) => index !== idx);
    setImageList(tempArr);
    setPostImageList(tempPostArr);
  };
  console.log("매칭 완료 후 넘어오는 state의 info", info)
  // 이미지 다음에 작성
  const handleWriteNext = () => {
    axios
      .post(
        `${import.meta.env.VITE_BE_API_URL}/matching/history/${info.matchingHistoryId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        alert("해당 리뷰는 마이페이지에서 다시 작성하실 수 있습니다.");
        window.sessionStorage.removeItem("isCompleted");
        window.sessionStorage.removeItem("isMatched");
        window.sessionStorage.removeItem("matchedData");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleWriteComplete = () => {
    const textareaValue = document.getElementById("textarea").value;
    apiRestReviewWrite(info.matchingHistoryId, textareaValue);
  };

  async function apiRestReviewWrite(matchingHistoryId, textareaValue) {
    const formData = new FormData();
    if (postImageList && postImageList.length > 0) {
      postImageList.forEach((file) => {
        formData.append("files", file);
      });
    }
    console.log(matchingHistoryId, textareaValue)
    formData.append("matchingHistoryId", matchingHistoryId);
    formData.append("rating", starScore);
    formData.append("description", textareaValue);

    for (const x of formData.entries()) {
      console.log(x);
    }

    await axios
      .post(`${import.meta.env.VITE_BE_API_URL}/restaurants/review`, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("작성 완료되었습니다.");
        window.sessionStorage.removeItem("isCompleted");
        window.sessionStorage.removeItem("isMatched");
        window.sessionStorage.removeItem("matchedData");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("방문 후기를 작성해주세요!");
      });
  }

  // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지\
  const [position, setPosition] = useState({
    lat: 37.503081,
    lng: 127.05,
  });
  const gpsError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  const geolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 5 * 60 * 1000,
    timeout: 7000,
  };
  // geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (
          pos.coords.latitude !== position.lat ||
          pos.coords.longitude !== position.lng
        ) {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      },
      gpsError,
      geolocationOptions,
    );
  }, []);

  return (
    <>
      <div className="bg-map relative h-svh w-full">
        <div className="absolute z-10 h-svh w-full bg-black/40"></div>
        <Map id="map" className="h-svh w-full" center={position} level={5} />
      </div>
      <div className="absolute left-1/2 top-1/2 z-20 flex h-[550px] w-[350px] -translate-x-1/2 -translate-y-1/2 transform flex-col place-items-center gap-3 rounded-lg bg-white pt-14 drop-shadow-2xl md:w-[790px]">
        <h1 className="text-2xl font-bold">{info.restName}</h1>
        <div>
          <div className="stars flex flex-row justify-center pb-2">
            {handleRatingStar()}
          </div>
        </div>
        <textarea
          id="textarea"
          className="h-[100px] w-[300px] resize-none border p-2 md:w-[400px]"
          placeholder="방문후기를 작성해주세요
다른 사용자들의 식당 선정시 도움이 됩니다"
        ></textarea>

        <label htmlFor="inputFile">
          <div className="h-[35px] w-[300px] content-center rounded-lg border p-1 px-4 md:w-[400px]">
            사진 첨부
          </div>
          <input
            id="inputFile"
            type="file"
            multiple
            accept="image/jpg,image/jpeg,image/png,image/raw,image/heic,image/heif"
            className="hidden"
            onChange={handleAddImages}
          />
        </label>
        <div className="img-container relative flex w-[300px] flex-row gap-3 md:w-[400px]">
          <div className="flex max-w-[300px] flex-row gap-3 overflow-x-scroll scrollbar-hide md:max-w-[400px]">
            {imageList.length === 0 && (
              <>
                <label htmlFor="inputFile">
                  <div className="h-[100px] w-[100px] content-center rounded-lg border border-slate-200 text-3xl text-slate-200">
                    +
                  </div>
                  <input
                    id="inputFile"
                    type="file"
                    multiple
                    accept="image/jpg,image/jpeg,image/png,image/raw,image/heic,image/heif"
                    className="hidden"
                    onChange={handleAddImages}
                  />
                </label>
              </>
            )}
            {imageList.map((image, idx) => (
              <div
                className="relative min-h-[100px] min-w-[100px]"
                key={"image_" + idx}
              >
                <button
                  onClick={() => handleDeleteImage(idx)}
                  className="absolute right-[5px] top-[2px] text-[15px] font-thin text-white drop-shadow-lg"
                >
                  ×
                </button>
                <img
                  src={image}
                  alt={`미리보기${idx}`}
                  className="h-[100px] w-[100px] rounded-lg border border-slate-200 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleWriteComplete}
          className="w-[300px] rounded-lg bg-[#FF6445] p-2 text-white md:w-[400px]"
        >
          작성완료
        </button>
        <button
          onClick={handleWriteNext}
          className="absolute bottom-2 w-[300px] p-2 text-sm text-[#555555] md:w-[400px]"
        >
          다음에 작성할게요.
        </button>
      </div>
    </>
  );
}
