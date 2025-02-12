
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import modalStore from "../../store/modalStore.js";
import authStore from "../../store/authStore.js";
import axios from "axios";

export default function Header() {
  const loggedIn = authStore.loggedIn; //로그인 상태값
  console.log(loggedIn);


  const location = useLocation(); // 현재 경로 가져오기

  return (
    <header className="fixed top-0 z-10 shadow-lg w-full flex justify-center min-h-[77px] bg-white">
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
                  onClick={() => modalStore.openModal("twoBtn",{
                    message : "정말 로그아웃 하시겠습니까?",
                    onConfirm : async () => {
                      try {
                        const accessToken = window.localStorage.getItem("accessToken"); // 저장된 토큰 가져오기

                        if (!accessToken) {
                          console.error("로그아웃 요청 실패: 토큰이 없습니다.");
                          return;
                        }

                        const response = await axios.post(
                          "/users/signout",
                          {}, // 본문 필요 없음
                          {
                            headers: {
                              Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        // 토큰값 제거
                        window.localStorage.removeItem("accessToken"); // accessToken 삭제
                        navigate("/");
                        modalStore.openModal("oneBtn", {message : "로그아웃 되었습니다." })
                      } catch (error) {
                        console.error("로그아웃 요청 실패!:", error);
                      }
                    }
                  })}
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
