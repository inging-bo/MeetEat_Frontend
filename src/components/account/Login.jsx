import {useState} from "react";
import {Link} from "react-router-dom";
import HidePWIcon from "../../assets/hidePW-icon.svg";
import ShowPWIcon from "../../assets/showPW-icon.svg";

export default function Login() {

    // 비밀번호 보이기/숨기기
    const [showPW, setShowPW] = useState(false);
    const togglePW = () => {
        setShowPW(!showPW);
    }

    return (
        <form className="flex w-96 justify-center items-center border px-20 py-20 border-gray-300">
            <div className="flex flex-1 flex-col gap-3 justify-center">
                <h1 className="text-2xl text-center">로그인</h1>
                {/* 이메일 형식일 때 통과 하도록 적기 */}
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
                <button type="submit" className="w-full h-11 border border-gray-300">로그인</button>
                <div
                    className="relative text-center before:absolute before:left-0 before:right-0 before:h-[1px] before:bg-black before:top-[55%]">
                    <span className="relative px-3 bg-white ">or</span>
                </div>
                <div className="flex h-11 gap-3">
                    <button className="flex-1 border border-gray-300">카카오</button>
                    <button className="flex-1 border border-gray-300">네이버</button>
                </div>
                <div className="flex gap-3 justify-center text-xs">
                    <p>계정이 없으신가요?</p>
                    <Link to="/account/signup" className="relative border-b-2 border-transparent hover:border-black">회원가입</Link>
                </div>
            </div>
        </form>
    )
}
