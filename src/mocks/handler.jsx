import { delay, HttpResponse, http } from "msw";
import postMatching from "./matching/postMatching.json";
import completeMatching from "./matching/completeMatching.json";
import completedMatching from "./matching/completedMatching.json";
import agreeUser2 from "./matching/agreeUser2.json";
import agreeUser3 from "./matching/agreeUser3.json";
import agreeUser4 from "./matching/agreeUser4.json";
import userList from "./login/userList.json";
import profile from "./mypage/profile.json";
import myMatchingHistory from "./mypage/historyApi.json";
import myMatchingHistory2 from "./mypage/historyApi2.json";
import myReviewHistory from "./mypage/myReview.json";
import restReviewList from "./rests/restReviewList.json";
import restList from "./rests/restList.json";
import restList2 from "./rests/restList2.json";
import restList3 from "./rests/restList3.json";
import restReview1_1 from "./rests/restReview1_1.json";
import restReview1_2 from "./rests/restReview1_2.json";
import restDetailViewList from "./rests/restDetailView.json";

const matching = new Map();
const userListDB = [...userList];
const reviewList = [...restReviewList];
let profileData = { ...profile }; // profile을 객체로 유지
let matchingHistory = { ...myMatchingHistory };
export const handlers = [
  // 처음에 구글, cdn등의 경고가 뜨는걸 막기위해 해당 응답들에대한 지연추가
  http.all("*", async () => {
    await delay(100);
  }),

  // 가야하는 매칭
  http.get("/matching", () => {
    return HttpResponse.json(null, { status: 200 });
  }),

  // 매칭 성사
  http.get("/matching/complete", () => {
    return HttpResponse.json(completeMatching);
  }),

  // 장소 동의
  http.get("/matching/nickname2", () => {
    return HttpResponse.json(agreeUser2, { status: 200 });
  }),
  http.get("/matching/nickname3", () => {
    return HttpResponse.json(agreeUser3, { status: 200 });
  }),
  http.get("/matching/nickname4", () => {
    return HttpResponse.json(agreeUser4, { status: 200 });
  }),

  // 장소 선택
  http.get("/matching/completed", () => {
    return HttpResponse.json(completedMatching, { status: 200 });
  }),

  // SSE 구독
  http.get("/sse/subscribe", () => {
    const customEventJoin2 = new CustomEvent("Join", {
      datail: {
        message: "수락 알림이 도착했습니다.",
        user: {
          id: "2",
          nickname: "맛집사냥꾼",
          join: true,
        },
      },
    });
    const customEventJoin3 = new CustomEvent("Join", {
      datail: {
        message: "수락 알림이 도착했습니다.",
        user: {
          id: "3",
          nickname: "석류먹고싶다",
          join: true,
        },
      },
    });
    const customEventTeam = new CustomEvent("Team", {
      datail: {
        message: "모임이 생성되었습니다",
        matching: {
          restaurant: {
            id: "5",
            name: "에버그릭",
            lat: "126.937320",
            lon: "37.484824",
            road_address_name: "서울 관악구 은천로 178 1층",
            category_name: "그릭요거트",
            rating: "4",
          },
          userList: [
            {
              id: "1",
              nickname: "테스트계정",
              introduce: "반갑습니다. 테스트 중입니다.",
              join: true,
            },
            {
              id: "2",
              nickname: "맛집사냥꾼",
              introduce: "맛집 컬렉터 XD",
              join: true,
            },
            {
              id: "3",
              nickname: "석류먹고싶다",
              introduce:
                "미녀는 석류를 좋아해~ 자꾸자꾸 예뻐지면 나는 어떡해~ 미녀는~ 미녀는 석류를 좋아해~",
              join: true,
            },
          ],
          createdAt: new Date().toISOString(),
          id: 45,
        },
      },
    });
    if (window.location.href.includes("/matching/check-place")) {
      setTimeout(window.dispatchEvent(customEventJoin2), 3000);
      setTimeout(window.dispatchEvent(customEventJoin3), 8000);
      setTimeout(window.dispatchEvent(customEventTeam), 8000);
    }
    return new HttpResponse(
      {
        message: "SSE Subscribed",
      },
      {
        headers: {
          "Content-Type": "text/event-stream",
        },
      },
    );
  }),

  // 매칭 요청
  http.post("/matching/request", async ({ request }) => {
    const newPost = await request.json();
    matching.set(newPost.id, newPost);
    const customEventTempTeam = new CustomEvent("TempTeam", {
      datail: {
        teamId: "1",
        message: "임시 모임이 생성되었습니다.",
        restaurantList: [
          {
            user: {
              id: "1",
              nickname: "테스트계정",
            },
            place: {
              id: newPost.place.id,
              name: newPost.place.name,
              category_name: newPost.place.category_name,
              road_address_name: newPost.place.road_address_name,
              phone: newPost.place.phone,
              lon: newPost.place.lon,
              lat: newPost.place.lat,
            },
          },
          {
            user: {
              id: "2",
              nickname: "맛집사냥꾼",
            },
            place: {
              id: "5",
              name: "에버그릭",
              category_name: "그릭요거트",
              road_address_name: "서울 관악구 은천로 178 1층",
              phone: "02-738-5688",
              lon: "37.484824",
              lat: "126.937320",
            },
          },
          {
            user: {
              id: "3",
              nickname: "석류먹고싶다",
            },
            place: {
              id: "8",
              name: "미자네",
              category_name: "곱창",
              road_address_name:
                "서울 관악구 신림로 59길 14 원조민속 순대타운 3층 31 7호, 318호",
              phone: "02-738-5688",
              lon: "37.485107",
              lat: "126.928925",
            },
          },
        ],
      },
    });
    setTimeout(window.dispatchEvent(customEventTempTeam), 5000);

    return HttpResponse.json(postMatching, { status: 200 });
  }),

  // 매칭 수락
  http.post("/matching?response=accept", async () => {
    return HttpResponse.json({ status: 200 });
  }),

  // 매칭 거절
  http.post("/matching?response=reject", async () => {
    return HttpResponse.json({ status: 200 });
  }),

  // 매칭 취소
  http.post("/matching/cancel", async ({ request }) => {
    return HttpResponse.json(request, { status: 200 });
  }),

  // 매칭 3분 이내 취소
  http.post("/matching/cancel/legal", async () => {
    return HttpResponse.json(
      {
        message: "Matching canceled",
      },
      { status: 200 },
    );
  }),

  // 매칭 3분 이내 취소
  http.post("/matching/cancel/illegal", async () => {
    return HttpResponse.json(
      {
        message: "Matching canceled",
      },
      { status: 200 },
    );
  }),

  // 매칭완료후 이탈자 발생
  http.get("/atching/canceled", () => {
    return HttpResponse.json(
      {
        message: "모임이 취소되었습니다",
      },
      { status: 200 },
    );
  }),

  // 회원가입 요청
  http.post("/users/signup", async ({ request }) => {
    const { email, password, nickname } = await request.json();

    // 에러코드 500 확인용
    if (email === "500" || password === "500" || nickname === "500") {
      return HttpResponse.json(
        "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        { status: 500, statusText: "INTERNAL_SERVER_ERROR" },
      );
    }

    // 이메일 중복 검사
    const emailExists = userListDB.some((user) => user.email === email);
    if (emailExists) {
      return HttpResponse.json("이미 사용 중인 이메일입니다.", {
        status: 400,
        statusText: "EMAIL_ALREADY_REGISTERED",
      });
    }

    // 비밀번호 유효성 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
    if (!passwordRegex.test(password)) {
      return HttpResponse.json(
        "비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.",
        { status: 400, statusText: "VALIDATION_FAILED" },
      );
    }

    // 닉네임 중복 검사
    const nicknameExists = userListDB.some(
      (user) => user.nickname === nickname,
    );
    if (nicknameExists) {
      return HttpResponse.json("이미 사용 중인 닉네임입니다.", {
        status: 400,
        statusText: "NICKNAME_ALREADY_REGISTERED",
      });
    }

    // 새 유저 추가
    const newUser = { email, password, nickname };
    userListDB.push(newUser);

    console.log("현재 유저 리스트:", userListDB);

    // 성공 응답
    return HttpResponse.json(
      {
        success: true,
        data: { email, nickname },
      },
      { status: 200 },
    );
  }),

  // 로그인 요청
  http.post("/users/signin", async ({ request }) => {
    const { email, password } = await request.json();

    // 특정 값이면 강제 서버 오류 발생
    if (email === "500" || password === "500") {
      return HttpResponse.json({
        message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        status: 500,
      });
    }
    // 특정 값이면 강제 서버 오류 발생
    if (email === "400" || password === "400") {
      return HttpResponse.json({ message: "잘못된 요청입니다.", status: 400 });
    }
    // 탈퇴예정인 유저가 로그인을 시도할 때
    if (email === "탈퇴예정" || password === "탈퇴예정") {
      return HttpResponse.json({
        message: "해당 계정은 탈퇴 예정 상태입니다.",
        status: 403,
      });
    }

    const user = userListDB.find((u) => u.email === email);

    // 사용자를 찾을 수 없는 경우
    if (!user) {
      return HttpResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 비밀번호가 맞지 않는 경우
    if (user.password !== password) {
      return HttpResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 401 },
      );
    }

    // 유효성 검사
    if (!email || !password) {
      return HttpResponse.json(
        { message: "이메일, 비밀번호를 입력하세요." },
        { status: 400 },
      );
    }

    // 성공 응답
    return HttpResponse.json(
      {
        accessToken: "ecdedfa14edc1dse4",
        needProfileUpdate: true,
      },
      { status: 200 },
    );
  }),

  // ✅ OAuth 로그인 처리 (카카오, 네이버)
  http.post("/users/signin/:provider", async ({ request, params }) => {
    const { provider } = params; // provider = "kakao" 또는 "naver"
    const { code } = await request.json();

    console.log(`${provider} 로그인 요청 코드:`, code);

    // 인가 코드가 없을 경우 에러 반환
    if (!code) {
      return HttpResponse.json(
        "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        { status: 500 },
      );
    }

    // 인가 코드에 따른 임시 액세스 토큰 발급
    const accessToken = `accessToken_${provider}`;
    // 성공 응답
    return HttpResponse.json(
      {
        accessToken: accessToken,
        needProfileUpdate: true, // 요청값 반영
      },
      { status: 200 },
    );
  }),

  // 로그아웃 요청
  http.post("/users/signout", async ({ request }) => {
    try {
      // Authorization 헤더에서 Bearer 토큰 추출
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return HttpResponse.json(
          { message: "토큰이 없거나 잘못된 형식입니다." },
          { status: 401 },
        );
      }

      const accessToken = authHeader.split(" ")[1]; // "Bearer TOKEN_VALUE" → TOKEN_VALUE
      console.log("로그아웃 요청 - 전달된 토큰:", accessToken);

      // 여기에서 토큰 유효성을 검증하는 로직을 추가할 수도 있음
      // 예: 만료된 토큰인지 확인, 블랙리스트에 추가 등

      return HttpResponse.json({ message: "로그아웃 성공" }, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),

  http.get("/users/profile", () => {
    return HttpResponse.json(profileData);
  }),
  // 프로필 업데이트 (닉네임 또는 소개 수정)
  http.patch("/users/profile/nickname", async ({ request }) => {
    const body = await request.json(); // 요청 바디 데이터 가져오기

    // 기존 profile 객체를 업데이트
    profileData = { ...profileData, ...body };

    console.log(profileData);

    return HttpResponse.json(profileData, { status: 200 });
  }),
  http.patch("/users/profile/introduce", async ({ request }) => {
    const body = await request.json(); // 요청 바디 데이터 가져오기

    // 기존 profile 객체를 업데이트
    profileData = { ...profileData, ...body };

    console.log(profileData);

    return HttpResponse.json(profileData, { status: 200 });
  }),
  // 비밀번호 변경하기
  http.post("/users/change-password", async ({ request }) => {
    try {
      const { currentPassword, newPassword } = await request.json();
      // Authorization 헤더에서 Bearer 토큰 추출
      const authHeader = request.headers.get("Authorization");
      const accessToken = authHeader.split(" ")[1]; // "Bearer TOKEN_VALUE" → TOKEN_VALUE

      console.log("변경하기 요청 - 전달된 토큰:", accessToken);

      if (!accessToken) {
        return HttpResponse.json({}, { status: 401 });
      }

      // 현재 비밀번호 검증
      if (currentPassword !== "1234") {
        // 임시 현재 비밀번호
        return HttpResponse.json({}, { status: 400 });
      }

      // 새 비밀번호 유효성 검증
      if (newPassword.length < 3) {
        return HttpResponse.json({}, { status: 402 });
      }

      // 비밀번호 변경 성공 응답
      return HttpResponse.json({}, { status: 200 });
    } catch (error) {
      // 오류 응답 반환
      return HttpResponse.json({}, { status: 500 });
    }
  }),

  // 회원 탈퇴
  http.delete("/users/withdrawal", async () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  // ✅ 차단 API 핸들러
  http.post("/ban", async ({ request }) => {
    try {
      const url = new URL(request.url);
      const bannedId = url.searchParams.get("bannedId"); // bannedId 가져오기

      if (!bannedId) {
        return HttpResponse.json(
          { message: "bannedId가 필요합니다." },
          { status: 400 },
        );
      }

      const content = matchingHistory.content;
      let isUpdated = false;

      content.forEach((item) => {
        const userList = item.matching.userList;
        const userToBan = userList.find((user) => user.id === Number(bannedId));
        if (userToBan && userToBan.ban === false) {
          userToBan.ban = true;
          isUpdated = true;
        }
      });

      if (isUpdated) {
        return HttpResponse.json(
          { message: "사용자가 성공적으로 차단되었습니다." },
          { status: 200 },
        );
      } else {
        return HttpResponse.json(
          { message: "차단할 사용자를 찾을 수 없거나 이미 차단되었습니다." },
          { status: 404 },
        );
      }
    } catch (error) {
      return HttpResponse.json(
        { message: "서버 오류가 발생했습니다." },
        { status: 500 },
      );
    }
  }),

  // ✅ 차단 API 핸들러 (DELETE 요청)
  http.delete("/ban", async ({ request }) => {
    try {
      const url = new URL(request.url);
      const bannedId = url.searchParams.get("bannedId"); // bannedId 가져오기

      if (!bannedId) {
        return HttpResponse.json(
          { message: "bannedId가 필요합니다." },
          { status: 400 },
        );
      }

      const content = matchingHistory.content;
      let isUpdated = false;

      content.forEach((item) => {
        const userList = item.matching.userList;
        const userToUnban = userList.find(
          (user) => user.id === Number(bannedId),
        );

        if (userToUnban && userToUnban.hasOwnProperty("ban")) {
          userToUnban.ban = false;
          isUpdated = true;
        }
      });

      if (!isUpdated) {
        return HttpResponse.json(
          { message: "잘못된 요청입니다." },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        { message: "차단 상태가 해제되었습니다.", data: matchingHistory },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),

  // ✅ 신고 API 핸들러
  http.post("/report", async ({ request }) => {
    try {
      const url = new URL(request.url);
      const reportedId = url.searchParams.get("reportedId"); // reportedId 가져오기

      if (!reportedId) {
        return HttpResponse.json(
          { message: "reportedId가 필요합니다." },
          { status: 400 },
        );
      }

      const content = matchingHistory.content;
      let isUpdated = false;

      content.forEach((item) => {
        const userList = item.matching.userList;
        const userToReported = userList.find(
          (user) => user.id === Number(reportedId),
        );

        if (userToReported) {
          if (userToReported.report === false) {
            userToReported.report = true;
            isUpdated = true;
          }
        }
      });

      if (!isUpdated) {
        return HttpResponse.json(
          { message: "해당 ID의 방문자를 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      return HttpResponse.json(
        { message: "신고 상태가 추가되었습니다.", data: matchingHistory },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),

  // ✅ 신고 API 핸들러 (DELETE 요청)
  http.delete("/report", async ({ request }) => {
    try {
      const url = new URL(request.url);
      const reportedId = url.searchParams.get("reportedId"); // reportedId 가져오기

      if (!reportedId) {
        return HttpResponse.json(
          { message: "reportedId가 필요합니다." },
          { status: 400 },
        );
      }

      const content = matchingHistory.content;
      let isUpdated = false;

      content.forEach((item) => {
        const userList = item.matching.userList;
        const userToUnReported = userList.find(
          (user) => user.id === Number(reportedId),
        );

        if (userToUnReported && userToUnReported.hasOwnProperty("report")) {
          userToUnReported.report = false;
          isUpdated = true;
        }
      });

      if (!isUpdated) {
        return HttpResponse.json(
          { message: "해당 ID의 방문자를 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      return HttpResponse.json(
        { message: "신고 상태가 해제되었습니다.", data: matchingHistory },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),

  // 나의 모임 기록 조회
  http.get("/matching/history", async ({ request }) => {
    const url = new URL(request.url);
    const pageId = url.searchParams.get("page");
    if (pageId === "0") {
      return HttpResponse.json(myMatchingHistory, { status: 200 });
    }
    if (pageId === "1") {
      return HttpResponse.json(myMatchingHistory2, { status: 200 });
    }
  }),

  // 나의 식당 후기 조회
  http.get(
    `/restaurants/myreview`,
    async ({ request }) => {
      // 쿼리 파라미터에서 matchingHistoryId 추출
      const url = new URL(request.url);
      const matchingHistoryId = url.searchParams.get("matchingHistoryId");

      console.log("Requested matchingHistoryId:", matchingHistoryId);

      // 항상 리뷰 데이터 반환
      return HttpResponse.json(myReviewHistory, { status: 200 });
    },
  ),

  // 식당 리뷰 조회
  http.post("/restaurants/review", async ({ request }) => {
    try {
      const { matchingHistoryId, restaurantId, starRate, description, imgs } =
        await request.json();
      if (!matchingHistoryId || !restaurantId || !starRate || !description) {
        return HttpResponse.json(
          { message: "입력 형식이 유효하지 않습니다." },
          { status: 400 },
        );
      }
      const newReview = {
        matchingHistoryId,
        restaurantId,
        starRate,
        description,
        imgs,
      };
      reviewList.push(newReview);
      console.log(reviewList);

      return HttpResponse.json(
        {
          message: "성공적으로 업로드 어쩌구",
        },
        { status: 200 },
      );
    } catch (e) {
      return HttpResponse.json(
        { message: "서버에 오류발생 어쩌구" },
        { status: 500 },
      );
    }
  }),

  // 식당 조회
  http.post("/restaurants/search", async ({ request }) => {
    try {
      const {
        region,
        categoryName,
        placeName,
        userY,
        userX,
        sorted,
        page,
        size,
      } = await request.json();
      if (
        !region ||
        !categoryName ||
        !userY ||
        !userX ||
        !sorted ||
        !page ||
        !size
      ) {
        return HttpResponse.json(
          { message: "입력 형식이 유효하지 않습니다." },
          { status: 400 },
        );
      }
      if (page === "0") {
        if (placeName === "") {
          return HttpResponse.json(restList, { status: 200 });
        } else {
          const temp = { ...restList };
          const tempContent = temp.content;
          const filtered = tempContent.filter((item) =>
            item.place_name.includes(placeName),
          );
          temp.content = filtered;
          return HttpResponse.json(temp, { status: 200 });
        }
      }
      if (page === "1") {
        if (placeName === "")
          return HttpResponse.json(restList2, { status: 200 });
        else {
          const contents = restList2.content;
          const filtered = contents.filter((item) =>
            item.place_name.includes(placeName),
          );
          return HttpResponse.json(restList2.replace("content", filtered), {
            status: 200,
          });
        }
      }
      if (page === "2") {
        if (placeName === "")
          return HttpResponse.json(restList3, { status: 200 });
        else {
          const contents = restList3.content;
          const filtered = contents.filter((item) =>
            item.place_name.includes(placeName),
          );
          return HttpResponse.json(restList3.replace("content", filtered), {
            status: 200,
          });
        }
      }
      return HttpResponse.json(
        { message: "잘못된 페이지 번호입니다." },
        { status: 500 },
      );
    } catch (e) {
      return HttpResponse.json(
        { message: "서버에 오류발생 어쩌구" },
        { status: 500 },
      );
    }
  }),

  // 식당 상세 조회
  http.get("/restaurants", ({ request }) => {
    try {
      const url = new URL(request.url);
      const productId = url.searchParams.get("restaurantId");
      // 성공 응답
      return HttpResponse.json(restDetailViewList[productId], { status: 200 });
    } catch (error) {
      console.error("OAuth 로그인 처리 중 오류 발생:", error);
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),
  // 식당 리뷰 조회
  http.get("/restaurants/1", async ({ request }) => {
    try {
      const url = new URL(request.url);
      const page = url.searchParams.get("page");
      const restId = url.searchParams.get("id");
      if (page === "0") {
        return HttpResponse.json(restReview1_1, { status: 200 });
      }
      if (page === "1") {
        return HttpResponse.json(restReview1_2, { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }),
];
