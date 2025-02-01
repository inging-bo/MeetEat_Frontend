import {Link} from "react-router-dom";

export default function Header() {
    return (
        <div className="flex justify-between max-w-screen-lg">
            <Link to="/">밋?잇!</Link>

            {/*  로그인 or 마이 페이지  */}
            <Link to="/account">로그인</Link>
        </div>
    )
}
