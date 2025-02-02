import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header className="w-full flex justify-center h-16">
            <div className="flex w-full justify-between max-w-screen-lg">
                <div>
                    <Link to="/" className="h-full px-4 flex items-center">밋?잇!</Link>
                </div>

                {/*  로그인 or 마이 페이지  */}
                <div>
                    <Link to="/account" className="h-full px-4 flex items-center">로그인</Link>
                </div>
            </div>
        </header>
    )
}
