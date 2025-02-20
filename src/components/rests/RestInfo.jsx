import { observer } from "mobx-react-lite";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import authStore from "../../store/authStore.js";
import modalStore from "../../store/modalStore.js";
import axios from "axios";
import GoldMedal from "../../assets/Medal-Gold.svg?react";
import SilverMedal from "../../assets/Medal-Silver.svg?react";
import BronzeMedal from "../../assets/Medal-Bronze.svg?react";
import DeleteID from "../../components/account/DeleteID.jsx";

const RestInfo = observer(() => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      console.error("[Error] 프로필 정보를 불러올 수 없음: 토큰 없음");
      alert("로그인이 필요합니다.");
      authStore.setLoggedIn(false);
      window.location.replace("/");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfileData(data);
    } catch (error) {
      console.error("[Error] 프로필 정보를 불러오는데 실패:", error);

      if (error.response) {
        console.error("응답 상태 코드:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      } else if (error.request) {
        console.error("요청은 보내졌으나 응답 없음:", error.request);
      } else {
        console.error("요청 설정 중 에러 발생:", error.message);
      }

      if (error.response?.status === 403) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        authStore.setLoggedIn(false);
        window.location.replace("/");
      }
    }
  };

  // 페이지 진입 시 로그인 체크 및 프로필 정보 요청
  useEffect(() => {
    authStore.checkLoggedIn();
    if (!authStore.loggedIn) {
      alert("로그인 후 이용해주세요!");
      window.location.replace("/");
    } else {
      fetchProfile();
    }
  }, []);

  // EditableField 훅 (프로필 정보를 편집할 필드를 관리)
  function useEditableField(fieldKey) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(profileData?.[fieldKey] || "");

    useEffect(() => {
      console.log(
        `ProfileData 업데이트 감지됨: ${fieldKey} = ${profileData?.[fieldKey]}`
      ); // 수정 - 전찬민
      setValue(profileData?.[fieldKey] || "");
    }, [profileData, fieldKey]);

    function changeField() {
      console.log(`수정 모드 활성화: ${fieldKey}`); // 수정 - 전찬민
      setIsEditing(true);
    }

    function handleInputChange(event) {
      const newValue = event.target.value;
      console.log(`입력값 변경됨: ${newValue}`);
      if (fieldKey === "nickname" && newValue.length > 8) return;
      setValue(newValue);
    }

    async function saveField() {
      // 값이 변경되지 않았다면 그냥 종료
      if (value === profileData?.[fieldKey]) {
        console.warn("값이 변경되지 않음: ${value}");
        setIsEditing(false);
        return;
      }
      try {
        const url =
          fieldKey === "nickname"
            ? `${import.meta.env.VITE_BE_API_URL}/users/profile/nickname`
            : `${import.meta.env.VITE_BE_API_URL}/users/profile/introduce`;

        const accessToken = localStorage.getItem("token");
        const body = { [fieldKey]: value };

        console.log("닉네임 변경 요청: ${JSON.stringify(body)}"); // 수정 - 전찬민

        await axios.patch(url, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 수정 후 최신 프로필 정보 가져오기
        await fetchProfile();
        setIsEditing(false);
        // } catch (error) {
        //     console.error("업데이트 실패", error);
        // }
      } catch (error) {
        console.error("[Error] 프로필 업데이트 실패:", error);

        if (error.response) {
          console.error("응답 상태 코드:", error.response.status);
          console.error("응답 데이터:", error.response.data);
        } else if (error.request) {
          console.error(
            "요청은 보내졌으나 응답 없음:",
            error.request
          );
        } else {
          console.error("요청 설정 중 에러 발생:", error.message);
        }
      } // 수정 - 전찬민
    }

    return { value, isEditing, changeField, handleInputChange, saveField };
  }

  const nicknameField = useEditableField("nickname");
  const introduceField = useEditableField("introduce");

  const viewMedal = useMemo(() => {
    const count = profileData?.matchingCount || 0;
    if (count >= 5) return <GoldMedal/>;
    if (count >= 3) return <SilverMedal/>;
    if (count >= 1) return <BronzeMedal/>;
    return (
      <span className="pl-2 pt-2">
        매칭을 하면 메달을 얻을 수 있어요!
      </span>
    );
  }, [profileData?.matchingCount]);

  return (
    <div
      className="flex flex-col h-[inherit] gap-10 basis-full md:w-[380px] md:min-w-[380px] md:max-w-[380px] justify-start border border-[#ff6445] bg-white drop-shadow-lg rounded-2xl px-7 py-7">
      <h1 className="font-bold text-[28px] text-left">내 정보</h1>

      {/* 닉네임 수정 */}
      <EditableField label="닉네임" field={nicknameField} maxLength={8}/>

      {/* 한 줄 소개 수정 */}
      <EditableField label="짧은 소개" field={introduceField}/>

      {/* 메달 표시 */}
      <div>
        <div className="flex gap-1 items-center text-[15px] text-left border-b-gray-300">
          <p className="font-bold">메달</p>
          <div
            className="relative text-gray-400 flex justify-center items-center bg-[#CDCDCD] rounded-full w-5 h-5 cursor-pointer group">
            <span className="text-sm text-white cursor-pointer -mr-5 pr-5">
              ?
            </span>
            {/* 도움말 박스 */}
            <div
              className="absolute text-black flex-col gap-1 ml-3 min-w-min left-full bottom-[-10px] text-base bg-white border border-gray-300 p-4 rounded-md hidden group-hover:block cursor-default">
              <h3 className="text-center pb-1">식사 횟수별 메달 안내</h3>
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-nowrap">
                  <GoldMedal/>
                  <span>연간 누적 참여 5회</span>
                </div>
                <div className="flex items-center text-sm text-nowrap">
                  <SilverMedal/>
                  <span>연간 누적 참여 3회</span>
                </div>
                <div className="flex items-center text-sm text-nowrap">
                  <BronzeMedal/>
                  <span>연간 누적 참여 1회</span>
                </div>
              </div>
              {/* 화살표 모양 */}
              <div
                className="absolute bottom-3 rotate-45 right-[calc(100%-0.35rem)] w-3 h-3 border-l border-b border-gray-300 bg-white"></div>
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
            whileTap={{ scale: 0.95, backgroundColor: "#90909030" }}
            transition={{ duration: 0.1 }}
            className="mb-auto rounded-md px-2 py-1"
          >
            <Link to="/mypage/changepw">비밀번호 변경</Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#90909030" }}
            transition={{ duration: 0.1 }}
            className="rounded-md px-2 py-1"
            onClick={() =>
              modalStore.openModal("twoBtn", {
                message: () => <DeleteID/>,
                onConfirm: () => {
                  modalStore.openModal("twoBtn", {
                    message: "정말로 탈퇴 하시겠습니까?",
                    onConfirm: async () => {
                      try {
                        const accessToken = localStorage.getItem("token");
                        if (!accessToken) {
                          console.error("탈퇴하기 요청 실패: 토큰이 없습니다.");
                          return;
                        }

                        const response = await axios.delete(
                          `${import.meta.env.VITE_BE_API_URL}/users/withdrawal`,
                          {
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        if (response.status === 200) {
                          modalStore.openModal("oneBtn", {
                            message: "탈퇴하기 완료.",
                            onConfirm: async () => {
                              await modalStore.closeModal();
                              localStorage.removeItem("token");
                              authStore.setLoggedIn(false);
                              navigate("/");
                            },
                          });
                          console.log("탈퇴하기 완료");
                        }
                      } catch (error) {
                        console.error("탈퇴하기 요청 실패!:", error);
                      }
                    },
                    reverseOrder: true, // 두 번째 모달의 버튼 순서를 뒤집습니다.
                  });
                },
                reverseOrder: true, // 첫 번째 모달의 버튼 순서를 뒤집습니다.
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
            className="rounded-md border border-black px-1.5"
            onClick={field.saveField}
          >
            완료
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-[#909090] rounded-md border border-[#909090] px-1.5"
            onClick={field.changeField}
          >
            수정
          </motion.button>
        )}
      </div>
      <div
        className="relative flex h-10 justify-between items-center text-[15px] text-left border-b border-b-[#EAEAEA] bg-[#F8F8F8]">
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
              <span className="absolute top-full pt-1 text-xs text-gray-400">
                최대 {maxLength}자리만 가능합니다.
              </span>
            )}
          </>
        ) : (
          <span className="flex-1 pl-2 py-2 text-[#909090]">
            {field.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default RestInfo;
