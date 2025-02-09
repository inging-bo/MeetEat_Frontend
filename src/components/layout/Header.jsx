import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import { useState, useEffect } from "react";

export default function Header() {
  // ✅ 회원가입 버튼 클릭 시 동작

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 처음 렌더링될 때 localStorage에서 accessToken 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // 초기 실행

    window.addEventListener("storage", checkLoginStatus); // storage 변경 감지

    return () => {
      window.removeEventListener("storage", checkLoginStatus); // 클린업
    };
  }, []);
  return (
    <header className="fixed top-0 shadow-lg w-full z-50 flex justify-center h-[77px]">
      <div className="flex w-full justify-between max-w-screen-xl">
        <div>
          <Link to="/" className="h-full px-4 flex items-center">
            <HeaderLogo />
          </Link>
        </div>

        {/* 로그인 or 마이 페이지 */}
        <div>
          {isLoggedIn ? (
            <Link
              to="/mypage"
              className="h-full px-4 flex items-center cursor-pointer"
            >
              마이페이지
            </Link>
          ) : (
            <Link to="/account" className="h-full px-4 flex items-center">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
