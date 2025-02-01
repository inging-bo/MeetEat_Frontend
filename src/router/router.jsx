import { Routes, Route } from "react-router-dom";
import Main from "../views/Main.jsx";
import Error from "../views/Error.jsx";
import Account from "../views/Account.jsx";
import MyPage from "../views/MyPage.jsx";
import OpenChat from "../views/OpenChat.jsx";
import SignUp from "../components/account/SignUp.jsx";

export default function router() {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account/signup" element={<SignUp />} />
      <Route path="/mypage/:id" element={<MyPage />} />
      <Route path="/openchat" element={<OpenChat />} />
    </Routes>
  );
}
