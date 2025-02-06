import { HttpResponse, http } from "msw";
import postMatching from "./matching/postMatching.json";
import completeMatching from "./matching/completeMatching.json";

const matching = new Map();

export const handlers = [
  http.get("/matching/complete", () => {
    return HttpResponse.json(completeMatching);
  }),

  http.post("/matching/request", async ({ request }) => {
    const newPost = await request.json();
    matching.set(newPost.id, newPost);

    return HttpResponse.json(postMatching, { status: 200 });
  }),

  http.post("/matching/cancel", async ({ request }) => {
    return HttpResponse.json(request, { status: 200 });
  }),
];
