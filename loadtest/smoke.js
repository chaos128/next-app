// k6 부하 테스트: 가상 사용자(VU)를 50명까지 늘렸다가 줄인다
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // 30초 동안 0 → 50명
    { duration: "2m", target: 50 },  // 2분 동안 50명 유지
    { duration: "30s", target: 0 },  // 30초 동안 50 → 0명
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],   // 에러율 1% 미만이어야 통과
    http_req_duration: ["p(95)<500"], // 95% 요청이 500ms 안에 끝나야 통과
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export default function smokeTest() {
  const res = http.get(`${BASE_URL}/`);
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(0.1);
}
