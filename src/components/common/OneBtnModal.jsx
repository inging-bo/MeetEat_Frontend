import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";

export default function OneBtnModal({type, onClose}) {
    const oneModalRef = useRef(null);
    // ✅ 모달이 열릴 때 이벤트 리스너 추가, 닫힐 때 제거
    useEffect(() => {
        // 배경 클릭 시 모달 닫기
        const handleOuterClick = (e) => {
            // oneModalRef.current가 존재하고, 클릭한 요소가 oneModalRef.current 내부가 아닐 때만 닫기
            if (oneModalRef.current && !oneModalRef.current.contains(e.target)) {
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
                return "사용자를 차단 했습니다."
            case "unBlock" :
                return "사용자를 차단 해제했습니다."
            case "report" :
                return "사용자를 신고 하였습니다."
            case "unReport" :
                return "사용자를 신고 해제했습니다."
            case "logOut" :
                return "로그아웃 되었습니다."
        }
    }
    // ✅ 확인 눌러을 때 동작
    const check = (type) => {
        switch (type) {
            case "block" : blockUser()
                break
            case "unBlock" : blockUser()
                return
            case "report" : reportUser()
                break
            case "unReport" : reportUser()
                return
            case "logOut" : logOut()
                break

        }
    }

    const navigate = useNavigate();
    // ✅ 타입별 실행 변수
        // 차단하시겠습니까? `예` 인경우
    const blockUser = () => {
        onClose()
    }
        // 신고하시겠습니까? `예` 인경우
    const reportUser = () => {
        onClose()
    };
        // 로그아웃하시겠습니까? `예` 인경우
    const logOut = () => {
        navigate("/")
        onClose()
    }
    return (
        <div
            className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
            ref={oneModalRef}
        >
            <div>
                {choiceYes(type)}
            </div>
            <div className="flex gap-8 justify-center">
                <button onClick={() => check(type)}>확인</button>
            </div>
        </div>
    )
}

