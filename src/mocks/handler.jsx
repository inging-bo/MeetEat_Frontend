import { HttpResponse, http } from "msw";
import dummy from "./dummy.json";
import axios from "axios";
import postMatching from "./matching/postMatching.json";

const matching = new Map();

export const handlers = [
  http.get("/matching/complete", () => {
    return HttpResponse.json(dummy);
  }),

  http.post("/matching/request", async ({ request }) => {
    const newPost = await request.json();
    matching.set(newPost.id, newPost);

    new ReadableStream({
      start() {
        setTimeout(() => {
          console.log("7초 지남");
          axios
            .get("/matching/complete")
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }, [7000]);
      },
    });

    return HttpResponse.json(postMatching, { status: 200 });
  }),

  http.post("/matching/cancel", async ({ request }) => {
    return HttpResponse.json(request, { status: 200 });
  }),
];
