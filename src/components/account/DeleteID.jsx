import {useNavigate, useParams} from "react-router-dom";

export default function DeleteID() {
    console.log(useParams)

  return (
      <div className="flex flex-col gap-4">
        <div>
            <p className="text-red-600">!</p>
            <p className="text-red-600">탈퇴 시 모든 정보가 삭제됩니다.</p>
            <p className="text-red-600">정말로 탈퇴하시겠습니까?</p>
        </div>
        <div className="bg-gray-300 p-5">
            탈퇴 약관
        </div>
        <div className="flex gap-8 justify-center">
            <button>아니요</button>
            <button>예</button>
        </div>
      </div>
  )
}
