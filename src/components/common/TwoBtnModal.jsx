import modalStore from "../../store/modalStore.js";

  return (
    <>
      <div>
        {message}
      </div>
      <div className="flex gap-8 justify-center">
        <button
          onClick={() => modalStore.closeModal()}
          className="h-full px-4 flex items-center"
        >
          아니요
        </button>
        {/* "예" 클릭 시 상태 변경 */}
        <button className="h-full px-4 flex items-center" onClick={() => onConfirm()}>예</button>
      </div>
    </>
  );
}
