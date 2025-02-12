import { Link, useLocation } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import modalStore from "../../store/modalStore.js";
import authStore from "../../store/authStore.js";

export default function Header() {
  const loggedIn = authStore.loggedIn; //로그인 상태값
  console.log(loggedIn);
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <header className="fixed top-0 shadow-lg w-full flex justify-center min-h-[77px] bg-white">
      <div className="flex w-full justify-between max-w-screen-xl">
        <div>
          <Link to="/" className="h-full px-4 flex items-center">
            <HeaderLogo />
          </Link>
        </div>

        {/* 로그인 or 마이 페이지 */}
        <div>
          {loggedIn ? (
            location.pathname.includes("/mypage") ? (
              // 현재 경로가 "/mypage"를 포함하면 로그아웃 버튼 표시
              <>
                <button
                  onClick={() =>
                    modalStore.openModal("twoBtn", { type: "logOut" })
                  }
                  className="h-full px-4 flex items-center"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // 그렇지 않으면 마이페이지 링크 표시
              <Link
                to="/mypage"
                className="h-full px-4 flex items-center cursor-pointer"
              >
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
