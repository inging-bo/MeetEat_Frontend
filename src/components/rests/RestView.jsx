import FullStar from "../../assets/full-star.svg?react"

export default function RestView() {
    return (
        <div className="flex fixed top-0 left-0 justify-center items-center bg-black/40 z-50 w-full h-full">
            <div className="flex bg-white p-8 rounded-lg">
                <div>
                    <div>이미지</div>
                    <div>
                        <p className="text-xl font-bold">정남옥 서울대입구점</p>
                        <p><FullStar width="24px" className="text-[#FF6445]"/><span className="text-gray-400">4</span></p>
                    </div>
                    <div>
                        <p>연락처</p>
                        <p className="text-gray-400">02-573-0211</p>
                    </div>
                    <div>
                        <p>주소</p>
                        <p className="text-gray-500">서울 관악구 관악로 148 1층</p>
                    </div>
                    <div>
                        <p>지도</p>
                        <div>지도</div>
                    </div>
                </div>
                <div>
                    <p className="text-xl font-bold">방문자 리뷰</p>
                    <div>
                        <div>
                            <p className="text-sm">쩝쩝</p>
                            <div className="flex"><FullStar width="24px" className="text-[#FF6445]"/><span className="text-gray-400">2025.02.03</span></div>
                            <p className="text-sm text-gray-500">너무 맛있게 먹었습니다 다음에 또 가도록 할게요</p>
                        </div>
                        <div>
                            <p className="text-sm">맛도리</p>
                            <div className="flex"><FullStar width="24px" className="text-[#FF6445]"/><span className="text-gray-400">2025.01.13</span></div>
                            <p className="text-sm text-gray-500">반찬까지 맛있다맛있다맛있다맛있다요</p>
                            <ul className="flex">
                                <li>임지</li>
                                <li>임지</li>
                                <li>임지</li>
                                <li>임지</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm">드르르렁</p>
                            <div className="flex"><FullStar width="24px" className="text-[#FF6445]"/><span className="text-gray-400">2025.01.03</span></div>
                            <p className="text-sm text-gray-500">무난한 맛이에요!</p>
                            <ul className="flex">
                                <li>이미지</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
