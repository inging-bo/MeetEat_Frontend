import { observer } from 'mobx-react';
import modalStore from '../../store/modalStore.js';
import OneBtnModal from "../common/OneBtnModal.jsx";
import TwoBtnModal from "../common/TwoBtnModal.jsx";

const Modal = observer(() => {
  if (!modalStore.isOpen) return null;

  const { modalStyle, modalProps } = modalStore;
  const { message, onConfirm } = modalProps; // onConfirm, onCancel 추가

  // one 버튼 예 클릭시
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();  // 확인을 선택했을 때 호출
    }
  };

  // modalType에 따른 다른 모달 내용 처리
  const renderModalContent = () => {
    switch (modalStyle) {
      case 'oneBtn':
        return (
          <OneBtnModal
            message={message}
            onConfirm={handleConfirm}
          />
        )
      case 'twoBtn':
        return (
          <TwoBtnModal
            message={message}
            onConfirm={handleConfirm}
          />
        );
      default:
        return <p>오타나 파일 확인하세요</p>;
    }
  };

  return (
    <>
      <div
        className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-20 w-full h-full"
        onClick={() => modalStore.closeModal()} // 모달 닫기
      >
      </div>
      <div
        className="fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-10 min-w-fit bg-white rounded-lg drop-shadow-lg">
        {renderModalContent()}
      </div>
    </>
  );
});

export default Modal;
