export default function TwoBtnModal({ type, onClose }) {

    const handleOuterClick = (e) => {
        // 모달 바깥쪽 클릭 시 onClose 실행
        if (e.target === e.currentTarget) {
            onClose();  // 모달 닫기
        }
    };

    return (
        <div
            className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full"
            onClick={handleOuterClick}
        >
            <div className="w-80 p-10 bg-white rounded-lg drop-shadow-lg"
                 onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 전파 방지
            >
                <div>
                    {/* 클릭한 요소별 다른 메세지 전달 */}
                    {type === "block" ? "정말 차단하시겠습니까?" : (type === "report" ? "정말 신고하시겠습니까?" : "정말 로그아웃 하시겠습니까?")}
                </div>
                <div className="flex gap-8 justify-center">
                    <button onClick={onClose}>아니요</button>
                    <button>예</button>
                </div>
            </div>
        </div>
    )
}