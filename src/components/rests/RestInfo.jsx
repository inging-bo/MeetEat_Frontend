import { observer } from "mobx-react-lite";
import { useEffect, useState, useMemo } from "react";
import useProfileStore from "../../store/profile.js"; // 훅으로 변경된 store import
import authStore from "../../store/authStore.js";
import axios from "axios";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";
import { Link } from "react-router-dom";
import modalStore from "../../store/modalStore.js";
import DeleteID from "../../components/account/DeleteID.jsx";
import { motion } from "framer-motion"

const RestInfo = observer(() => {
  const profileStore = useProfileStore(); // useProfileStore 사용

  useEffect(() => {
    authStore.checkLoggedIn();
    if (!authStore.loggedIn) {
      alert("로그인 후 이용해주세요!");
      window.location.replace("/");
    } else {
      profileStore.fetchProfile(); // 페이지 진입 시 프로필 정보 다시 가져오기
    }
  }, [profileStore]); // store가 변경될 때 useEffect 실행

  function useEditableField(fieldKey) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(profileStore.profile?.[fieldKey] || "");

    useEffect(() => {
      setValue(profileStore.profile?.[fieldKey] || "");
    }, [profileStore.profile, fieldKey]);

    function changeField() {
      setIsEditing(true);
    }

    function handleInputChange(event) {
      const newValue = event.target.value;
      if (fieldKey === "nickname" && newValue.length > 8) return;
      setValue(newValue);
    }

    async function saveField() {
      if (value === profileStore.profile?.[fieldKey]) {
        setIsEditing(false);
        return; // 값이 변경되지 않았으므로 요청을 보내지 않음
      }
      try {
        const url =
          fieldKey === "nickname"
            ? `${import.meta.env.VITE_BE_API_URL}/users/profile/nickname`
            : `${import.meta.env.VITE_BE_API_URL}/users/profile/introduce`;

        const accessToken = window.localStorage.getItem("token");
        const body = { [fieldKey]: value };

        await axios.patch(url, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        await profileStore.fetchProfile(); // 수정 후 최신 프로필 정보 가져오기
        setIsEditing(false);
      } catch (error) {
        console.error("업데이트 실패", error);
      }
    }

    return { value, isEditing, changeField, handleInputChange, saveField };
  }

  const nicknameField = useEditableField("nickname");
  const introduceField = useEditableField("introduce");

  const viewMedal = useMemo(() => {
    const count = profileStore.profile?.matchingCount || 0;
    if (count >= 5) return <GoldMedal />;
    if (count >= 3) return <SilverMedal />;
    if (count >= 1) return <BronzeMedal />;
    return <span className="pl-2 pt-2">매칭을 하면 메달을 얻을 수 있어요!</span>;
  }, [profileStore.profile?.matchingCount]);


  return (
    <div className="flex flex-col gap-10 w-[380px] min-w-[380px] max-w-[380px] flex-1 justify-start border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl px-7 py-10">
      <h1 className="font-bold text-[28px] text-left">마이페이지</h1>

      {/* 닉네임 수정 */}
      <EditableField label="닉네임" field={nicknameField} maxLength={8} />

      {/* 한 줄 소개 수정 */}
      <EditableField label="짧은 소개" field={introduceField} />

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
        <div className="flex items-start text-sm">{viewMedal}</div>
      </div>
      {/* 계정 정보 */}
      <div className="flex flex-col gap-2 h-full">
        <p className="text-[15px] text-left font-bold">계정 정보</p>
        <div className="flex flex-col text-[15px] text-[#909090] h-full items-start">
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "var(--tabBack)"  }}
            className="mb-auto rounded-md px-2 py-1">
            <div >비밀번호 변경</div>
            {/*<Link to="/mypage/changepw">비밀번호 변경</Link>*/}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "var(--tabBack)"  }}
            className="rounded-md px-2 py-1"
            onClick={() =>
              modalStore.openModal("twoBtn", {
                message: () => <DeleteID />,
                onConfirm: async () => {
                  try {
                    const accessToken =
                      window.localStorage.getItem("token"); // 저장된 토큰 가져오기
                    if (!accessToken) {
                      console.error(
                        "탈퇴하기 요청 실패: 토큰이 없습니다."
                      );
                      return;
                    }

                    const response = await axios.delete(
                      `${import.meta.env.VITE_BE_API_URL}/users/withdrawal`,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    if (response.status === 200) {
                      window.localStorage.removeItem("token"); // token 삭제
                      authStore.setLoggedIn(false);
                      navigate("/");
                      modalStore.openModal("oneBtn", {
                        message: "탈퇴하기 완료.",
                        onConfirm: async () => {
                          await modalStore.closeModal()
                        }
                      });
                      console.log("탈퇴하기 완료")
                    }
                    // 토큰값 제거
                  } catch (error) {
                    console.error("탈퇴하기 요청 실패!:", error);
                    // if (error.response?.status === 401) return setMessage("요청 주소가 없습니다.");
                    // if (error.response?.status === 500) {
                    //   setMessage("서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    // } else if (error.response?.status === 400) {
                    //   setMessage(error.response?.data);
                    // } else {
                    //   setMessage("회원가입 요청 중 알 수 없는 오류가 발생했습니다.");
                    // }
                  }
                },
              })
            }
          >
            탈퇴하기
          </motion.button>
        </div>
      </div>
    </div>
  );
});

const EditableField = ({ label, field, maxLength }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[15px] flex items-center justify-between">
        <span className="font-bold">{label}</span>
        {field.isEditing ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="rounded-md border border-black px-1.5" onClick={field.saveField}>
            완료
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-[#909090] rounded-md border border-[#909090] px-1.5" onClick={field.changeField}>
            수정
          </motion.button>
        )}
      </div>
      <div className="relative flex h-10 justify-between items-center text-[15px] text-left border-b border-b-[#EAEAEA] bg-[#F8F8F8]">
        {field.isEditing ? (
          <>
            <input
              type="text"
              className="flex-1 text-left outline-none pl-2 py-2 bg-inherit rounded-lg"
              value={field.value}
              onChange={field.handleInputChange}
              autoFocus
              maxLength={maxLength}
            />
            {maxLength && (
              <span className="absolute top-full pt-1 text-xs text-gray-400">최대 {maxLength}자리만 가능합니다.</span>
            )}
          </>
        ) : (
          <span className="flex-1 pl-2 py-2 text-[#909090]">{field.value}</span>
        )}
      </div>
    </div>
  );
};

export default RestInfo;
