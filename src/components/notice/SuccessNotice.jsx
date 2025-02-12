import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import authStore from "../../store/authStore";

export default function SuccessNotice() {
  // 로그인 확인
  useEffect(() => {
    authStore.checkLoggedIn();
    !authStore.loggedIn && alert(location.state?.message);
    !authStore.loggedIn && window.location.replace("/");
  }, []);
  const location = useLocation();

  console.log(location);
  return (
    <div>
      <p>✓</p>
      <p>{location.state?.message || "기본 메시지"}</p>
      <Link to="/">홈페이지로 돌아가기</Link>
    </div>
  );
}
