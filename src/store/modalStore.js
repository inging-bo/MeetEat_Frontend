import { makeAutoObservable } from "mobx";

const createModalStore = () => {
  return {
    isOpen: false,
    modalStyle: "",
    modalProps: {},

    openModal(style, props = {}) {
      this.isOpen = true;
      this.modalStyle = style;
      this.modalProps = props;
    },

    closeModal() {
      this.isOpen = false; // 모달 닫기
      this.modalStyle = ""; // 모달 스타일 초기화
      this.modalProps = {}; // 모달 속성 초기화
    },
  };
};

const modalStore = createModalStore();
makeAutoObservable(modalStore);
export default modalStore;
