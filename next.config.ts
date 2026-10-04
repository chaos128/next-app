import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 이미지에 꼭 필요한 파일만 .next/standalone 폴더로 추려 준다
  output: "standalone",
  // 롤링 배포 중 "옛 버전 화면 + 새 버전 서버" 가 섞이는 문제(version skew) 방지용 ID
  // CI 가 빌드할 때 git 커밋 SHA 를 넣어 준다 (없으면 로컬 빌드)
  deploymentId: process.env.NEXT_DEPLOYMENT_ID,
};

export default nextConfig;
