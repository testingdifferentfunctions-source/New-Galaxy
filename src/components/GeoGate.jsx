import React, { useEffect, useState } from "react";

// Regions blocked by policy.
const BLOCKED_COUNTRIES = ["RU", "BY"];

/**
 * Client-side geo gate.
 *
 * NOTE: This is a best-effort, client-side check. It cannot return a real
 * HTTP 403 status code, it does not protect backend/API endpoints, and a
 * determined user can bypass it (disable JS, hit the API directly). True
 * geo-blocking must be enforced at the CDN/edge layer (e.g. Cloudflare
 * geo-blocking rules, Vercel edge middleware, or a WAF), which Base44 does
 * not currently expose from app code.
 *
 * On lookup failure the gate fails OPEN (allows access) so that a transient
 * GeoIP outage does not lock out legitimate users.
 */
export default function GeoGate({ children }) {
  const [status, setStatus] = useState("checking"); // checking | blocked | allowed

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!res.ok) throw new Error("geo lookup failed");
        const data = await res.json();
        const country = (data.country_code || "").toUpperCase();
        if (cancelled) return;
        setStatus(BLOCKED_COUNTRIES.includes(country) ? "blocked" : "allowed");
      } catch {
        if (!cancelled) setStatus("allowed"); // fail-open
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#121212]">
        <div className="w-8 h-8 border-4 border-[#333333] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-[#E0E0E0] px-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">403</h1>
        <p className="text-[#A0A0A0] max-w-md mb-1">
          Access from your region is restricted.
        </p>
        <p className="text-[#A0A0A0] max-w-md">
          Доступ з вашого регіону обмежено.
        </p>
      </div>
    );
  }

  return children;
}
