import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Header from "../layout/Header.jsx";
import OneBtnModal from "../common/OneBtnModal.jsx";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import HeaderLogo from "../../assets/header-logo.svg?react";
import axios from "axios";

export default function SignUp() {

  // 값 유무 확인
  const [emailInput, setEmailInput] = useState("")
  const [pwInput, setPwInput] = useState("")
  const [subPwInput, setSubPwInput] = useState("")
  const [nickNameInput, setNickNameInput] = useState("")
  const [hasValue, setHasValue] = useState(false)

  // input필드 관찰
  const emailChange = (e) => setEmailInput(e.target.value);
  const pwChange = (e) => setPwInput(e.target.value);
  const subPwChange = (e) => setSubPwInput(e.target.value);
  const nickNameChange = (e) => setNickNameInput(e.target.value);

  // 입력값 변경 시 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(emailInput.length > 0 && pwInput.length > 0 && subPwInput.length > 0 && nickNameInput.length > 0);
  }, [emailInput, pwInput, subPwInput, nickNameInput]);

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 보이기/숨기기
  const [showPW, setShowPW] = useState(false);
  const [showPWSub, setShowPWSub] = useState(false);
  // 비밀번호 토글 함수
  const togglePW = () => setShowPW(!showPW);
  const togglePWSub = () => setShowPWSub(!showPWSub);

  // ✅ 회원가입 버튼 클릭 시 동작

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // oneBtn 넘기는 타입용
  // ✅ 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };
  // 회원가입 버튼 클릭 시 메시지
  const [message, setMessage] = useState("");

  const signUp = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    try {
      const response = await axios.post("/users/signup", {
        email: emailInput,
        password: pwInput,
        subPassword: subPwInput,
        nickname: nickNameInput,
      });

      console.log("회원가입 응답 데이터:", response.data);

      if (response.data.success) {
        setMessage("회원가입 성공!");
        setIsModalOpen(true);
        setModalType("signUp");

        // 입력 필드 초기화
        setEmailInput("");
        setPwInput("");
        setSubPwInput("");
        setNickNameInput("");
      } else {
        setMessage("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);

      setMessage(
        error.response?.data?.message ||
        "회원가입 요청 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <Header/>
      <form
        className="flex w-96 justify-center items-center">
        <div className="flex flex-1 flex-col gap-3 justify-center">
          <h1 className="flex justify-center h-8 mb-8">
            <Link to={"/"}><HeaderLogo className="h-full w-full"/></Link>
          </h1>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">이메일</span>
            <input
              type="email"
              name="email"
              className="w-full h-11 outline-0 px-2 border-b border-gray-300"
              value={emailInput}
              onChange={emailChange}
              placeholder="email@example.com" required/>
            <span className="text-sm text-[#FF0000] mt-2 h-5">{!emailRegex.test(emailInput) && "이메일 형식이 아닙니다"}</span>
          </div>
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">비밀번호</span>
            <label className="relative w-full">
              <input
                type={showPW ? "text" : "password"} name="password"
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
          <div className="relative flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">비밀번호 확인</span>
            <label className="relative w-full">
              <input
                type={showPWSub ? "text" : "password"} name="password"
                className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                value={subPwInput}
                onChange={subPwChange}
                placeholder="비밀번호를 입력해주세요" required
              />
              <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500" onClick={togglePWSub}>
                {showPWSub ? (
                  <ShowPWIcon className="w-full h-full"/>
                ) : (
                  <HidePWIcon className="w-full h-full"/>
                )}
              </div>
            </label>
            <span className="text-sm text-[#FF0000] mt-2 h-5">{pwInput !== subPwInput && "비밀번호가 일치하지 않습니다."}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">닉네임</span>
            <input type="text" name="nickName"
                   className=" w-full h-11 px-2 outline-0 border-b border-gray-300  after:left-0 after:text-sm after:text-gray-500 after:block after:content-['한글_6자,_영문_12자까지_입력_가능']"
                   value={nickNameInput}
                   onChange={nickNameChange}
                   placeholder="닉네임을 입력해주세요" required
            />
          </div>
          <button
            type="submit"
            onClick={(e) => signUp(e, "signUp")}
            className={`w-full h-11 rounded-md hover:bg-[#FF6445] hover:text-white ${
              hasValue ? "bg-[#FF6445] text-white" : "bg-gray-200"
            }`}
          >
            회원가입
          </button>
          {/* 에러 메시지 표시 */}
          <p className="text-sm text-[#FF0000] mt-2 min-h-5">{message}</p>
        </div>
        {/* OneBtnModal 표시*/}
        {isModalOpen && <OneBtnModal type={modalType} onClose={closeModal}/>}
      </form>
    </>
  )
}