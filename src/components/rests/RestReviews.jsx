import {useState} from "react";
import {Link} from "react-router-dom";
import TwoBtnModal from "../common/TwoBtnModal.jsx";

export default function RestReviews() {

    // 확인용 방문 히스토리
    const visitRestList = [
        {
            id: 1,
            place_name: "김밥천국",
            category_name: "한식",
            myReview: false,
            visitors: [
                {id: "user1", nickname: "철수"},
                {id: "user2", nickname: "영희"},
                {id: "user3", nickname: "민수"},
            ],
        },
        {
            id: 2,
            place_name: "스타벅스",
            category_name: "카페",
            myReview: true,
            visitors: [
                {id: "user4", nickname: "지훈"},
                {id: "user5", nickname: "수진"},
            ],
        },
    ];

    // 신고하기 차단하기 팝오버 창 표시
    // 클릭된 요소의 ID를 관리
    const [activePopOver, setActivePopOver] = useState(null);

    const popOver = (id) => {
        setActivePopOver(activePopOver === id ? null : id);  // Toggle visibility on click
    };

    // 차단, 신고 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 차단 or 신고 구분

    // 모달 열고 닫기 함수
    const toggleModal = (type) => {
        setModalType(type);  // 클릭한 버튼의 타입 저장
        setIsModalOpen(true);
        setActivePopOver(null)
    };
    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    return (
        <div className="flex flex-col gap-8 flex-auto min-w-fit border-2 border-gray-300 rounded-2xl p-8">
            <p className="font-bold text-3xl">매칭 히스토리</p>
            {/* 식당 별 매칭 히스토리 박스*/}
            <ul className="flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
                {/* 방문한 식당이 있으면 방문 한 식당 히스토리 표시*/}
                {visitRestList.length > 0 ? (
                    // 같이 방문한 사람들 리스트 표시
                    visitRestList.map((visitRest) => (

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
                                        className="relative flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                                        <p>
                                            닉네임
                                        </p>
                                        <p
                                            className=" font-bold tracking-[-0.15rem] [writing-mode:vertical-rl] cursor-pointer"
                                            onClick={() => popOver(visitor.id)}
                                        >
                                            ···</p>
                                        {activePopOver === visitor.id && (
                                            <div
                                                className="absolute flex flex-col gap-1 z-10 top-10 right-1 bg-white p-2 border border-gray-300 rounded-lg">
                                                <button onClick={() => toggleModal("block")}
                                                        className="py-1 px-2 rounded-lg hover:bg-gray-200">차단하기
                                                </button>
                                                <button onClick={() => toggleModal("report")}
                                                        className="py-1 px-2 rounded-lg hover:bg-gray-200">신고하기
                                                </button>
                                                <div
                                                    className="absolute -top-1.5 right-3 rotate-45  w-2.5 h-2.5 bg-white border-l border-t border-gray-300"></div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                                {/*<div*/}
                                {/*    className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">*/}
                                {/*    <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>*/}
                                {/*    <p className="font-bold tracking-[-0.15rem] [writing-mode:vertical-rl] cursor-pointer">···</p>*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">*/}
                                {/*    <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>*/}
                                {/*    <p className="font-bold tracking-[-0.15rem] [writing-mode:vertical-rl] cursor-pointer">···</p>*/}
                                {/*</div>*/}
                            </ul>
                        </li>
                    ))
                ) : (
                    /* 방문한 식당이 없을 때 보일 화면 */
                    <div className="text-2xl text-gray-500">방문한 식당이 없습니다.</div>
                )}
            </ul>
            {/* 모달이 열려 있을 때만 표시 */}
            {isModalOpen && <TwoBtnModal type={modalType} onClose={closeModal}/>}
        </div>
    )
}
