"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.replace("/signup");
  return (
    <div className="flex h-screen bg-gray-900">
    </div>
  );
}
