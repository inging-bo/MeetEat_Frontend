import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";

export default function RestInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [nicknameData, setNicknameData] = useState("");
  const [introductionData, setIntroductionData] = useState("");
  const [matchingCount, setMatchingCount] = useState("");

  // 서버에서 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/users/profile");
        setProfile(response.data);
        setNicknameData(response.data.nickname || "");
        setIntroductionData(
          response.data.introduce || "한 줄 소개를 입력하세요."
        );
        setMatchingCount(response.data.matchingCount);
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
        const response = await axios.put("/users/profile", {
          [fieldKey]: value,
        });
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
    saveField: saveNickname,
  } = useEditableField(nicknameData, setNicknameData, "nickname");

  const {
    value: introduce,
    isEditing: isEditingIntroduction,
    changeField: changeIntroduction,
    handleInputChange: handleIntroductionChange,
    saveField: saveIntroduction,
  } = useEditableField(introductionData, setIntroductionData, "introduce");

  // 매칭 횟수별 메달 표시
  const viewMedal = () => {
    if (matchingCount >= 5) {
      return <GoldMedal />;
    } else if (matchingCount >= 3) {
      return <SilverMedal />;
    } else if (matchingCount >= 1) {
      return <BronzeMedal />;
    } else {
      return (
        <span className="pl-2 pt-2">매칭을 하면 메달을 얻을 수 있어요!</span>
      );
    }
  };

  return (
    <div className="flex flex-col gap-10 w-[380px] min-w-[380px] max-w-[380px] flex-1 justify-start border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl px-7 py-10">
      <h1 className="font-bold text-[28px] text-left">마이페이지</h1>
      {/* 닉네임 수정 */}
      <div className="flex flex-col gap-2">
        <div className="text-[15px] flex items-center justify-between">
          <span className="font-bold">닉네임</span>
          {isEditingNickname ? (
            <button
              className="rounded-md border border-black px-1.5"
              onClick={saveNickname}
            >
              완료
            </button>
          ) : (
            <button
              className="text-[#909090] rounded-md border border-[#909090] px-1.5"
              onClick={changeNickname}
            >
              수정
            </button>
          )}
        </div>
        <div className="relative flex h-10 justify-between items-center text-[15px] text-left border-b border-b-[#EAEAEA] bg-[#F8F8F8]">
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
              <span className="absolute top-full pt-1 text-xs text-gray-400">
                최대 8자리만 가능합니다.
              </span>
            </>
          ) : (
            <span className="flex-1 pl-2 py-2 text-[#909090]">{nickname}</span>
          )}
        </div>
      </div>

      {/* 한 줄 소개 수정 */}
      <div className="flex flex-col gap-2">
        <div className="text-[15px] flex items-center justify-between">
          <span className="font-bold">짧은 소개</span>
          {isEditingIntroduction ? (
            <button
              className="rounded-md border border-black px-1.5"
              onClick={saveIntroduction}
            >
              완료
            </button>
          ) : (
            <button
              className="text-[#909090] rounded-md border border-[#909090] px-1.5"
              onClick={changeIntroduction}
            >
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
      {/* 메달 표시 */}
      <div>
        <div className="flex gap-1 items-center text-[15px] text-left border-b-gray-300">
          <p className="font-bold">메달</p>
          <div className="relative text-gray-400 flex justify-center items-center bg-[#CDCDCD] rounded-full w-5 h-5 cursor-pointer group">
            <span className="text-sm text-white cursor-pointer -mr-5 pr-5">
              ?
            </span>
            {/* 도움말 박스 */}
            <div className="absolute text-black flex-col gap-1 ml-3 min-w-min left-full bottom-[-10px] text-base bg-white border border-gray-300 p-4 rounded-md hidden group-hover:block cursor-default">
              <h3 className="text-center pb-1">식사 횟수별 메달 안내</h3>
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-nowrap">
                  <GoldMedal />
                  <span>연간 누적 참여 5회</span>
                </div>
                <div className="flex items-center text-sm text-nowrap">
                  <SilverMedal />
                  <span>연간 누적 참여 3회</span>
                </div>
                <div className="flex items-center text-sm text-nowrap">
                  <BronzeMedal />
                  <span>연간 누적 참여 1회</span>
                </div>
              </div>
              {/* 화살표 모양 */}
              <div className="absolute bottom-3 rotate-45 right-[calc(100%-0.35rem)] w-3 h-3 border-l border-b border-gray-300 bg-white"></div>
            </div>
          </div>
        </div>
        <div className="flex items-start text-sm">{viewMedal()}</div>
      </div>
      {/* 계정 정보 */}
      <div className="flex flex-col gap-2 h-full">
        <p className="text-[15px] text-left font-bold">계정 정보</p>
        <div className="flex flex-col text-[15px] text-[#909090] h-full items-start">
          <button className="mb-auto">
            <Link to="/mypage/changepw">비밀번호 변경</Link>
          </button>
          <button>
            <Link to="/mypage/deleteid">탈퇴하기</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
