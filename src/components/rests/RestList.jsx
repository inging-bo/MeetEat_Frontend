import SearchIcon from "../../assets/search.svg?react";
import {useState} from "react";
import Arrow from "../../assets/updown-arrow-icon.svg?react"
import FullStar from "../../assets/full-star.svg?react"
import Review from "../../assets/review.svg?react"
import RestView from "./RestView.jsx";

export default function RestList() {

    // ✅ 확인용 식당 리스트
    const [restaurants, setRestaurants] = useState([
        {
            id: 0,
            region: "서울",
            categoryName: "한식",
            imgUrl: "",
            placeName: "국밥",
            address: "서울 관악구 온천로 178 1층",
            rating: 4,
            reviews: 5,
            distance: 4
        }, {
            id: 1,
            region: "서울",
            categoryName: "한식",
            imgUrl: "",
            placeName: "국밥",
            address: "서울 관악구 온천로 178 1층",
            rating: 4,
            reviews: 5,
            distance: 4
        },
        {
            id: 2,
            region: "부산",
            categoryName: "한식",
            imgUrl: "",
            placeName: "돼지국밥",
            address: "서울 관악구 온천로 178 1층",
            rating: 3.5,
            reviews: 5,
            distance: 4
        },
        {
            id: 3,
            region: "인천",
            categoryName: "중식",
            imgUrl: "",
            placeName: "중국집",
            address: "서울 관악구 온천로 178 1층",
            rating: 5,
            reviews: 5,
            distance: 4
        },
        {
            id: 4,
            region: "서울",
            categoryName: "중식",
            imgUrl: "",
            placeName: "탕수육집",
            address: "서울 관악구 온천로 178 1층",
            rating: 3,
            reviews: 2,
            distance: 4
        },
        {
            id: 5,
            region: "서울",
            categoryName: "양식",
            imgUrl: "",
            placeName: "파스타랑",
            address: "서울 관악구 온천로 178 1층",
            rating: 4,
            reviews: 100,
            distance: 4
        },
    ]);

    const [searchFilter, setSearchFilter] = useState("");

    const openSearchFilter = (filter) => {
        setSearchFilter(searchFilter === "" ? filter : "")
    }

    const filterList = (type) => {
        switch (type) {
            case "category" :
                return (
                    <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
                        <li>한식</li>
                        <li>중식</li>
                        <li>일식</li>
                        <li>양식</li>
                    </ul>
                )
            case "region" :
                return (
                    <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
                        <li>서울</li>
                        <li>부산</li>
                        <li>대구</li>
                        <li>인천</li>
                        <li>광주</li>
                        <li>대전</li>
                        <li>울산</li>
                        <li>세종</li>
                        <li>경기</li>
                        <li>강원</li>
                        <li>충북</li>
                        <li>충남</li>
                        <li>전북</li>
                        <li>전남</li>
                        <li>경북</li>
                        <li>경남</li>
                        <li>제주</li>
                    </ul>
                )
            case "option" :
                return (
                    <ul className="absolute flex flex-col w-full gap-2 top-full px-2 py-1 z-10 bg-white border border-t-0 rounded-b-md">
                        <li>거리순</li>
                        <li>평점순</li>
                    </ul>
                )
        }
    }

    return (
        <div className="max-w-6xl flex flex-col mt-24 mb-auto items-center">
            <div className="w-96 mb-7 search-bar border border-[#3BB82D] rounded-full relative">
                <input
                    className="w-full h-10 rounded-full pl-5 pr-12 focus:outline-none"
                    id="keyword"
                    type="text"
                    placeholder="실제 방문한 식당을 검색해요."
                />
                <button
                    id="search-btn"
                    className="absolute px-5 right-0 top-[10px]"
                >
                    <SearchIcon width="22px"/>
                </button>
            </div>
            <div className="flex gap-2 mb-3 ml-auto">
                <ul onClick={() => openSearchFilter("category")}
                    className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "category" && "border-b-[transparent] rounded-b-none"}`}
                >
                    <li className="flex justify-center gap-2 items-center">한식<Arrow
                        className={`${searchFilter === "category" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}/>
                    </li>
                    {searchFilter === "category" && (
                        filterList("category")
                    )}
                </ul>
                <ul onClick={() => openSearchFilter("region")}
                    className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "region" && "border-b-[transparent] rounded-b-none"}`}
                >
                    <li className="flex justify-center gap-2 items-center">전체<Arrow
                        className={`${searchFilter === "region" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}/>
                    </li>
                    {searchFilter === "region" && (
                        filterList("region")
                    )}
                </ul>
                <ul onClick={() => openSearchFilter("option")}
                    className={`relative flex flex-col bg-white gap-2 justify-center items-center px-2 py-1 border border-gray-300 rounded-md 
                    ${searchFilter === "option" && "border-b-[transparent] rounded-b-none"}`}
                >
                    <li className="flex justify-center gap-2 items-center">평점순<Arrow
                        className={`${searchFilter === "option" ? "rotate-180 duration-300 ease-in-out" : "duration-300"} `}/>
                    </li>
                    {searchFilter === "option" && (
                        filterList("option")
                    )}
                </ul>

            </div>
            <ul className="grid grid-cols-[380px_380px_380px] grid-rows-2 gap-7">
                {restaurants.map((rest, index) => (
                    <li key={rest.id}
                        className="flex flex-col items-start bg-white rounded-lg drop-shadow-lg p-4"
                    >
                        <div className="bg-gray-300 h-40 w-full rounded-lg mb-3">
                            {rest.imgUrl ? rest.imgUrl : ""}
                        </div>
                        <p className="text-lg">{rest.placeName}</p>
                        <p className="mb-1.5 text-gray-600 ">{rest.address}</p>
                        <div className="flex h-6 gap-2 items-start text-base text-gray-500">
                            <div className="flex gap-1 h-6">
                                <span className="flex justify-center items-center ">
                                    <FullStar className="w-full h-full text-[#FF6445]"/></span>
                                <span>{rest.rating}</span>
                            </div>
                            <div className="flex gap-1 h-6">
                                <span className="flex justify-center items-center ">
                                    <Review className="mt-0.5" width="20px" height="20px"/></span>
                                <span>{rest.reviews}</span>
                            </div>
                        </div>
                    </li>
                ))}
                <li></li>
            </ul>
            <RestView/>
        </div>
    )
}
