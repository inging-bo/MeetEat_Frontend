import modalStore from "../../store/modalStore.js";

export default function OneBtnModal({ message }) {
  return (
    <>
      <div>
        {message}
      </div>
      <div className="flex gap-8 justify-center">
        <button onClick={() => modalStore.closeModal()}>확인</button>
      </div>
    </>
  )
}

