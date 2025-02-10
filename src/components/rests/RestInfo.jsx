import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwoBtnModal from "../common/TwoBtnModal.jsx";
import axios from "axios";

export default function RestInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [nicknameData, setNicknameData] = useState("");
  const [introductionData, setIntroductionData] = useState("");

  // 서버에서 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/users/profile");
        setProfile(response.data);
        setNicknameData(response.data.nickname || "");
        setIntroductionData(response.data.introduce || "한 줄 소개를 입력하세요.");
        navigate(`/mypage/${response.data.id}`);

      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다", error);
      }
    };

    fetchProfile();
  }, []);

  function useEditableField(initialValue, updateFunction, fieldKey) {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    // 초기값이 변경되면 상태 업데이트
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    function changeField() {
      setIsEditing(true);
    }

    function handleInputChange(event) {
      const newValue = event.target.value;
      if (fieldKey === "nickname" && newValue.length > 8) return; // 닉네임은 8자 제한
      setValue(newValue);
    }

    async function saveField() {
      try {
        const response = await axios.put("/users/profile", { [fieldKey]: value });
        updateFunction(response.data[fieldKey]); // 응답받은 값으로 업데이트
        setIsEditing(false);
      } catch (error) {
        console.error("업데이트 실패", error);
      }
    }

    return { value, isEditing, changeField, handleInputChange, saveField };
  }

  const {
    value: nickname,
    isEditing: isEditingNickname,
    changeField: changeNickname,
    handleInputChange: handleNicknameChange,
    saveField: saveNickname
  } = useEditableField(nicknameData, setNicknameData, "nickname");

  const {
    value: introduce,
    isEditing: isEditingIntroduction,
    changeField: changeIntroduction,
    handleInputChange: handleIntroductionChange,
    saveField: saveIntroduction
  } = useEditableField(introductionData, setIntroductionData, "introduce");

  // 로그아웃 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col w-[380px] max-w-[380px] flex-1 justify-between border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl px-7 py-10">
      <h1 className="font-bold text-[28px] text-left">마이페이지</h1>

      {/* 닉네임 수정 */}
      <div className="flex flex-col gap-2">
        <div className="text-[15px] flex items-center justify-between">
          <span>닉네임</span>
          {isEditingNickname ? (
            <button className="rounded-md border border-black px-1.5" onClick={saveNickname}>
              완료
            </button>
          ) : (
            <button className="text-[#909090] rounded-md border border-b-[#909090] px-1.5" onClick={changeNickname}>
              수정
            </button>
          )}
        </div>
        <div
          className="relative flex h-10 justify-between items-center text-[15px] text-left border-b border-b-[#EAEAEA] bg-[#F8F8F8]">
          {isEditingNickname ? (
            <>
              <input
                type="text"
                id="nickName"
                className="flex-1 text-left outline-none pl-2 py-2 bg-inherit rounded-lg"
                value={nickname}
                onChange={handleNicknameChange}
                autoFocus
              />
              <span className="absolute top-full pt-1 text-xs text-gray-400">최대 8자리만 가능합니다.</span>
            </>
          ) : (
            <span className="flex-1 pl-2 py-2 text-[#909090]">{nickname}</span>
          )}
        </div>
      </div>

      {/* 한 줄 소개 수정 */}
      <div className="flex flex-col gap-2">
        <div className="text-[15px] flex items-center justify-between">
          <span>짧은 소개</span>
          {isEditingIntroduction ? (
            <button className="rounded-md border border-black px-1.5" onClick={saveIntroduction}>
              완료
            </button>
          ) : (
            <button className="text-[#909090] rounded-md border border-b-[#909090] px-1.5" onClick={changeIntroduction}>
              수정
            </button>
          )}
        </div>
        <div className="flex h-10 justify-between items-center text-[15px] text-left border-b border-b-[#EAEAEA] bg-[#F8F8F8]">
          {isEditingIntroduction ? (
            <input
              type="text"
              id="introduce"
              className="flex-1 outline-none pl-2 py-2 bg-inherit rounded-lg"
              value={introduce}
              onChange={handleIntroductionChange}
              autoFocus
            />
          ) : (
            <span className="flex-1 pl-2 py-2 text-[#909090]">{introduce}</span>
          )}
        </div>
      </div>

      {/* 계정 정보 */}
      <div>
        <p className="pl-1 py-2 text-2xl text-left border-b-2 border-b-gray-300">계정 정보</p>
        <div className="flex flex-col items-start text-lg p-2">
          <button className="py-1">
            <Link to="/mypage/changepw">비밀번호 변경</Link>
          </button>
          <button className="py-1 mb-1">
            <Link to="/mypage/deleteid">탈퇴하기</Link>
          </button>
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <button onClick={openModal} className="font-bold text-lg">로그아웃</button>

      {/* 모달 */}
      {isModalOpen && <TwoBtnModal type="logOut" onClose={closeModal} />}
    </div>
  );
}
