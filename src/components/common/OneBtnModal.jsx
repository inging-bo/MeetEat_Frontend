import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";

export default function OneBtnModal({type,visitorId, problemID, onClose}) {
    console.log(visitorId)
    console.log(problemID)
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
                return "사용자를 차단했습니다."
            case "report" :
                return "사용자를 신고하였습니다."
            case "logOut" :
                return "로그아웃 되었습니다."
        }
    }

    const navigate = useNavigate();

    const typeChk = (type) => {
        switch (type) {
            case "block" : blockUser()
                break
            case "report" : reportUser()
                break
            case "logOut" : logOut()
                break
        }
    }

    // ✅ 타입별 실행 변수
        // 차단하시겠습니까? `예` 인경우
    const blockUser = () => {
        console.log(visitorId)
    }
        // 신고하시겠습니까? `예` 인경우
    const reportUser = () => {
        problemID()
    }
        // 로그아웃하시겠습니까? `예` 인경우
    const logOut = () => {
        console.log(type)
        navigate("/")
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
                <button onClick={() => typeChk(type)}>확인</button>
            </div>
        </div>
    )
}

