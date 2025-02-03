import {useState} from "react";
import {useNavigate} from "react-router-dom";
import HidePWIcon from "../../assets/hidePW-icon.svg";
import ShowPWIcon from "../../assets/showPW-icon.svg";

export default function ChangePW() {

    // 비밀번호 보이기/숨기기
    const [showPW, setShowPW] = useState(false);
    const [showPWSub, setShowPWSub] = useState(false);
    const togglePW = () => {
        setShowPW(!showPW);
    }
    const togglePWSub = () => {
        setShowPWSub(!showPWSub);
    }

    const navigate = useNavigate();
    const handleChangePW = async () => {
        navigate("/successnotice", { state: { message: "변경이 완료되었습니다." } });
        // 1. 서버에 비밀번호 변경 요청을 보냄 (예제 코드, 실제 요청 필요)
        // const response = await fetch("/api/delete-account", { method: "POST" });

        // if (response.ok) {
        //     // 2. 비밀번호 변경 성공 시 성공 페이지로 이동
        //     navigate("/successnotice", { state: { message: "변경이 완료되었습니다." } });
        // } else {
        //     alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
        // }
    };

    return (
        <form className="flex w-96 justify-center items-center border px-20 py-20 border-gray-300">
            <div className="flex flex-1 flex-col gap-3 justify-center">
                <h1 className="text-2xl text-center">비밀번호 변경</h1>
                <label className="flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">이메일</span>
                    <input type="email" name="email" className="w-full h-11 px-2 border border-gray-300"
                           placeholder="email@example.com" required/>
                </label>
                <label className="relative flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">패스워드</span>
                    <input type={showPW ? "text" : "password"} name="email"
                           className="w-full h-11 border px-2 border-gray-300"
                           placeholder="비밀번호를 입력해주세요" required/>
                    <div className="absolute bottom-3 right-2" onClick={togglePW}>
                        {showPW ? (
                            <img src={ShowPWIcon} className="w-5 h-5 text-gray-500" alt="비밀번호표시"/>
                        ) : (
                            <img src={HidePWIcon} className="w-5 h-5 text-gray-500" alt="비밀번호숨기기"/>
                        )}
                    </div>
                </label>
                <label className="relative flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">패스워드</span>
                    <input type={showPWSub ? "text" : "password"} name="email"
                           className="w-full h-11 border px-2 border-gray-300"
                           placeholder="비밀번호를 입력해주세요" required/>
                    <div className="absolute bottom-3 right-2" onClick={togglePWSub}>
                        {showPWSub ? (
                            <img src={ShowPWIcon} className="w-5 h-5" alt="비밀번호표시"/>
                        ) : (
                            <img src={HidePWIcon} className="w-5 h-5" alt="비밀번호숨기기"/>
                        )}
                    </div>
                </label>
                <label className="flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">닉네임</span>
                    <input type="text" name="nickName"
                           className=" w-full h-11 px-2 border border-gray-300  after:left-0 after:text-sm after:text-gray-500 after:block after:content-['한글_6자,_영문_12자까지_입력_가능']"

                           placeholder="닉네임을 입력해주세요" required/>
                </label>
                <button
                    type="submit"
                    className="w-full h-11 border border-gray-300"
                    onClick={handleChangePW}
                >
                    변경하기
                </button>
            </div>
        </form>
    )
}
