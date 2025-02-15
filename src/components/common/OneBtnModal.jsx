export default function OneBtnModal({ message, onConfirm  }) {
  return (
    <>
      <div>
        {message}
      </div>
      <button className="flex flex-1 px-5 py-2 bg-primary text-white rounded-md justify-center items-center cursor-pointer"
        onClick={() => onConfirm()}
      >
        확인
      </button>
    </>
  )
}

