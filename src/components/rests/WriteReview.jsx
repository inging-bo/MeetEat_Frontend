import { useState } from "react";

export default function WriteReview() {
  const [detailImgs, setDetailImgs] = useState([]);
  const [isContain, setIsContain] = useState(false);
  const handleImageUpload = (e) => {
    setDetailImgs([]);
    const fileArr = e.target.files;
    let newArr = [];

    for (let i = 0; i < fileArr.length; i++) {
      let file = fileArr[i];
      let reader = new FileReader();

      reader.onload = () => {
        newArr.push(reader.result);
        setDetailImgs(newArr);
      };
      reader.readAsDataURL(file);
    }
    setIsContain(true);
  };

  return (
    <>
      <div>
        <h1>식당이름</h1>
        <div>
          <h1>식당평점</h1>
          <div className="stars flex flex-row justify-center">
            <p>별</p>
            <p>별</p>
            <p>별</p>
            <p>별</p>
            <p>별</p>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <h1>방문후기</h1>
          <input
            type="file"
            multiple
            accept="image/jpg,image/png,image/jpeg,image/gif"
            onChange={handleImageUpload}
          />
        </div>
        {isContain &&
          detailImgs.map((url) => {
            <img className="preview" src={url} width="150px" />;
          })}
        <div className="flex flex-row justify-center">
          <button>다음에 작성하기</button>
          <button>작성완료</button>
        </div>
        <div>매칭 히스토리에서 리뷰 작성 및 확인이 가능합니다</div>
      </div>
    </>
  );
}
