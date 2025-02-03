import {Link, useLocation} from "react-router-dom";

export default function SuccessNotice() {
    const location = useLocation();

    console.log(location)
    return (
        <div>
            <p>✓</p>
            <p>{location.state?.message || "기본 메시지"}</p>
            <Link to="/">홈페이지로 돌아가기</Link>
        </div>
    )
}
