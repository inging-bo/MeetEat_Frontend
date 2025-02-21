import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import Header from "../layout/Header.jsx";
import axios from "axios";
import authStore from "../../store/authStore.js";
import modalStore from "../../store/modalStore.js";
import { AnimatePresence, motion } from "framer-motion";
import ErrorMessage from "../common/ErrorMessage.jsx";

export default function ChangePW() {
  const navigate = useNavigate();
  // 로그인 확인
  useEffect(() => {
    !authStore.loggedIn && alert("로그인 후 이용해주세요!");
    !authStore.loggedIn && window.location.replace("/");
  }, []);

  // 값 유무 확인
  const [currentPwInput, setCurrentPwInput] = useState("");
  const [newPwInput, setNewPwInput] = useState("");
  const [subNewPwInput, setSubNewPwInput] = useState("");
  const [hasValue, setHasValue] = useState(false);

  // input필드 관찰
  const currentPwChange = (e) => setCurrentPwInput(e.target.value);
  const NewPwChange = (e) => setNewPwInput(e.target.value);
  const subNewPwChange = (e) => setSubNewPwInput(e.target.value);

  // 현재 비밀번호 input 내용 삭제 용
  const [currentPwIsFocused, setCurrentPwIsFocused] = useState(false);
  const clearCurrentPwInput = () => {
    setCurrentPwInput('');
    setCurrentPwIsFocused(false); // 포커스 해제
  };
  // 새 비밀번호 input 내용 삭제 용
  const [newPwIsFocused, setNewPwIsFocused] = useState(false);
  const clearNewPwInput = () => {
    setNewPwInput('');
    setNewPwIsFocused(false); // 포커스 해제
  };
  // 새 비밀번호 확인 input 내용 삭제 용
  const [subNewPwIsFocused, setNewSubPwIsFocused] = useState(false);
  const clearNewSubPwInput = () => {
    setSubNewPwInput('');
    setNewSubPwIsFocused(false); // 포커스 해제
  };

  // 입력값 변경 시 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(
      currentPwInput.length > 0 &&
      newPwInput.length > 0 &&
      subNewPwInput.length > 0
    );
  }, [currentPwInput, newPwInput, subNewPwInput]);

  // 비밀번호 보이기/숨기기
  const [showCurrentPW, setShowCurrentPW] = useState(false);
  const [showNewPW, setShowNewPW] = useState(false);
  const [showNewPWSub, setShowNewPWSub] = useState(false);
  // 비밀번호 토글 함수
  const toggleCurrentPW = () => setShowCurrentPW(!showCurrentPW);
  const toggleNewPW = () => setShowNewPW(!showNewPW);
  const toggleNewPWSub = () => setShowNewPWSub(!showNewPWSub);

  // 변경하기 버튼 클릭 시 메시지
  const [message, setMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0);

  const handleChangePW = async (e) => {
    e.preventDefault();

    try {
      const accessToken = window.localStorage.getItem("token"); // 저장된 토큰 가져오기

      if (!accessToken) {
        setMessageKey((prevKey) => prevKey + 1);
        setMessage("로그인 정보가 없습니다.");
        return;
      }
      if (currentPwInput === "") {
        setMessageKey((prevKey) => prevKey + 1);
        setMessage("현재 비밀번호를 입력하세요");
        return;
      }
      if (newPwInput === "") {
        setMessageKey((prevKey) => prevKey + 1);
        setMessage("새 비밀번호를 입력하세요");
        return;
      }
      if (subNewPwInput === "") {
        setMessageKey((prevKey) => prevKey + 1);
        setMessage("새 비밀번호를 확인 값을 입력하세요");
        return;
      }
      if (newPwInput !== subNewPwInput) {
        setMessageKey((prevKey) => prevKey + 1);
        setMessage("새 비밀번호가 일치하지 않습니다.")
        return;
      }
      setMessage("정보를 확인 중입니다.");
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_URL}/users/change-password`,
        {
          currentPassword: currentPwInput,
          newPassword: newPwInput,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 요청이 성공하면 페이지 이동
      if (response.status === 200) {
        modalStore.openModal("oneBtn", {
          message: "변경이 완료되었습니다.",
          onConfirm: () => {
            navigate("/");
            modalStore.closeModal();
          }
        })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      setMessage(errorMessage)
      console.log(error)
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
          <h1 className="text-2xl text-center">비밀번호 변경</h1>
          {/* 에러 메시지 표시 */}
          <ErrorMessage key={messageKey} message={message} duration={5000}/>
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
              현재 비밀번호
            </span>
            <label className="relative w-full">
              <input
                type={showCurrentPW ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={currentPwInput}
                onChange={currentPwChange}
                onFocus={() => setCurrentPwIsFocused(true)}
                onBlur={() => setCurrentPwIsFocused(false)}
                placeholder="현재 비밀번호를 입력해주세요."
                required
              />
              {currentPwInput && (
                <div
                  className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer "
                  onClick={clearCurrentPwInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
              <div
                className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                onClick={toggleCurrentPW}
              >
                {showCurrentPW ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
          </div>
          <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            새 비밀번호 <span className="text-secondary text-[10px] sm:text-xs">- 8자 이상, 영문, 숫자, 특수문자 하나 이상 포함</span>
          </span>
            <label className="relative w-full">
              <input
                type={showNewPW ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={newPwInput}
                onChange={NewPwChange}
                onFocus={() => setNewPwIsFocused(true)}
                onBlur={() => setNewPwIsFocused(false)}
                placeholder="새 비밀번호를 입력해주세요"
                required
              />
              {newPwInput && (
                <div
                  className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer "
                  onClick={clearNewPwInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
              <div
                className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                onClick={toggleNewPW}
              >
                {showNewPW ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
          </div>
          <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            새 비밀번호 확인 <span className="text-secondary text-[10px] sm:text-xs">- 8자 이상, 영문, 숫자, 특수문자 하나 이상 포함</span>
          </span>
            <label className="relative w-full">
              <input
                type={showNewPWSub ? "text" : "password"}
                name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={subNewPwInput}
                onChange={subNewPwChange}
                onFocus={() => setNewSubPwIsFocused(true)}
                onBlur={() => setNewSubPwIsFocused(false)}
                placeholder="새 비밀번호를 입력해주세요"
                required
              />
              {subNewPwInput && (
                <div
                  className="flex w-11 h-10 absolute top-1/2 -translate-y-1/2 right-10 text-gray-500 cursor-pointer "
                  onClick={clearNewSubPwInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 p-0.5 bg-secondary/20 rounded-full">
                    <path
                      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </div>
              )}
              <div
                className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                onClick={toggleNewPWSub}
              >
                {showNewPWSub ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "rgb(90,90,90)" }}
              className={`w-full h-11 rounded-md text-white bg-secondary `}
              onClick={(e) => {
                e.preventDefault();
                navigate("/mypage")
              }}
            >
              뒤로가기
            </motion.button>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95, backgroundColor: "rgb(230,80,50)" }}
              className={`w-full h-11 rounded-md bg-primary text-white`}
              onClick={(e) => handleChangePW(e)}
            >
              변경하기
            </motion.button>
          </div>
        </div>
      </form>
    </>
  );
}
