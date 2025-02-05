import { useState } from "react";
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

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
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
            className="w-full h-[150px]"
            placeholder="방문후기를 작성해주세요
다른 사용자들의 식당 선정시 도움이 됩니다"
          ></textarea>
        </div>
        <hr className="pb-2" />

        <div className="img-container flex flex-row gap-3 w-[500px] relative">
          <label htmlFor="inputFile" onChange={handleAddImages}>
            <div className="w-[100px] h-[100px] content-center bg-[#81be67] text-white p-2 px-4 rounded-lg">
              사진 선택
            </div>
            <input
              id="inputFile"
              type="file"
              multiple
              accept="image/*"
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
          <button className="w-[47%] p-2 bg-[#81be67] text-white rounded-lg">
            다음에 작성하기
          </button>
          <button className="w-[47%] p-2 bg-[#81be67] text-white rounded-lg">
            작성완료
          </button>
        </div>
      </div>
    </>
  );
}
