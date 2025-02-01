import {useState} from "react";
import {Link} from "react-router-dom";
import HidePWIcon from "../../assets/hidePW-icon.svg";
import ShowPWIcon from "../../assets/showPW-icon.svg";

export default function SignUp() {

    // 비밀번호 보이기/숨기기
    const [showPW, setShowPW] = useState(false);
    const [showPWSub, setShowPWSub] = useState(false);
    const togglePW = () => {
        setShowPW(!showPW);
    }
    const togglePWSub = () => {
        setShowPWSub(!showPWSub);
    }

    return (
        <form className="flex w-96 justify-center items-center border px-20 py-20 border-gray-300">
            <div className="flex flex-1 flex-col gap-3 justify-center">
                <h1 className="text-2xl text-center">밋?잇!</h1>
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
                <button type="submit" className="w-full h-11 border border-gray-300">회원가입</button>
            </div>
        </form>
    )
}
