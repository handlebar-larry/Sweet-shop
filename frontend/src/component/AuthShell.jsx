import React from "react";
import { Link } from "react-router-dom";
import Backdrop from "./Backdrop";

function LogoMark() {
  return (
    <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,var(--c1),var(--c2))] shadow-sm flex items-center justify-center">
      <svg
        width="26"
        height="26"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M32 12c11.046 0 20 8.954 20 20s-8.954 20-20 20S12 43.046 12 32 20.954 12 32 12Z"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M22 32c0-5.523 4.477-10 10-10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M42 32c0 5.523-4.477 10-10 10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M32 22c5.523 0 10 4.477 10 10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M32 42c-5.523 0-10-4.477-10-10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export default function AuthShell({ title, subtitle, altText, altHref, children }) {
  return (
    <Backdrop variant="auth">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <div className="text-xl font-extrabold tracking-tight text-slate-900">
                  SweetShop
                </div>
                <div className="text-sm text-slate-600">Sweet shop management, simplified.</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold tracking-tight text-slate-900">{title}</div>
              {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
            </div>

            <div className="mt-6">{children}</div>

            <div className="mt-6 text-center text-sm text-slate-600">
              {altText}{" "}
              <Link
                to={altHref}
                className="font-semibold text-slate-900 hover:underline decoration-[var(--c1)] underline-offset-4"
              >
                {altHref === "/" ? "Register" : altHref === "/login" ? "Login" : "Continue"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}
