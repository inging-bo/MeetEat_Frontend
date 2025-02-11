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
      this.isOpen = false;
      this.modalStyle = "";
      this.modalProps = {};
    },
  };
};

const modalStore = createModalStore();
makeAutoObservable(modalStore);
export default modalStore;
