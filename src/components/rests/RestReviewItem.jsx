import { useEffect, useState } from "react";
import FullStar from "../../assets/full-star.svg?react";

export default function RestReviewItem({ review }) {
  const [star, setStar] = useState(new Array(5).fill(false));
  console.log(review);
  let imgs = "";
  if (review.imgUrl === null) {
    imgs = "";
  } else if (review.imgUrl.indexOf(",") !== -1) {
    imgs = review.imgUrl.split(",");
  } else if (review.imgUrl === "") {
    imgs = "";
  } else {
    imgs = [review.imgUrl];
  }

  useEffect(() => {
    let temp = [...star];
    for (let i = 0; i < 5; i++) {
      if (review.rating >= i + 1) {
        temp[i] = true;
      }
      setStar(temp);
    }
  }, []);

  return (
    <>
      <li className="flex flex-col items-start pb-4">
        <p className="font-bold">{review.nickname}</p>
        <div className="flex gap-1 pb-1">
          <div className="flex">
            {star.map((item) =>
              item ? (
                <>
                  <FullStar width="24px" className="text-[#FF6445]" />
                </>
              ) : (
                <>
                  <FullStar width="24px" className="text-[#9ca3af]" />
                </>
              )
            )}
          </div>
          <span className="text-gray-400 text-sm">{review.createdAt}</span>
        </div>
        <p className="text-sm text-gray-500 text-left pb-2">
          {review.description}
        </p>
        <ul className="flex gap-2 max-w-[554px] overflow-x-scroll scrollbar-hide">
          {imgs !== "" &&
            imgs.map((img) => (
              <>
                <li className="shrink-0">
                  <img
                    src={`https://meeteat.s3.ap-northeast-2.amazonaws.com/${img}`}
                    className=" w-[100px] h-[100px]  rounded-lg object-cover"
                  />
                </li>
              </>
            ))}
        </ul>
      </li>
    </>
  );
}
