import {useNavigate} from "react-router-dom";

export default function OneBtnModal({type}) {
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
        }
    }

    return (
        <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
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

