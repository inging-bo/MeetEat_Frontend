import OneBtnModal from "./OneBtnModal.jsx";
import {useState} from "react";

export default function TwoBtnModal({type, onClose}) {

    // ✅ 모달 외부 클릭 시 모달 닫힘
    const handleOuterClick = (e) => {
        // 모달 바깥쪽 클릭 시 onClose 실행
        if (e.target === e.currentTarget) {
            onClose();  // 모달 닫기
        }
    };

    // ✅ 버튼 별 메세지 선택
    const choiceMessage = (type) => {
        switch (type) {
            case "block" :
                return "정말 차단 하시겠습니까?"
            case "report" :
                return "정말 신고 하시겠습니까?"
            case "logOut" :
                return "정말 로그아웃 하시겠습니까?"
        }
    }

    // ✅ 예 클릭시 모달 구현 위한 곳
    const [showOneBtnModal, setShowOneBtnModal] = useState(false);

    // "예" 버튼 클릭 시 OneBtnModal 표시
    const handleYesClick = () => {
        setShowOneBtnModal(true);
    };

    return (
        <div
            className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full"
            onClick={handleOuterClick}
        >
            {!showOneBtnModal ? (
                <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
                     onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 전파 방지
                >
                    <div>
                        {/* 클릭한 요소별 다른 메세지 전달 */}
                        {choiceMessage(type)}
                    </div>
                    <div className="flex gap-8 justify-center">
                        <button onClick={onClose}>아니요</button>
                        <button onClick={handleYesClick}>예</button> {/* "예" 클릭 시 상태 변경 */}
                    </div>
                </div>
            ) : (
                // OneBtnModal 표시
                <OneBtnModal type={type}/>
            )}
        </div>
    )
}