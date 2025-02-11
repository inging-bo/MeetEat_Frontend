import { observer } from 'mobx-react';
import modalStore from '../../store/modalStore.js';
import OneBtnModal from "../common/OneBtnModal.jsx";
import TwoBtnModal from "../common/TwoBtnModal.jsx";

const Modal = observer(() => {
  if (!modalStore.isOpen) return null;

  const { modalStyle, modalProps } = modalStore;
  const { type, userId } = modalProps; // modalProps에서 type과 userId 추출

  // modalType에 따른 다른 모달 내용 처리
  const renderModalContent = () => {
    switch (modalStyle) {
      case 'oneBtn':
        return (
          <OneBtnModal type={type} userId={userId}/>
        );
      case 'twoBtn':
        return (
          <TwoBtnModal type={type} userId={userId}/>
        );
      default:
        return <p>오타나 파일 확인하세요</p>;
    }
  };

  return (
    <>
      <div
        className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-10 w-full h-full"
        onClick={ () => modalStore.closeModal()}
      >
      </div>
      <div className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-10 min-w-fit bg-white rounded-lg drop-shadow-lg">
        {renderModalContent()}
      </div>
    </>
  );
});

export default Modal;
