"use client";
import { useRouter } from "next/navigation";

export function useProGate(isPro: boolean) {
  const router = useRouter();
  return function requirePro(action: () => void) {
    if (isPro) {
      action();
    } else {
      router.push("/pricing?upgrade=1");
    }
  };
}
