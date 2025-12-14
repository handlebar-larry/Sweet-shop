import React from "react";

/**
 * Lightweight background.
 * - variant="app"   : subtle mesh background for authenticated pages
 * - variant="auth"  : more vibrant backdrop for login/register
 */
export default function Backdrop({ variant = "app", children }) {
  const isAuth = variant === "auth";

  return (
    <div
      className={
        "min-h-screen relative overflow-hidden " +
        (isAuth
          ? "bg-gradient-to-br from-slate-50 via-white to-slate-50"
          : "bg-gradient-to-b from-slate-50 via-white to-slate-50")
      }
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30 " +
          (isAuth ? "bg-[radial-gradient(circle_at_center,var(--c1),transparent_60%)]" : "bg-[radial-gradient(circle_at_center,var(--c1),transparent_65%)]")
        }
      />
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-30 " +
          (isAuth ? "bg-[radial-gradient(circle_at_center,var(--c2),transparent_60%)]" : "bg-[radial-gradient(circle_at_center,var(--c2),transparent_65%)]")
        }
      />
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute left-1/2 top-[-10rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 " +
          (isAuth
            ? "bg-[radial-gradient(circle_at_center,var(--c2),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_center,var(--c1),transparent_55%)]")
        }
      />

      {/* subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      {/* content */}
      <div className="relative min-h-screen">{children}</div>
    </div>
  );
}