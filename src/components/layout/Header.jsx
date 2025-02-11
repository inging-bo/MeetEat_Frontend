import {Link, useLocation} from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import {useState, useEffect} from "react";
import modalStore from "../../store/modalStore.js";

export default function Header() {
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
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <header className="fixed top-0 shadow-lg w-full flex justify-center min-h-[77px] bg-white">
      <div className="flex w-full justify-between max-w-screen-xl">
        <div>
          <Link to="/" className="h-full px-4 flex items-center">
            <HeaderLogo/>
          </Link>
        </div>

        {/* 로그인 or 마이 페이지 */}
        <div>
          {isLoggedIn ? (
            location.pathname.includes("/mypage") ? (
              // 현재 경로가 "/mypage"를 포함하면 로그아웃 버튼 표시
              <>
                <button
                  onClick={() => modalStore.openModal("twoBtn", "logOut")}
                  className="h-full px-4 flex items-center"
                >
                  로그아웃
                </button>
              </>

            ) : (
              // 그렇지 않으면 마이페이지 링크 표시
              <Link to="/mypage" className="h-full px-4 flex items-center cursor-pointer">
                마이페이지
              </Link>
            )
          ) : (
            // 로그인하지 않은 경우 로그인 링크 표시
            <Link to="/account" className="h-full px-4 flex items-center">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
