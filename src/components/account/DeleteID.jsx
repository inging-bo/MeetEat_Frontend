import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../../store/authStore";

function DeleteID() {

  useEffect(() => {
    authStore.checkLoggedIn();
    if (!authStore.loggedIn) {
      alert("로그인 후 이용해주세요!");
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p>탈퇴 시 모든 정보가 삭제됩니다.</p>
        <p>정말로 탈퇴하시겠습니까?</p>
      </div>
      <div className="text-[8px] tracking-tighter bg-secondary/10 p-2
      sm:text-[11px]
      ">
        <ul className="flex flex-col text-left gap-2
        sm:text-nowrap
        ">
          <li className="text-center text-sm sm:text-lg">탈퇴 약관</li>
          <li className="flex flex-col items-start">
            <p>제 1조 (목적)</p>
            <p className="text-[9px] sm:text-xs ">
              본 약관은 [밋?잇!]의 회원 탈퇴 절차 및 관련 사항을 규정함을 목적으로 합니다.
            </p>
          </li>
          <li className="flex flex-col">
            <p>제 2 조 (회원 탈퇴 신청)</p>
            <p className="text-[9px] sm:text-xs">
              회원은 언제든지 서비스 내 제공되는 탈퇴 절차를 통해 탈퇴 신청을 할 수 있습니다.
            </p>
            <p className="text-[9px] sm:text-xs ">
              회원 탈퇴 시 서비스 이용 기록 및 계정 정보가 삭제될 수 있으며, 삭제된 정보는 복구가 불가능합니다.
            </p>
            <p className="text-[9px] sm:text-xs">
              특정 서비스 이용 기록이 별도로 보관될 필요가 있는 경우, 관련 법령에 따라 일정 기간 동안 보관될 수 있습니다.
            </p>
          </li>
          <li className="flex flex-col items-start">
            <p>제 3 조 (탈퇴 후 이용 제한)</p>
            <p className="text-[9px] sm:text-xs">
              회원 탈퇴 후에는 동일한 계정 정보(이메일 등)로 재가입이 제한될 수 있습니다.
            </p>
            <p className="text-[9px] sm:text-xs">
              탈퇴 후에는 기존 계정과 관련된 데이터 및 서비스 이용 기록에 접근할 수 없습니다.
            </p>
          </li>
          <li className="flex flex-col items-start">
            <p>제 4 조 (개인정보 처리)</p>
            <p className="text-[9px] sm:text-xs">
              회원 탈퇴 시 개인정보는 [개인정보 처리방침]에 따라 삭제 또는 보관됩니다.
            </p>
            <p className="text-[9px] sm:text-xs">
              법령에 따라 보관이 필요한 경우, 해당 정보는 일정 기간 보관 후 파기됩니다.
            </p>
          </li>
          <li className="flex flex-col items-start">
            <p>제 5 조 (약관의 개정 및 고지)</p>
            <p className="text-[9px] sm:text-xs">
              본 약관은 필요에 따라 개정될 수 있으며, 개정 시 서비스 내 공지사항을 통해 고지됩니다.
            </p>
            <p className="text-[9px] sm:text-xs">
              회원은 약관 개정 사항을 숙지해야 하며, 개정 후 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.
            </p>
          </li>
          <li className="flex flex-col items-start">
            <p>부칙</p>
            <p className="text-[9px] sm:text-xs">
              본 약관은 [시행일]부터 시행됩니다.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default observer(DeleteID);
