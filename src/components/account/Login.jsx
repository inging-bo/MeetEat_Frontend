import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import KakaoIcon from "../../assets/Login-icon-kakao.svg?react";
import NaverIcon from "../../assets/Login-icon-naver.svg?react";
import axios from "axios";
import authStore from "../../store/authStore.js";
import ErrorMessage from "../common/ErrorMessage.jsx";
import modalStore from "../../store/modalStore.js";

export default function Login() {
  // 이메일 패스워드 값 유무 확인 용
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [hasValue, setHasValue] = useState(false);

  // input필드 관찰
  const emailChange = (e) => setEmailInput(e.target.value);
  const pwChange = (e) => setPwInput(e.target.value);

  // input 내용 삭제 용
  // 이메일 input 내용 삭제 용
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const clearEmailInput = () => {
    setEmailInput("");
    setIsEmailFocused(false); // 포커스 해제
  };
  // 비밀번호 input 내용 삭제 용
  const [isFocused, setIsPwFocused] = useState(false);
  const clearPwInput = () => {
    setPwInput("");
    setIsPwFocused(false); // 포커스 해제
  };
  // 입력값 변경 시 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(emailInput.length > 0 && pwInput.length > 0);
  }, [emailInput, pwInput]);

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 보이기/숨기기
  const [showPW, setShowPW] = useState(false);
  const togglePW = () => setShowPW(!showPW);

  // 로그인 버튼 클릭 시 메시지
  const [message, setMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0);

  const login = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지
    setMessageKey((prevKey) => prevKey + 1);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput === "") return setMessage("이메일을 입력하세요");
    if (!emailRegex.test(emailInput))
      return setMessage("이메일 형식으로 작성해주세요.");
    if (pwInput === "") return setMessage("비밀번호을 입력하세요");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_URL}/users/signin`,
        {
          email: emailInput,
          password: pwInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("로그인 응답 데이터:", response.data);
        authStore.setLoggedIn(true);
        // // ✅ 토큰 저장
        window.localStorage.setItem("token", response.data.accessToken);
        setMessage("로그인 성공!");
        // 입력 필드 초기화
        setEmailInput("");
        setPwInput("");
        if (response.data.needProfileUpdate) {
          modalStore.openModal("oneBtn", {
            message: (
              <>
                <p>첫 접속을 환영합니다</p>
                <p>마이페이지에서 한 줄 소개를 작성하세요!</p>
              </>
            ),
            onConfirm: async () => {
              await navigate("/mypage");
              modalStore.closeModal();
            },
          });
        } else {
          axios
            .get(`${import.meta.env.VITE_BE_API_URL}/matching`, {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log("로그인 응당 데이터 ", res.data.id);
              if (res.data.id !== undefined) {
                window.sessionStorage.setItem("isCompleted", "true");
                window.sessionStorage.setItem(
                  "matchedData",
                  JSON.stringify(res)
                );
              }
              navigate("/");
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message
      const errorCode = error.response?.data?.error
      const errorStatus = error.response?.data?.status
      setMessage(errorMessage)
    }
  };

  const navigate = useNavigate();

  // ✅ 서비스별 로그인 URL 설정
  const OAUTH_PROVIDERS = {
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
      authUrl: "https://kauth.kakao.com/oauth/authorize",
      redirectUri:
        window.location.hostname === "localhost"
          ? "http://localhost:5173/account"
          : "https://meet--eat.com/account",
      state: "", // 카카오는 state가 필요 없음
    },
    naver: {
      clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
      authUrl: "https://nid.naver.com/oauth2.0/authorize",
      redirectUri:
        window.location.hostname === "localhost"
          ? "http://localhost:5173/account"
          : "https://meet--eat.com/account",
      state: "RANDOM_STATE", // CSRF 방지를 위한 랜덤 값 (임시)
    },
  };
  const generateState = () => crypto.randomUUID();

  // ✅ OAuth 로그인 요청 (카카오 또는 네이버)
  const handleOAuthLogin = (provider, event) => {
    event.preventDefault(); // 기본 동작 방지
    const { clientId, authUrl, redirectUri } = OAUTH_PROVIDERS[provider];

    let state = "";
    if (provider === "naver") {
      state = generateState();
      sessionStorage.setItem("oauth_state", state); // 세션에 저장
    }

    const queryParams = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
    });

    if (state) queryParams.append("state", state); // 네이버의 경우 state 추가

    const OAUTH_URL = `${authUrl}?${queryParams.toString()}`;
    window.location.href = OAUTH_URL; // 로그인 페이지로 이동
  };

  // ✅ URL에서 인가 코드 가져오기
  const getAuthorizationCode = async () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  };

  // ✅ 로그인 후 토큰 발급 처리
  const handleOAuthCallback = async () => {
    const code = await getAuthorizationCode();
    console.log("인가 코드:", code); // ✅ 코드 값 확인
    if (!code) {
      setMessage("인가 코드가 없습니다.");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state");

    // 네이버 OAuth의 경우 state 검증
    if (state) {
      const storedState = sessionStorage.getItem("oauth_state");
      if (state !== storedState) {
        setMessage("CSRF 공격 감지: state 불일치");
        return;
      }
    }

    // 어떤 제공자인지 확인
    const provider = state ? "naver" : "kakao";

    try {
      console.log("서버 요청 보냄:", provider, code); // ✅ provider와 code 값 확인
      console.log(
        "서버로 요청할 URL:",
        `${import.meta.env.VITE_BE_API_URL}/users/signin/${provider}`
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_URL}/users/signin/${provider}`,
        { code: code },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        window.localStorage.setItem("token", response.data.accessToken);
        authStore.setLoggedIn(true);
        axios
          .get(`${import.meta.env.VITE_BE_API_URL}/matching`, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data.id !== undefined) {
              window.sessionStorage.setItem("isCompleted", "true");
              window.sessionStorage.setItem("matchedData", JSON.stringify(res));
            }
            navigate("/");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        throw new Error("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      setMessage(error.response?.data || "로그인 실패");
    }
  };

  // ✅ 인가 코드가 있으면 자동으로 처리
  useEffect(() => {
    if (
      window.location.pathname === "/account" &&
      window.location.search.includes("code")
    ) {
      handleOAuthCallback();
    }
  }, []);
  console.log(messageKey);
  return (
    <form
      className="p-6 flex w-full h-full text-black
        sm:w-96 sm:p-0"
    >
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <h1 className="hidden sm:flex justify-center h-8 mb-8">
          <Link to={"/"}>
            <HeaderLogo className="h-full w-full" />
          </Link>
        </h1>
        {/* 에러 메시지 표시 */}
        <ErrorMessage key={messageKey} message={message} duration={3000} />
        {/* 이메일 형식일 때 통과 하도록 적기 */}
        <div className="flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            이메일
          </span>
          <label className="relative w-full">
            <input
              type="email"
              name="email"
              className="w-full h-11 outline-0 px-2 border-b border-gray-300"
              value={emailInput}
              onChange={emailChange}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              placeholder="email@example.com"
              required
            />
            {emailInput && (
              <div
                className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer "
                onClick={clearEmailInput}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </div>
            )}
          </label>
          {/* 에러 메시지 표시 */}
          {!emailRegex.test(emailInput) && emailInput !== "" ? (
            <ErrorMessage message="이메일 형식이 아닙니다" persistent={true} />
          ) : (
            <span className="text-sm text-[#FF0000] mt-2 h-5"></span>
          )}
        </div>
        <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            비밀번호
          </span>
          <label className="relative w-full">
            <input
              type={showPW ? "text" : "password"}
              name="password"
              className="w-full h-11 outline-0 border-b px-2 border-gray-300"
              value={pwInput}
              onChange={pwChange}
              onFocus={() => setIsPwFocused(true)}
              onBlur={() => setIsPwFocused(false)}
              placeholder="비밀번호를 입력해주세요"
              required
            />
            {pwInput && (
              <div
                className="flex w-10 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer"
                onClick={clearPwInput}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </div>
            )}
            <div
              className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer"
              onClick={togglePW}
            >
              {showPW ? (
                <ShowPWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5" />
              ) : (
                <HidePWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5" />
              )}
            </div>
          </label>
        </div>
        <button
          type="submit"
          onClick={login}
          className={`w-full h-11 rounded-md hover:bg-primary hover:text-white ${
            hasValue ? "bg-[#FF6445] text-white" : "bg-gray-200"
          }`}
        >
          로그인
        </button>
        <div className="flex gap-3 justify-center text-xs">
          <Link
            to="/account/signup"
            className="border-b-2 text-base text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-400"
          >
            회원이 아니신가요?
          </Link>
        </div>
        <p className="text-sm mt-5">SNS 간편 로그인</p>
        <div className="flex h-14 justify-center gap-4">
          <button onClick={(e) => handleOAuthLogin("naver", e)}>
            <NaverIcon className="w-full h-full" />
          </button>
          <button onClick={(e) => handleOAuthLogin("kakao", e)}>
            <KakaoIcon className="w-full h-full" />
          </button>
        </div>
      </div>
    </form>
  );
}
