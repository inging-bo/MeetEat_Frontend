import {useState} from "react";
import {Link} from "react-router-dom";
import Header from "../layout/Header.jsx";
import OneBtnModal from "../common/OneBtnModal.jsx";
import ShowPWIcon from "../../assets/showPW-icon.svg?react";
import HidePWIcon from "../../assets/hidePW-icon.svg?react";
import HeaderLogo from "../../assets/header-logo.svg?react";

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

    // ✅ 회원가입 버튼 클릭 시 동작

    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        console.log("폼 제출 막음!");
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 차단 or 신고 구분
    const signUp = (type) => {
        setIsModalOpen(!isModalOpen);
        setModalType(type);
    }

    // ✅ 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    return (
        <form  onSubmit={handleSubmit}
               className="flex w-96 justify-center items-center">
            <Header/>
            <div className="flex flex-1 flex-col gap-3 justify-center">
                <h1 className="flex justify-center h-8 mb-8">
                    <Link to={"/"}><HeaderLogo className="h-full w-full"/></Link>
                </h1>
                <div className="flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">이메일</span>
                    <input type="email" name="email" className="w-full h-11 outline-0 px-2 border-b border-gray-300"
                           placeholder="email@example.com" required/>
                    <span className="text-sm text-[#FF0000] mt-2 h-5">올바른 이메일 형식이 아닙니다.</span>
                </div>
                <div className="relative flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">비밀번호</span>
                    <label className="relative w-full">
                        <input type={showPW ? "text" : "password"} name="email"
                               className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                               placeholder="비밀번호를 입력해주세요" required/>
                        <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                             onClick={togglePW}>
                            {showPW ? (
                                <ShowPWIcon className="w-full h-full"/>
                            ) : (
                                <HidePWIcon className="w-full h-full"/>
                            )}
                        </div>
                    </label>
                </div>
                <div className="relative flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">비밀번호 확인</span>
                    <label className="relative w-full">
                        <input type={showPWSub ? "text" : "password"} name="email"
                               className="w-full h-11 outline-0 border-b px-2 border-gray-300"
                               placeholder="비밀번호를 입력해주세요" required/>
                        <div className="flex w-5 absolute top-1/2 -translate-y-1/2 right-2 text-gray-500" onClick={togglePWSub}>
                            {showPWSub ? (
                                <ShowPWIcon className="w-full h-full"/>
                            ) : (
                                <HidePWIcon className="w-full h-full"/>
                            )}
                        </div>
                    </label>
                    <span className="text-sm text-[#FF0000] mt-2 h-5">비밀번호가 일치하지 않습니다.</span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">닉네임</span>
                    <input type="text" name="nickName"
                           className=" w-full h-11 px-2 outline-0 border-b border-gray-300  after:left-0 after:text-sm after:text-gray-500 after:block after:content-['한글_6자,_영문_12자까지_입력_가능']"

                           placeholder="닉네임을 입력해주세요" required/>
                    <span className="text-sm text-[#FF0000] mt-2 h-5">사용중인 닉네임입니다.</span>
                </div>
                <button type="submit" onClick={() => signUp("signUp")} className="w-full h-11 bg-gray-200 rounded-md hover:bg-[#FF6445] hover:text-white">회원가입</button>
            </div>
            {/* OneBtnModal 표시*/}
            {isModalOpen && <OneBtnModal type={"signUp"} onClose={closeModal}/>}
        </form>
    )
}