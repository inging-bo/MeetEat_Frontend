import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";

export default function OneBtnModal({type, onClose}) {

    const modalRef = useRef(null);

    // 모달이 열릴 때 이벤트 리스너 추가, 닫힐 때 제거
    useEffect(() => {
        // 배경 클릭 시 모달 닫기
        const handleOuterClick = (e) => {
            // modalRef.current가 존재하고, 클릭한 요소가 modalRef.current 내부가 아닐 때만 닫기
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOuterClick);
        return () => document.removeEventListener("mousedown", handleOuterClick);
    }, [onClose]);

    // ✅ 버튼 별 메세지 선택
    const choiceYes = (type) => {
        switch (type) {
            case "block" :
                return "사용자를 차단했습니다."
            case "report" :
                return "사용자를 신고하였습니다."
            case "logOut" :
                return "로그아웃 되었습니다."
        }
    }

    const navigate = useNavigate();

    const logOut = (type) => {
        if (type === "logOut") {
            // 로그아웃 처리 로직을 여기에 추가 (예: 세션 초기화 등)
            // 이후 메인 페이지로 리디렉션
            navigate("/"); // "/"는 메인 페이지 경로
        } else {
            onClose()
        }
    }

    return (
        <div
            className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
            ref={modalRef}
        >
            <div>
                {choiceYes(type)}
            </div>
            <div className="flex gap-8 justify-center">
                <button onClick={() => logOut(type)}>확인</button>
            </div>
        </div>
    )
}

