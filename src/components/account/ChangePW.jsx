import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import Header from "../layout/Header.jsx";
import axios from "axios";

export default function ChangePW() {

  // 값 유무 확인
  const [currentPwInput, setCurrentPwInput] = useState("")
  const [newPwInput, setNewPwInput] = useState("")
  const [subNewPwInput, setSubNewPwInput] = useState("")
  const [hasValue, setHasValue] = useState(false)

  // input필드 관찰
  const currentPwChange = (e) => setCurrentPwInput(e.target.value);
  const NewPwChange = (e) => setNewPwInput(e.target.value);
  const subNewPwChange = (e) => setSubNewPwInput(e.target.value);

  // 입력값 변경 시 hasValue 상태 업데이트
  useEffect(() => {
    setHasValue(currentPwInput.length > 0 && newPwInput.length > 0 && subNewPwInput.length > 0);
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

  const navigate = useNavigate();

  const handleChangePW = async (e) => {
    e.preventDefault();

    try {
      const accessToken = window.localStorage.getItem("accessToken"); // 저장된 토큰 가져오기

      if (!accessToken) {
        setMessage("로그인 정보가 없습니다.");
        return;
      }

      if (newPwInput !== subNewPwInput) {
        setMessage("입력한 새 비밀번호가 서로 다릅니다.");
        return;
      }

      const response = await axios.post(
        "/users/change-password",
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
        navigate("/successnotice", { state: { message: "변경이 완료되었습니다." } });
      }
    } catch (error) {
      if (!error.response) {
        console.error("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const { status } = error.response;

      if (status === 401) {
        setMessage("인증 정보가 없습니다.");
      } else if (status === 400) {
        setMessage("현재 비밀번호가 일치하지 않습니다.");
      } else if (status === 402) {
        setMessage("변경하는 비밀번호는 3글자 이상");
      } else if (status === 403) {
        setMessage("새 비밀번호가 유효하지 않습니다.");
      } else {
        setMessage("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };


  return (
    <form className="flex w-96 justify-center items-center">
      <Header/>
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <h1 className="text-2xl text-center">비밀번호 변경</h1>
        <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">현재 비밀번호 <span className="text-red-500">- 임시로 현재 비번 1234입니다.</span></span>
          <label className="relative w-full">
            <input
              type={showCurrentPW ? "text" : "password"} name="password"
              className="w-full h-11 outline-0 border-b px-2 border-gray-300"
              value={currentPwInput}
              onChange={currentPwChange}
              placeholder="임시 현재 비밀번호 1234" required
            />
            <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                 onClick={toggleCurrentPW}>
              {showCurrentPW ? (
                <ShowPWIcon className="w-full h-full"/>
              ) : (
                <HidePWIcon className="w-full h-full"/>
              )}
            </div>
          </label>
        </div>
        <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">새 비밀번호 <span className="text-red-500">- 3글자 이하면 오류</span></span>
          <label className="relative w-full">
            <input
              type={showNewPW ? "text" : "password"} name="password"
              className="w-full h-11 outline-0 border-b px-2 border-gray-300"
              value={newPwInput}
              onChange={NewPwChange}
              placeholder="비밀번호를 입력해주세요" required
            />
            <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                 onClick={toggleNewPW}>
              {showNewPW ? (
                <ShowPWIcon className="w-full h-full"/>
              ) : (
                <HidePWIcon className="w-full h-full"/>
              )}
            </div>
          </label>
        </div>
        <div className="relative flex flex-col items-start">
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">새 비밀번호 확인</span>
          <label className="relative w-full">
            <input
              type={showNewPWSub ? "text" : "password"} name="password"
              className="w-full h-11 outline-0 border-b px-2 border-gray-300"
              value={subNewPwInput}
              onChange={subNewPwChange}
              placeholder="비밀번호를 입력해주세요" required
            />
            <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                 onClick={toggleNewPWSub}>
              {showNewPWSub ? (
                <ShowPWIcon className="w-full h-full"/>
              ) : (
                <HidePWIcon className="w-full h-full"/>
              )}
            </div>
          </label>
          <spaNewPwInput
            className="text-sm text-[#FF0000] mt-2 h-5">{newPwInput !== subNewPwInput && "비밀번호가 일치하지 않습니다."}</spaNewPwInput>
        </div>
        <button
          type="submit"
          className={`w-full h-11 rounded-md hover:bg-[#FF6445] hover:text-white ${
            hasValue ? "bg-[#FF6445] text-white" : "bg-gray-200"
          }`}
          onClick={(e) => handleChangePW(e)}
        >
          변경하기
        </button>
        {/* 에러 메시지 표시 */}
        <p className="text-sm text-[#FF0000] mt-2 min-h-5">{message}</p>
      </div>
    </form>
  )
}
