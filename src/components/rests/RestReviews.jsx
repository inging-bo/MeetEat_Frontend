import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import TwoBtnModal from "../common/TwoBtnModal.jsx";

export default function RestReviews() {

    // ✅ 확인용 방문 히스토리
    const visitRestList = [
        {
            id: 1,
            place_name: "김밥천국",
            category_name: "한식",
            myReview: false,
            visitors: [
                {id: "user1", nickname: "철수", report: false, block: false},
                {id: "user2", nickname: "영희", report: false, block: false},
                {id: "user3", nickname: "민수", report: false, block: false},
            ],
        },
        {
            id: 2,
            place_name: "스타벅스",
            category_name: "카페",
            myReview: true,
            visitors: [
                {id: "user4", nickname: "지훈", report: false, block: false},
                {id: "user5", nickname: "수진", report: false, block: false},
            ],
        },
        {
            id: 3,
            place_name: "김밥천국",
            category_name: "한식",
            myReview: false,
            visitors: [
                {id: "user6", nickname: "철수", report: false, block: false},
                {id: "user7", nickname: "영희", report: false, block: false},
                {id: "user8", nickname: "민수", report: false, block: false},
            ],
        },
        {
            id: 4,
            place_name: "스타벅스",
            category_name: "카페",
            myReview: true,
            visitors: [
                {id: "user9", nickname: "지훈", report: false, block: false},
                {id: "user10", nickname: "수진", report: false, block: false},
            ],
        },
        {
            id: 5,
            place_name: "김밥천국",
            category_name: "한식",
            myReview: false,
            visitors: [
                {id: "user11", nickname: "철수", report: false, block: false},
                {id: "user12", nickname: "영희", report: false, block: false},
                {id: "user13", nickname: "민수", report: false, block: false},
            ],
        },
        {
            id: 6,
            place_name: "스타벅스",
            category_name: "카페",
            myReview: true,
            visitors: [
                {id: "user14", nickname: "지훈", report: false, block: false},
                {id: "user15", nickname: "수진", report: false, block: false},
            ],
        },
    ];
    // 로컬 스토리지에 데이터 저장
    useEffect(() => {
        localStorage.setItem("restaurantReviews", JSON.stringify(visitRestList));
    }, []);

    // 로컬 스토리지에서 데이터 가져오기
    const [restaurantReviews, setRestaurantReviews] = useState(() => {
        const storedData = localStorage.getItem("restaurantReviews");
        return storedData ? JSON.parse(storedData) : [];
    });

    // ✅ 신고하기 차단하기 팝오버 창 표시
    // 클릭된 요소의 ID를 관리
    const [activePopOver, setActivePopOver] = useState(null);
    const popOverRef = useRef(null); // 현재 열린 popOver의 ref

    // 팝오버 토글 함수
    const popOver = (id) => {
        setActivePopOver(activePopOver === id ? null : id);
    };

    // 외부 클릭 감지하여 팝오버 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popOverRef.current && !popOverRef.current.contains(event.target)) {
                setActivePopOver(null);
            }
        };
        if (activePopOver !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activePopOver]);
    // ✅ 차단, 신고 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 차단 or 신고 구분
    const [userId, setUserId] = useState(null); // 차단 or 신고 구분

    // ✅ 모달 열고 닫기 함수
    const toggleModal = (type, id) => {
        setModalType(type);  // 클릭한 버튼의 타입 저장
        setIsModalOpen(true);
        setActivePopOver(null)
        setUserId(id)
    };
    // ✅ 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    // ✅ 차단 or 신고 표시
    const benOrBlock = (visitor) => {
        if (visitor.report === true && visitor.block === true) {
            return (<><span className="ml-2 text-white">신고 유저</span><span className="ml-2 text-white">차단 유저</span></>)
        } else if (visitor.block === true) {
            return (<span className="ml-2 text-white">차단 유저</span>)
        } else if (visitor.report === true) {
            return (<span className="ml-2 text-white">신고 유저</span>)
        }
    }

    return (
        <div className="flex flex-col gap-8 flex-auto min-w-fit border-2 border-gray-300 rounded-2xl p-8">
            <p className="font-bold text-3xl">매칭 히스토리</p>
            {/* 식당 별 매칭 히스토리 박스*/}
            <ul className="flex flex-col flex-1 gap-4 overflow-y-scroll scrollbar-hide">
                {/* 방문한 식당이 있으면 방문 한 식당 히스토리 표시*/}
                {restaurantReviews.length > 0 ? (
                    // 같이 방문한 사람들 리스트 표시
                    restaurantReviews.map((visitRest) => (
                        <li
                            key={visitRest.id}
                            className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                            <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                                <div className="flex flex-shrink-0 items-end">
                                    <span className="text-xl">{visitRest.place_name}</span>
                                    <span className="text-sm text-gray-400 pl-2">{visitRest.category_name}</span>
                                </div>
                                <span className="flex flex-shrink-0">
                                    {visitRest.myReview === true ? (
                                        <Link>리뷰 확인하기</Link>
                                    ) : (
                                        <Link>리뷰 작성하기</Link>
                                    )}</span>
                            </div>
                            <ul className="flex flex-wrap gap-1">
                                {visitRest.visitors.map((visitor) => (
                                    <li key={visitor.id}
                                        className={`relative flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg ${visitor.report || visitor.block ? 'bg-black/30' : ''}`}
                                    >
                                        <p>
                                            닉네임{benOrBlock(visitor)}
                                        </p>
                                        <p
                                            className=" font-bold tracking-[-0.15rem] [writing-mode:vertical-rl] cursor-pointer"
                                            onClick={() => popOver(visitor.id)}
                                        >
                                            ···</p>
                                        {activePopOver === visitor.id && (
                                            <div
                                                ref={popOverRef} // ✅ popOverRef 설정
                                                className="absolute flex flex-col gap-1 z-50 top-10 right-1 bg-white p-2 border border-gray-300 rounded-lg">
                                                <button onClick={() => toggleModal("block", visitor.id)}
                                                        className="py-1 px-2 rounded-lg hover:bg-gray-200">차단하기
                                                </button>
                                                <button onClick={() => toggleModal("report", visitor.id)}
                                                        className="py-1 px-2 rounded-lg hover:bg-gray-200">신고하기
                                                </button>
                                                <div
                                                    className="absolute -top-1.5 right-3 rotate-45  w-2.5 h-2.5 bg-white border-l border-t border-gray-300"></div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    /* 방문한 식당이 없을 때 보일 화면 */
                    <div className="text-2xl text-gray-500">방문한 식당이 없습니다.</div>
                )}
            </ul>
            {/* 모달이 열려 있을 때만 표시 */}
            {isModalOpen && <TwoBtnModal type={modalType} userId={userId} onClose={closeModal} />}
        </div>
    )
}
