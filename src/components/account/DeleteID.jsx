import {useNavigate} from "react-router-dom";

export default function DeleteID() {

    const navigate = useNavigate();
    const handleDelete = async () => {
        navigate("/successnotice", { state: { message: "탈퇴가 완료되었습니다." } });
        // 1. 서버에 탈퇴 요청을 보냄 (예제 코드, 실제 요청 필요)
        // const response = await fetch("/api/delete-account", { method: "POST" });

        // if (response.ok) {
        //     // 2. 탈퇴 성공 시 성공 페이지로 이동
        //     navigate("/successnotice", { state: { message: "탈퇴가 완료되었습니다." } });
        // } else {
        //     alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
        // }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-red-600">!</p>
                <p className="text-red-600">탈퇴 시 모든 정보가 삭제됩니다.</p>
                <p className="text-red-600">정말로 탈퇴하시겠습니까?</p>
            </div>
            <div className="bg-gray-300 p-5">
                탈퇴 약관
            </div>
            <div className="flex gap-8 justify-center">
                <button onClick={() => navigate("/mypage")}>아니오</button>
                <button onClick={handleDelete}>예</button>
            </div>
        </div>
    )
}
