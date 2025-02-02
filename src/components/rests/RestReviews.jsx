export default function RestReviews() {
    return (
        <div className="flex flex-col gap-8 flex-auto min-w-fit border-2 border-gray-300 rounded-2xl p-8">
            <p className="font-bold text-3xl">매칭 히스토리</p>
            {/* 식당 별 매칭 히스토리 박스*/}
            <ul className="flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <li className="flex flex-col gap-2 border-2 border-gray-300 rounded-2xl p-4">
                    <div className="flex justify-between items-center border-b-2 border-b-gray-300 pb-2">
                        <div className="flex flex-shrink-0 items-end">
                            <span className="text-xl">식당 이름</span>
                            <span className="text-sm text-gray-400 pl-2">카테고리 카테고리</span>
                        </div>
                        <span className="flex flex-shrink-0">리뷰 작성하기 or 리뷰 확인하기</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between items-center w-[calc(50%-0.25rem)] p-2 rounded-lg">
                            <p>닉네임</p><p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['신고유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                        <div className="flex justify-between w-[calc(50%-0.25rem)] p-2 rounded-lg bg-gray-500">
                            <p className="relative after:absolute after:top-1/2 after:left-full after:content-['차단유저'] after:text-sm after:ml-4 after:text-white after:whitespace-nowrap after:transform after:-translate-y-1/2">닉네임</p>
                            <p className="font-bold tracking-widest pt-1 [writing-mode:vertical-rl]">···</p>
                        </div>
                    </div>
                </li>
                <div className="bg-amber-200 text-gray-500">방문한 식당이 없습니다.(다녀간 식당 없을 때 보일 화면)</div>
            </ul>
        </div>
    )
}
