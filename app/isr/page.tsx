import os from "node:os";

// ISR: 60초 동안은 만들어 둔 HTML 을 재사용하고, 그 뒤 첫 요청에서 다시 만든다
export const revalidate = 60;

export default function IsrPage() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-10 font-mono">
      <h1 className="text-2xl font-bold">ISR 페이지</h1>
      <p>생성한 서버(Pod): <b>{os.hostname()}</b></p>
      <p>생성 시각: {new Date().toISOString()}</p>
    </main>
  );
}
