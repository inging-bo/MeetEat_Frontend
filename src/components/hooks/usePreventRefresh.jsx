import { useEffect } from "react";

const usePreventRefresh = () => {
  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
    alert("종료하기를 눌러주세요 :D");
  };

  // 브라우저에 렌더링 시 한 번만 실행하는 코드
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  });
};

export default usePreventRefresh;
