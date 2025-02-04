import OneBtnModal from "./OneBtnModal.jsx";
import {useEffect, useRef, useState} from "react";

export default function TwoBtnModal({type,visitorId , problemID, onClose}) {
    console.log(problemID)
    const twoModalRef = useRef(null);
    // 모달이 열릴 때 이벤트 리스너 추가, 닫힐 때 제거
    useEffect(() => {
        // 배경 클릭 시 모달 닫기
        const handleOuterClick = (e) => {
            // twoModalRef.current가 존재하고, 클릭한 요소가 twoModalRef.current 내부가 아닐 때만 닫기
            if (twoModalRef.current && !twoModalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOuterClick);
        return () => document.removeEventListener("mousedown", handleOuterClick);
    }, [onClose]);

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
        >
            {!showOneBtnModal ? (
                <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
                     ref={twoModalRef} // 모달 내부 요소 참조
                >
                    <div>
                        {/* 클릭한 요소별 다른 메세지 전달 */}
                        {choiceMessage(type)}
                    </div>
                    <div className="flex gap-8 justify-center">
                        <button onClick={onClose}>아니요</button>
                        <button onClick={handleYesClick}>예</button>
                        {/* "예" 클릭 시 상태 변경 */}
                    </div>
                </div>
            ) : (
                // OneBtnModal 표시
                <OneBtnModal type={type} visitorId={visitorId} problemID={problemID} onClose={onClose}/>
            )}
        </div>
    )
}