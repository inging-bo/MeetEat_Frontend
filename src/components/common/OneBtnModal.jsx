export default function OneBtnModal({ message, onConfirm  }) {
  return (
    <>
      <div>
        {message}
      </div>
      <div className="flex gap-8 justify-center cursor-pointer"
        onClick={() => onConfirm()}
      >
        확인
      </div>
    </>
  )
}

