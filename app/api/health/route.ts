// Kubernetes 가 "이 컨테이너 살아 있나?" 를 물어보는 주소
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" });
}
