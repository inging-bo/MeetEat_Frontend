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
    <div className="flex flex-col max-w-96 min-w-96 flex-1 justify-between border-gray-300 border-2 rounded-2xl p-8">
      <h1 className="font-bold text-3xl">마이페이지</h1>

      {/* 닉네임 수정 */}
      <div>
        <p className="pl-1 py-2 text-2xl text-left border-b-2 border-b-gray-300">닉네임</p>
        <div className="relative flex gap-2 justify-between items-center text-lg p-2">
          {isEditingNickname ? (
            <>
              <input
                type="text"
                id="nickName"
                className="relative w-full flex-1 text-left outline-none border border-gray-300 pl-2 py-2 -my-2 rounded-lg"
                value={nickname}
                onChange={handleNicknameChange}
                autoFocus
              />
              <span className="absolute top-full text-xs text-gray-400">최대 8자리</span>
            </>
          ) : (
            <span className="w-full flex-1 text-left border border-transparent">{nickname}</span>
          )}

          {isEditingNickname ? (
            <button className="rounded-md border-2 border-b-gray-300 py-1 px-2" onClick={saveNickname}>
              완료
            </button>
          ) : (
            <button className="rounded-md border-2 border-b-gray-300 py-1 px-2" onClick={changeNickname}>
              변경
            </button>
          )}
        </div>
      </div>

      {/* 한 줄 소개 수정 */}
      <div>
        <p className="pl-1 py-2 text-2xl text-left border-b-2 border-b-gray-300">한 줄 소개</p>
        <div className="flex gap-2 justify-between items-center text-lg p-2">
          {isEditingIntroduction ? (
            <input
              type="text"
              id="introduce"
              className="w-full flex-1 text-left outline-none border border-gray-300 pl-2 py-2 -my-2 rounded-lg"
              value={introduce}
              onChange={handleIntroductionChange}
              autoFocus
            />
          ) : (
            <span className="flex-1 text-left border border-transparent">{introduce}</span>
          )}
          {isEditingIntroduction ? (
            <button className="rounded-md border-2 border-b-gray-300 py-1 px-2" onClick={saveIntroduction}>
              완료
            </button>
          ) : (
            <button className="rounded-md border-2 border-b-gray-300 py-1 px-2" onClick={changeIntroduction}>
              변경
            </button>
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
