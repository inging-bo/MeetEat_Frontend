import { Routes, Route } from "react-router-dom";
import Main from "../views/Main.jsx";
import Error from "../views/Error.jsx";
import Account from "../views/Account.jsx";
import MyPage from "../views/MyPage.jsx";
import OpenChat from "../views/OpenChat.jsx";
import MeeteatDb from "../views/MeeteatDb.jsx";
import SignUp from "../components/account/SignUp.jsx";
import ChangePW from "../components/account/ChangePW.jsx";
import DeleteID from "../components/account/DeleteID.jsx";
import SuccessNotice from "../components/notice/SuccessNotice.jsx";
import Matching from "../components/matching/Matching.jsx";
import MatchingComplete from "../components/matching/MatchingComplete.jsx";

export default function router() {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
      <Route path="/matching" element={<Matching />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account/signup" element={<SignUp />} />
      {/*<Route path="/mypage/:id" element={<MyPage />} />*/}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/changepw" element={<ChangePW />} />
      <Route path="/mypage/deleteid" element={<DeleteID />} />
      <Route path="/successnotice" element={<SuccessNotice />} />
      <Route path="/openchat" element={<OpenChat />} />
      <Route path="/meeteatdb" element={<MeeteatDb />} />
      <Route path="/matching/complete" element={<MatchingComplete />} />
    </Routes>
  );
}
