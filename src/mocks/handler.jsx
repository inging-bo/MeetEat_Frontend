import { delay, HttpResponse, http } from "msw";
import postMatching from "./matching/postMatching.json";
import completeMatching from "./matching/completeMatching.json";
import completedMatching from "./matching/completedMatching.json";
import agreeUser2 from "./matching/agreeUser2.json";
import agreeUser3 from "./matching/agreeUser3.json";
import agreeUser4 from "./matching/agreeUser4.json";

const matching = new Map();

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
];
