import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import KakaoIcon from "../../assets/Login-icon-kakao.svg?react";
import NaverIcon from "../../assets/Login-icon-naver.svg?react";
import axios from "axios";
import OneBtnModal from "../common/OneBtnModal.jsx";

export default function Login() {

  // 이메일 패스워드 값 유무 확인 용
  const [emailInput, setEmailInput] = useState("")
  const [pwInput, setPwInput] = useState("")
  const [hasValue, setHasValue] = useState(false)

  // input필드 관찰
  const emailChange = (e) => setEmailInput(e.target.value);
  const pwChange = (e) => setPwInput(e.target.value);

  // 입력값 변경 시 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(emailInput.length > 0 && pwInput.length > 0);
  }, [emailInput, pwInput]);

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 보이기/숨기기
  const [showPW, setShowPW] = useState(false);
  const togglePW = () => setShowPW(!showPW);

  // ✅ 회원가입 버튼 클릭 시 동작

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // oneBtn 넘기는 타입용

  // ✅ 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };
  const login = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    try {
      const response = await axios.post("/users/signin", {
        email: emailInput,
        password: pwInput,
      });
      console.log("로그인 응답 데이터:", response.data);

      // // ✅ 토큰 저장
      window.localStorage.setItem("accessToken", response.data.accessToken);

      if (response.data.accessToken) {
        setMessage("로그인 성공!");
        setIsModalOpen(true);
        setModalType("signIn");

        // 입력 필드 초기화
        setEmailInput("");
        setPwInput("");
      } else {
        setMessage("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);

      setMessage(
        error.response?.data?.message ||
        "로그인 요청 중 오류가 발생했습니다."
      );
    }
  };

  // 로그인 버튼 클릭 시 메시지
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ 서비스별 로그인 URL 설정
  const OAUTH_PROVIDERS = {
    kakao: {
      clientId: import.meta.env.VITE_APP_RESTAPI_KEY,
      authUrl: "https://kauth.kakao.com/oauth/authorize",
      redirectUri: "http://localhost:5173/account",
      state: "", // 카카오는 state가 필요 없음
    },
    naver: {
      clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
      authUrl: "https://nid.naver.com/oauth2.0/authorize",
      redirectUri: "http://localhost:5173/account",
      state: "RANDOM_STATE", // CSRF 방지를 위한 랜덤 값 (임시)
    },
  };

  // ✅ OAuth 로그인 요청 (카카오 또는 네이버)
  const handleOAuthLogin = (provider, event) => {
    event.preventDefault(); // 기본 동작 방지
    const { clientId, authUrl, redirectUri, state } = OAUTH_PROVIDERS[provider];

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
  const getAuthorizationCode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  };

  // ✅ 로그인 후 토큰 발급 처리
  const handleOAuthCallback = async () => {
    const code = getAuthorizationCode();
    if (!code) {
      setMessage("인가 코드가 없습니다.");
      return;
    }

    // 어떤 제공자인지 확인
    const provider = window.location.search.includes("state") ? "naver" : "kakao";

    try {
      const response = await axios.post(`/users/signin/${provider}`, { code });

      if (response.data.accessToken) {
        window.localStorage.setItem("accessToken", response.data.accessToken);
        setMessage("로그인 성공!");
        navigate("/"); // 메인 페이지로 리디렉션
      } else {
        setMessage("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      setMessage("로그인 요청 중 오류가 발생했습니다.");
    }
  };
  // ✅ 인가 코드가 있으면 자동으로 처리
  useEffect(() => {
    if (window.location.search.includes("code")) {
      handleOAuthCallback();
    }
  }, []);

  return (
    <form className="flex w-96 justify-center items-center">
      {/* OneBtnModal 표시*/}
      {isModalOpen && <OneBtnModal type={modalType} onClose={closeModal}/>}
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <h1 className="flex justify-center h-8 mb-8">
          <Link to={"/"}><HeaderLogo className="h-full w-full"/></Link>
        </h1>
        {/* 이메일 형식일 때 통과 하도록 적기 */}
        <div className="flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">이메일</span>
          <input
            type="email"
            name="email"
            className="w-full h-11 outline-0 px-2 border-b border-gray-300"
            value={emailInput}
            onChange={emailChange}
            placeholder="email@example.com" required
          />
          <span className="text-sm text-[#FF0000] mt-2 h-5">{!emailRegex.test(emailInput) && "이메일 형식이 아닙니다."}</span>
        </div>
        <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">비밀번호</span>
          <label className="relative w-full">
            <input
              type={showPW ? "text" : "password"}
              name="password"
              className="w-full h-11 outline-0 border-b px-2 border-gray-300"
              value={pwInput}
              onChange={pwChange}
              placeholder="비밀번호를 입력해주세요" required
            />
            <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                 onClick={togglePW}>
              {showPW ? (
                <ShowPWIcon className="w-full h-full"/>
              ) : (
                <HidePWIcon className="w-full h-full"/>
              )}
            </div>
          </label>
        </div>
        <button
          type="submit"
          onClick={login}
          className={`w-full h-11 rounded-md ${
            hasValue ? "bg-[#FF6445] text-white" : "bg-gray-200"
          }`}
        >
          로그인
        </button>
        <div className="flex gap-3 justify-center text-xs">
          <Link to="/account/signup"
                className="border-b-2 text-base text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-400">
            회원이 아니신가요?
          </Link>
        </div>
        <p className="text-sm mt-5">SNS 간편 로그인</p>
        <div className="flex h-14 justify-center gap-4">
          <button onClick={(e) => handleOAuthLogin("naver", e)}><NaverIcon className="w-full h-full"/></button>
          <button onClick={(e) => handleOAuthLogin("kakao", e)}><KakaoIcon className="w-full h-full"/></button>
        </div>
        {/* 에러 메시지 표시 */}
        <p className="text-sm text-[#FF0000] mt-2 min-h-5">{message}</p>
      </div>
    </form>
  )
}
