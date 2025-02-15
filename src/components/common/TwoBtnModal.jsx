import modalStore from "../../store/modalStore.js";

export default function TwoBtnModal({ message, onConfirm }) {
  return (
    <>
      <div>{message}</div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => modalStore.closeModal()}
          className="flex flex-1 items-center justify-center h-full bg-secondary px-5 py-2 rounded-md text-white"
        >
          아니요
        </button>
        {/* "예" 클릭 시 상태 변경 */}
        <button
          className="flex flex-1 items-center justify-center h-full bg-primary px-5 py-2 rounded-md text-white"
          onClick={() => onConfirm()}
        >
          예
        </button>
      </div>
    </>
  );
}
