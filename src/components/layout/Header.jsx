import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/header-logo.svg?react";
import { useState, useEffect } from "react";
import TwoBtnModal from "../common/TwoBtnModal.jsx";

export default function Header() {

    // ✅ 회원가입 버튼 클릭 시 동작

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const openModal = (e) => {
        e.preventDefault();
        setModalType("logOut");
        setIsModalOpen(!isModalOpen)
    }

    // ✅ 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 컴포넌트가 처음 렌더링될 때 localStorage에서 accessToken 확인
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token); // accessToken이 있으면 true, 없으면 false
    }, []);
    return (
      <header className="fixed top-0 shadow-lg w-full z-50 flex justify-center h-16">
          <div className="flex w-full justify-between max-w-screen-xl">
              <div>
                  <Link to="/" className="h-full px-4 flex items-center">
                      <HeaderLogo />
                  </Link>
              </div>

              {/* 로그인 or 마이 페이지 */}
              <div>
                  {isLoggedIn ? (
                    <button onClick={ (e) => openModal(e)} className="h-full px-4 flex items-center cursor-pointer">
                        로그아웃
                    </button>
                  ) : (
                    <Link to="/account" className="h-full px-4 flex items-center">
                        로그인
                    </Link>
                  )}
              </div>
          </div>
          {/* OneBtnModal 표시*/}
          {isModalOpen && <TwoBtnModal type={modalType} onClose={closeModal}/>}
      </header>
    );
}