"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function GoogleCallbackPage() {
  // const params = useSearchParams();
  // const setAuth = useAuthStore((s) => s.setAuth);

  // useEffect(() => {
  //   const state = params.get("state");
  //   const code = params.get("code");
  //   const error = params.get("error");
  //   if (!state) return;
  //   authApi.googleAuth(state, code, error).then((res) => {
  //     setAuth(res.token, res.profile);
  //     window.location.href = "/dashboard";
  //   });
  // }, [params, setAuth]);

  return <p>Connecting your Google account...</p>;
}
