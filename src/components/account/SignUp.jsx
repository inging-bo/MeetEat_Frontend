import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../layout/Header.jsx";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import HeaderLogo from "../../assets/header-logo.svg?react";
import axios from "axios";
import authStore from "../../store/authStore.js";
import modalStore from "../../store/modalStore.js";
import ErrorMessage from "../common/ErrorMessage.jsx";
import ReactLoading from "react-loading";

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

  // input 내용 삭제 용
  // 이메일 input 내용 삭제 용
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const clearEmailInput = () => {
    setEmailInput('');
    setEmailIsFocused(false); // 포커스 해제
  };
  // 비밀번호 input 내용 삭제 용
  const [pwIsFocused, setPwIsFocused] = useState(false);
  const clearPwInput = () => {
    setPwInput('');
    setPwIsFocused(false); // 포커스 해제
  };
  // 새 비밀번호 input 내용 삭제 용
  const [subPwIsFocused, setSubPwIsFocused] = useState(false);
  const clearSubPwInput = () => {
    setSubPwInput('');
    setSubPwIsFocused(false); // 포커스 해제
  };
  // 닉네임 input 내용 삭제 용
  const [nickNameisFocused, setNickNameIsFocused] = useState(false);
  const clearNickNameInput = () => {
    setNickNameInput('');
    setNickNameIsFocused(false); // 포커스 해제
  };

  // 모든 input 입력시 회원가입 버튼 색 변경 코드
  const hasValue = emailInput && pwInput && subPwInput && nickNameInput;

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 보이기/숨기기
  const [showPW, setShowPW] = useState(false);
  const [showSubPW, setShowPWSub] = useState(false);
  // 비밀번호 토글 함수
  const togglePW = () => setShowPW(!showPW);
  const toggleSubPW = () => setShowPWSub(!showSubPW);

  // 회원가입 버튼 클릭 시 메시지
  const navigate = useNavigate()
  const [message, setMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const signUp = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    if (emailInput === "") {
      setMessageKey((prevKey) => prevKey + 1);
      setMessage("이메일을 입력하세요");
      return;
    }
    if (pwInput === "") {
      setMessageKey((prevKey) => prevKey + 1);
      setMessage("비밀번호을 입력하세요");
      return;
    }
    if (subPwInput !== pwInput) {
      setMessageKey((prevKey) => prevKey + 1);
      setMessage("새 비밀번호가 일치하지 않습니다.")
      return;
    }
    if (nickNameInput === "") {
      setMessageKey((prevKey) => prevKey + 1);
      setMessage("닉네임을 입력하세요")
      return;
    }

    const specialCharRegex = /[^a-zA-Z0-9가-힣\s]/;

    if (specialCharRegex.test(nickNameInput)) {
      setMessageKey((prevKey) => prevKey + 1);
      setMessage("특수문자는 포함할 수 없습니다.");
      return;
    }
    setIsLoading(true);
    setMessage("정보를 확인 중입니다.");
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
        modalStore.openModal("oneBtn", {
          message: "회원가입이 완료되었습니다!.",
          onConfirm: async () => {
            // 입력 필드 초기화

            setEmailInput("");
            setPwInput("");
            setSubPwInput("");
            setNickNameInput("");
            await modalStore.closeModal()
            navigate("/account")
          }
        })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      setMessage(errorMessage || "서버에서 오류가 발생.")
      console.log(errorMessage)
      const errorCode = error.response?.data?.error
      const errorStatus = error.response?.data?.status
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <form
        className="p-6 flex w-full h-full text-black
        sm:w-96 sm:p-0"
      >
        <div className="flex flex-1 flex-col gap-3 mt-[77px] sm:m-0 sm:justify-center">
          <h1 className="hidden sm:flex justify-center h-8 mb-8">
            <Link to={"/"}>
              <HeaderLogo className="h-full w-full"/>
            </Link>
          </h1>
          {/* 에러 메시지 표시 */}
          <ErrorMessage key={messageKey} message={message} duration={5000}/>
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
                onFocus={() => setEmailIsFocused(true)}
                onBlur={() => setEmailIsFocused(false)}
                placeholder="email@example.com"
                required
              />
              {emailInput && (
                <div
                  className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer "
                  onClick={clearEmailInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
            </label>
            {/* 에러 메시지 표시 */}
            {!emailRegex.test(emailInput) && emailInput !== "" ? (
              <span className="mt-1">
                <ErrorMessage message="이메일 형식이 아닙니다" persistent={true}/>
              </span>
            ) : (
              <span className="text-sm text-[#FF0000] mt-2 h-5"></span>
            )}
          </div>
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              비밀번호 <span className="text-secondary text-[10px] sm:text-xs">- 8자 이상, 영문, 숫자, 특수문자 하나 이상 포함</span>
            </span>
            <label className="relative w-full">
              <input
                type={showPW ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={pwInput}
                onChange={pwChange}
                onFocus={() => setPwIsFocused(true)}
                onBlur={() => setPwIsFocused(false)}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              {pwInput && (
                <div
                  className="flex w-10 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer"
                  onClick={clearPwInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
              <div
                className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer"
                onClick={togglePW}
              >
                {showPW ? (
                  <ShowPWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5"/>
                ) : (
                  <HidePWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5"/>
                )}
              </div>
            </label>
          </div>
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              비밀번호 확인 <span className="text-secondary text-[10px] sm:text-xs">- 8자 이상, 영문, 숫자, 특수문자 하나 이상 포함</span>
            </span>
            <label className="relative w-full">
              <input
                type={showSubPW ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={subPwInput}
                onChange={subPwChange}
                onFocus={() => setSubPwIsFocused(true)}
                onBlur={() => setSubPwIsFocused(false)}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              {subPwInput && (
                <div
                  className="flex w-10 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer"
                  onClick={clearSubPwInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
              <div
                className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer"
                onClick={toggleSubPW}
              >
                {showSubPW ? (
                  <ShowPWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5"/>
                ) : (
                  <HidePWIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 p-0.5"/>
                )}
              </div>
            </label>
            {/* 에러 메시지 표시 */}
            {pwInput !== subPwInput ? (
              <span className="mt-1">
                <ErrorMessage message={"비밀번호가 일치하지 않습니다"} persistent={true}/>
              </span>
            ) : (
              <span className="text-sm text-[#FF0000] mt-2 h-5"></span>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              닉네임
            </span>
            <label className="relative w-full">
              <input
                type="text"
                name="nickName"
                className=" w-full h-11 px-2 outline-0 border-b border-gray-300  after:left-0 after:text-sm after:text-gray-500 after:block after:content-['한글_6자,_영문_12자까지_입력_가능']"
                value={nickNameInput}
                onChange={nickNameChange}
                onFocus={() => setNickNameIsFocused(true)}
                onBlur={() => setSubPwIsFocused(false)}
                placeholder="닉네임을 입력해주세요"
                required
              />
              {nickNameInput && (
                <div
                  className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 cursor-pointer"
                  onClick={clearNickNameInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
            </label>
          </div>
          <button
            type="submit"
            onClick={(e) => signUp(e)}
            className={`relative w-full h-11 rounded-md transition duration-100
            ${hasValue ? "bg-primary text-white" : "bg-gray-200"}
            ${isLoading ? "bg-primary" : ""}
            hover:bg-primary hover:text-white
            active:scale-95 active:bg-[rgb(230,80,50)]`}
          >
            {isLoading ? (
              <ReactLoading
                type={"spokes"}
                color={"#ffffff"}
                height={25}
                width={25}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ) : (
              "회원가입"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
