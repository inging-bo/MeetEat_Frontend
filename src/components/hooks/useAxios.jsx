import axios from "axios";

export async function callApi(url, method, body) {
  // props: api url 엔드포인트, 요청 method, 요청 body

  const headers = {
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const options = {
    headers: headers,
    method: method,
    url: import.meta.env.VITE_BE_API_URL + url,
  };

  if (body) {
    options.data = body;
  }

  return axios(options);
}

export default callApi;
