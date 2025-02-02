import {useState} from "react";

export default function RestInfo() {

    function useEditableField(initialValue = "") {
        const [value, setValue] = useState(initialValue);  // 상태
        const [isEditing, setIsEditing] = useState(false);  // 수정 가능 여부

        function changeField() {
            setIsEditing(true);  // 입력 필드 활성화
        }

        function handleInputChange(event) {
            const { id, value } = event.target;
            // 닉네임에만 길이 제한 적용
            if (id === 'nickName') {
                if (value.length <= 8) {
                    setValue(value);
                }
            }
            // 한 줄 소개는 제한 없이 처리
            else if (id === 'introduction') {
                setValue(value);
            }
        }

        function saveField() {
            setIsEditing(false);  // 수정 종료
        }

        return {
            value,
            isEditing,
            changeField,
            handleInputChange,
            saveField
        };
    }

    const {
        value: nickname,
        isEditing: isEditingNickname,
        changeField: changeNickname,
        handleInputChange: handleNicknameChange,
        saveField: saveNickname
    } = useEditableField("nickName");

    const {
        value: introduction,
        isEditing: isEditingIntroduction,
        changeField: changeIntroduction,
        handleInputChange: handleIntroductionChange,
        saveField: saveIntroduction
    } = useEditableField("한 줄 소개를 입력하세요.");

    return (
        <div
            className="flex flex-col max-w-96 min-w-96 flex-1 justify-between border-gray-300 border-2 rounded-2xl p-8">
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
                                className="relative w-full flex-1 text-left outline-none border border-gray-300 pl-2 py-2 -my-2 rounded-lg "
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
                        <button
                            className="rounded-md border-2 border-b-gray-300 py-1 px-2"
                            onClick={saveNickname}
                        >
                            완료
                        </button>
                    ) : (
                        <button
                            className="rounded-md border-2 border-b-gray-300 py-1 px-2"
                            onClick={changeNickname}
                        >
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
                            id="introduction"
                            className="w-full flex-1 text-left outline-none border border-gray-300 pl-2 py-2 -my-2 rounded-lg"
                            value={introduction}
                            onChange={handleIntroductionChange}
                            autoFocus
                        />
                    ) : (
                        <span className="w-full flex-1 text-left border border-transparent">{introduction}</span>
                    )}
                    {isEditingIntroduction ? (
                        <button
                            className="rounded-md border-2 border-b-gray-300 py-1 px-2"
                            onClick={saveIntroduction}
                        >
                            완료
                        </button>
                    ) : (
                        <button
                            className="rounded-md border-2 border-b-gray-300 py-1 px-2"
                            onClick={changeIntroduction}
                        >
                            변경
                        </button>
                    )}
                </div>
            </div>
            <div>
                <div
                    className="flex gap-1 items-center pl-1 py-2 text-2xl text-left border-b-2 border-b-gray-300">
                    <p>메달</p>
                    <div
                        className="relative text-gray-400 flex text-lg justify-center items-center border border-gray-400 rounded-full w-5 h-5 cursor-pointer group">
                        <span className="cursor-pointer -mr-3 pr-3">?</span>
                        {/* 도움말 박스 */}
                        <div
                            className="absolute text-black flex-col gap-1 ml-3 min-w-60 left-full bottom-[-10px] text-base bg-white border border-gray-300 p-4 rounded-md hidden group-hover:block cursor-default">
                            <h3 className="text-center pb-1">식사 횟수별 메달 안내</h3>
                            <div className="text-sm text-nowrap"><span>금메달 아이콘</span><span>연간 누적 참여 5회</span></div>
                            <div className="text-sm text-nowrap"><span>금메달 아이콘</span><span>연간 누적 참여 3회</span></div>
                            <div className="text-sm text-nowrap"><span>금메달 아이콘</span><span>연간 누적 참여 1회</span></div>
                            {/* 화살표 모양 */}
                            <div
                                className="absolute bottom-3 rotate-45 right-[calc(100%-0.35rem)] w-3 h-3 border-l border-b border-gray-300 bg-white"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-start text-lg p-2">메달표시</div>
            </div>
            <div>
                <p className="pl-1 py-2 text-2xl text-left border-b-2 border-b-gray-300">계정 정보</p>
                <div className="flex flex-col items-start text-lg p-2">
                    <button className="py-1 mb-1">비밀번호 변경</button>
                    <button className="py-1">탈퇴하기</button>
                </div>
            </div>
            <button className="font-bold text-lg">로그아웃</button>
        </div>
    )
}
