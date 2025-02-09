import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmptyStar from "../../assets/empty-star.svg?react";
import FullStar from "../../assets/full-star.svg?react";
export default function WriteReview() {
  // 이미지 핸들러
  const [imageList, setImageList] = useState([]);
  const handleAddImages = (e) => {
    setImageList([]);
    const files = e.target.files;
    let imageUrlLists = [];

    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 7) {
      imageUrlLists = imageUrlLists.slice(0, 7);
      alert("사진은 최대 7장까지 첨부 가능합니다.");
    }
    setImageList(imageUrlLists);
  };

  // 초기 빈 별 그리기
  const [starScore, setStarScore] = useState(1);
  const handleRatingStar = () => {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(
        <span
          className="w-[50px]"
          key={i + 1}
          onClick={() => setStarScore(i + 1)}
        >
          {i + 1 <= starScore ? (
            <FullStar className="star" />
          ) : (
            <EmptyStar className="star" />
          )}
        </span>
      );
    }
    console.log(result);
    return result;
  };

  const navigate = useNavigate();
  const handleWriteNext = () => {
    alert("해당 리뷰는 마이페이지에서 다시 작성하실 수 있습니다.");
    window.sessionStorage.removeItem("isCompleted");
    window.sessionStorage.removeItem("isMatched");
    window.sessionStorage.removeItem("matchedData");
    navigate("/");
  };

  const handleWriteComplete = () => {
    const jsonCurData = JSON.parse(
      window.sessionStorage.getItem("matchedData")
    ).data;
    const matchedId = Object.entries(jsonCurData)[2][1];
    const restId = Object.entries(jsonCurData)[3][1].restaurant.id;
    const textareaValue = document.getElementById("textarea").value;
    apiRestReviewWrite(matchedId, restId, textareaValue);
  };

  async function apiRestReviewWrite(matchedId, restId, textareaValue) {
    await axios
      .post("/restaurants/review", {
        matchingHistoryId: matchedId,
        restaurantId: restId,
        starRate: starScore,
        description: textareaValue,
        imgs: imageList,
      })
      .then(() => {
        alert("작성 완료되었습니다.");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="h-fit">
        <h1 className="text-2xl">식당이름</h1>
        <div>
          <h1 className="text-2xl">식당평점</h1>
          <div className="stars flex flex-row justify-center">
            {handleRatingStar()}
          </div>
        </div>
        <div className="flex flex-col items-end gap-5 my-10">
          <textarea
            id="textarea"
            className="w-full h-[150px] resize-none border-none"
            placeholder="방문후기를 작성해주세요
다른 사용자들의 식당 선정시 도움이 됩니다"
          ></textarea>
        </div>
        <hr className="pb-2" />

        <div className="img-container flex flex-row gap-3 w-[500px] relative">
          <label htmlFor="inputFile">
            <div className="w-[100px] h-[100px] content-center bg-[#81be67] text-white p-2 px-4 rounded-lg">
              사진 선택
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
          <div className="flex flex-row max-w-[500px] gap-3 overflow-x-scroll scrollbar-hide">
            {imageList.length === 0 && (
              <div className="w-[100px] h-[100px] content-center rounded-lg border border-slate-200 text-slate-200 text-3xl ">
                +
              </div>
            )}
            {imageList.map((image, idx) => (
              <>
                <img
                  src={image}
                  alt={`미리보기${idx}`}
                  className="w-[100px] h-[100px] object-contain rounded-lg border border-slate-200"
                />
              </>
            ))}
          </div>
        </div>
        <div className="flex flex-row pt-2 justify-between w-full">
          <button
            onClick={handleWriteNext}
            className="w-[47%] p-2 bg-[#81be67] text-white rounded-lg"
          >
            다음에 작성하기
          </button>
          <button
            onClick={handleWriteComplete}
            className="w-[47%] p-2 bg-[#81be67] text-white rounded-lg"
          >
            작성완료
          </button>
        </div>
      </div>
    </>
  );
}
