import { delay, HttpResponse, http } from "msw";
import postMatching from "./matching/postMatching.json";
import completeMatching from "./matching/completeMatching.json";
import completedMatching from "./matching/completedMatching.json";
import agreeUser2 from "./matching/agreeUser2.json";
import agreeUser3 from "./matching/agreeUser3.json";
import agreeUser4 from "./matching/agreeUser4.json";
import userList from "./login/userList.json";
import signUpSuccess from "./login/signUpSuccess.json";
import signInSuccess from "./login/signInSuccess.json";
import restReviewList from "./rests/restReviewList.json";

const matching = new Map();
const userListDB = [...userList];
const reviewList = [...restReviewList];

export const handlers = [
  // 처음에 구글, cdn등의 경고가 뜨는걸 막기위해 해당 응답들에대한 지연추가
  http.all("*", async () => {
    await delay(100);
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

  // 매칭 요청
  http.post("/matching/request", async ({ request }) => {
    const newPost = await request.json();
    matching.set(newPost.id, newPost);

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
      { status: 200 }
    );
  }),

  // 매칭 3분 이내 취소
  http.post("/matching/cancel/illegal", async () => {
    return HttpResponse.json(
      {
        message: "Matching canceled",
      },
      { status: 200 }
    );
  }),

  // 회원가입 요청
  http.post("/users/signup", async ({ request }) => {
    try {
      const { email, password, subPassword, nickname } = await request.json();
      console.log("입력된 이메일:", email);

      // 유효성 검사
      if (!email || !password || !subPassword || !nickname) {
        return HttpResponse.json(
          { message: "이메일, 패스워드 , 닉네임을 입력해주세요." },
          { status: 400 }
        );
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return HttpResponse.json(
          { message: "이메일 형식으로 작성해주세요." },
          { status: 400 }
        );
      }

      // 이메일 중복 검사
      const emailExists = userListDB.some((user) => user.email === email);
      if (emailExists) {
        return HttpResponse.json(
          { message: "이미 사용 중인 닉네임입니다." },
          { status: 400 }
        );
      }

      // 비밀번호 일치 검사
      const passwordExists = password === subPassword;
      if (!passwordExists) {
        return HttpResponse.json(
          { message: "비밀번호가 서로 다릅니다." },
          { status: 400 }
        );
      }

      // 닉네임 중복 검사
      const nicknameExists = userListDB.some(
        (user) => user.nickname === nickname
      );
      if (nicknameExists) {
        return HttpResponse.json(
          { message: "이미 사용 중인 이메일입니다." },
          { status: 400 }
        );
      }

      // 새 유저 추가
      const newUser = { email, password, nickname };
      userListDB.push(newUser);

      console.log("현재 유저 리스트:", userListDB);

      // 성공 응답
      return HttpResponse.json(
        {
          ...signUpSuccess,
          data: { email, nickname }, // 요청값 반영
        },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        { status: 500 }
      );
    }
  }),

  // 로그인 요청
  http.post("/users/signin", async ({ request }) => {
    try {
      const { email, password } = await request.json();
      console.log("입력된 이메일:", email);

      // 유효성 검사
      if (!email || !password) {
        return HttpResponse.json(
          { message: "이메일, 비밀번호를 입력하세요." },
          { status: 400 }
        );
      }

      // 이메일과 비밀번호가 일치하는 유저 찾기
      const userEmail = userListDB.find((user) => user.email === email);
      const userPassword = userListDB.find(
        (user) => user.password === password
      );
      if (!userEmail) {
        return HttpResponse.json(
          { message: "이메일을 확인해주세요." },
          { status: 404 }
        );
      }
      if (!userPassword) {
        return HttpResponse.json(
          { message: "비밀번호가 틀렸습니다." },
          { status: 401 }
        );
      }

      // 로그인 성공 처리 (성공적인 경우에 토큰을 반환)
      const accessToken = "accessToken"; // 예시로 accessToken을 생성하는 함수

      // 성공 응답
      return HttpResponse.json(
        {
          ...signInSuccess,
          accessToken: accessToken, // 요청값 반영
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("로그인 오류:", error);
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }
  }),

  // ✅ OAuth 로그인 처리 (카카오, 네이버)
  http.post("/users/signin/:provider", async ({ request, params }) => {
    try {
      const { provider } = params; // provider = "kakao" 또는 "naver"
      const { code } = await request.json();

      console.log(`${provider} 로그인 요청 코드:`, code);

      // 인가 코드가 없을 경우 에러 반환
      if (!code) {
        return HttpResponse.json(
          { error: "invalid_grant", message: "인가 코드가 없습니다." },
          { status: 400 }
        );
      }

      // 인가 코드에 따른 임시 액세스 토큰 발급
      const accessToken = `accessToken_${provider}`;

      // 성공 응답
      return HttpResponse.json(
        {
          ...signInSuccess,
          accessToken: accessToken, // 요청값 반영
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("OAuth 로그인 처리 중 오류 발생:", error);
      return HttpResponse.json(
        { message: "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }
  }),

  // 로그아웃 요청
  http.post("/users/signout", async ({ request }) => {
    try {
      const { isToken } = await request.json();
      console.log("로그아웃 요청 - 전달된 토큰:", isToken);

      // 클라이언트가 요청한 토큰을 검사하는 로직이 필요할 경우 여기에 추가 가능

      // 성공 응답 (accessToken 삭제)
      return HttpResponse.json(
        { message: "로그아웃 성공" }, // 불필요한 데이터 제거
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        { status: 500 }
      );
    }
  }),

  http.post("/restaurants/review", async ({ request }) => {
    try {
      const { matchingHistoryId, restaurantId, starRate, description, imgs } =
        await request.json();
      if (!matchingHistoryId || !restaurantId || !starRate || !description) {
        return HttpResponse.json(
          { message: "입력 형식이 유효하지 않습니다." },
          { status: 400 }
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
        { status: 200 }
      );
    } catch (e) {
      return HttpResponse.json(
        { message: "서버에 오류발생 어쩌구" },
        { status: 500 }
      );
    }
  }),
];
