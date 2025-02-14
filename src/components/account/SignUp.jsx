import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../layout/Header.jsx";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import HeaderLogo from "../../assets/header-logo.svg?react";
import axios from "axios";
import authStore from "../../store/authStore.js";
import modalStore from "../../store/modalStore.js";

export default function SignUp() {
  // 로그인 확인
  useEffect(() => {
    authStore.checkLoggedIn();
    authStore.loggedIn && alert("로그인 되어있는 상태입니다.");
    authStore.loggedIn && window.location.replace("/");
  }, []);

  // 값 유무 확인
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [subPwInput, setSubPwInput] = useState("");
  const [nickNameInput, setNickNameInput] = useState("");

  // input필드 관찰
  const emailChange = (e) => setEmailInput(e.target.value);
  const pwChange = (e) => setPwInput(e.target.value);
  const subPwChange = (e) => setSubPwInput(e.target.value);
  const nickNameChange = (e) => setNickNameInput(e.target.value);

  // 모든 input 입력시 회원가입 버튼 색 변경 코드
  const hasValue = emailInput && pwInput && subPwInput && nickNameInput;

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 보이기/숨기기
  const [showPW, setShowPW] = useState(false);
  const [showPWSub, setShowPWSub] = useState(false);
  // 비밀번호 토글 함수
  const togglePW = () => setShowPW(!showPW);
  const togglePWSub = () => setShowPWSub(!showPWSub);

  // 회원가입 버튼 클릭 시 메시지
  const navigate = useNavigate()
  const [message, setMessage] = useState("");

  const signUp = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput === "") return setMessage("이메일을 입력하세요")
    if (!emailRegex.test(emailInput)) return setMessage("이메일 형식으로 작성해주세요.")
    if (pwInput === "") return setMessage("비밀번호을 입력하세요")
    if (subPwInput !== pwInput) return setMessage("새 비밀번호가 일치하지 않습니다.")
    if (nickNameInput === "") return setMessage("닉네임을 입력하세요")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_URL}/users/signup`,
        {
          email: emailInput,
          password: pwInput,
          nickname: nickNameInput,
        }, // 👉 데이터 객체는 두 번째 인자로 전달
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/account")
        modalStore.openModal("oneBtn", {
          message: "회원가입이 완료되었습니다!.",
          onConfirm: async () => {
            setMessage("회원가입 성공!");
            // 입력 필드 초기화
            setEmailInput("");
            setPwInput("");
            setSubPwInput("");
            setNickNameInput("");
            await modalStore.closeModal()
          }
        })
      } else {
        setMessage("회원가입 실패");
      }
    } catch (error) {
      if (error.response?.status === 404) return setMessage("요청 주소가 없습니다.");
      if (error.response?.status === 500) {
        setMessage("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else if (error.response?.status === 400) {
        setMessage(error.response?.data);
      } else {
        setMessage("회원가입 요청 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <Header/>
      <form className="flex w-96 justify-center items-center">
        <div className="flex flex-1 flex-col gap-3 justify-center">
          <h1 className="flex justify-center h-8 mb-8">
            <Link to={"/"}>
              <HeaderLogo className="h-full w-full"/>
            </Link>
          </h1>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              이메일
            </span>
            <input
              type="email"
              name="email"
              className="w-full h-11 outline-0 px-2 border-b border-gray-300"
              value={emailInput}
              onChange={emailChange}
              placeholder="email@example.com"
              required
            />
            <span className="text-sm text-[#FF0000] mt-2 h-5">
              {!emailRegex.test(emailInput) && "이메일 형식이 아닙니다"}
            </span>
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
                placeholder="비밀번호를 입력해주세요"
                required
              />
              <div
                className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                onClick={togglePW}
              >
                {showPW ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
          </div>
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              비밀번호 확인
            </span>
            <label className="relative w-full">
              <input
                type={showPWSub ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={subPwInput}
                onChange={subPwChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              <div
                className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                onClick={togglePWSub}
              >
                {showPWSub ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
            <span className="text-sm text-[#FF0000] mt-2 h-5">
              {pwInput !== subPwInput && "비밀번호가 일치하지 않습니다."}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              닉네임
            </span>
            <input
              type="text"
              name="nickName"
              className=" w-full h-11 px-2 outline-0 border-b border-gray-300  after:left-0 after:text-sm after:text-gray-500 after:block after:content-['한글_6자,_영문_12자까지_입력_가능']"
              value={nickNameInput}
              onChange={nickNameChange}
              placeholder="닉네임을 입력해주세요"
              required
            />
          </div>
          <button
            type="submit"
            onClick={(e) => signUp(e)}
            className={`w-full h-11 rounded-md hover:bg-[#FF6445] hover:text-white ${
              hasValue ? "bg-[#FF6445] text-white" : "bg-gray-200"
            }`}
          >
            회원가입
          </button>
          {/* 에러 메시지 표시 */}
          <p className="text-sm text-[#FF0000] mt-2 min-h-5">{message}</p>
        </div>
      </form>
    </>
  );
}
