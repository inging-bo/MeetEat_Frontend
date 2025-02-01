export default function RestInfo() {
    return (
        <div className="max-w-96 min-w-fit flex-1 border-gray-300 border-2 rounded-2xl p-8">
            <h1 className="font-bold text-3xl">마이페이지</h1>
            <div>
                <p>닉네임</p>
                <span>닉네임</span>
                <button>변경</button>
            </div>
            <div>
                <p>한 줄 소개</p>
                <span>안녕하세요</span>
                <button>변경</button>
            </div>
            <div>
                <div><p>메달</p><p>?</p></div>
                <div>메달표시</div>
            </div>
            <div>
                <p>계정 정보</p>
                <div>비밀번호 변경</div>
                <div>탈퇴하기</div>
            </div>
            <button>로그아웃</button>
        </div>
    )
}
