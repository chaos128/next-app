import os from "node:os";
import { connection } from "next/server";

export default async function Home() {
  // 요청마다 서버에서 새로 렌더링 (동적 페이지)
  await connection();

  const podName = os.hostname();
  const appVersion = process.env.APP_VERSION ?? "local";
  const appEnv = process.env.APP_ENV ?? "local";
  const renderedAt = new Date().toISOString();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-10 font-mono">
      <h1 className="text-2xl font-bold">Hello, Infra 👋</h1>
      <p>환경: <b>{appEnv}</b></p>
      <p>앱 버전: <b>{appVersion}</b></p>
      <p>이 페이지를 그린 서버(Pod): <b>{podName}</b></p>
      <p>렌더링 시각: {renderedAt}</p>
      <p className="text-sm text-gray-500">
        새로고침할 때마다 Pod 이름이 바뀌면 로드밸런싱이 되고 있는 것.
      </p>
    </main>
  );
}
