import Link from "next/link";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
      <path d="M13.173 10.544c-.02-2.117 1.728-3.138 1.807-3.188-0.984-1.44-2.516-1.637-3.062-1.657-1.304-.133-2.553.775-3.213.775-.66 0-1.677-.757-2.761-.736-1.415.021-2.722.826-3.449 2.098C.88 10.21 1.89 14.337 3.418 16.556c.757 1.088 1.657 2.308 2.836 2.265 1.14-.046 1.573-.733 2.952-.733 1.38 0 1.77.733 2.972.712 1.226-.019 1.999-1.106 2.75-2.198.868-1.257 1.222-2.476 1.243-2.538-.027-.012-2.381-.913-2.998-3.52Z" />
      <path d="M10.937 4.275C11.553 3.528 11.97 2.497 11.852 1.45c-.893.037-1.969.595-2.607 1.342-.574.664-1.073 1.726-.938 2.742.996.077 2.012-.505 2.63-1.259Z" />
    </svg>
  );
}

export function OAuthButtons({ size = "md" }: { size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-13" : "h-11";
  const text = size === "lg" ? "text-[15px]" : "text-[14px]";

  return (
    <div className="flex flex-col gap-3 w-full">
      <Link
        href="/join?provider=google"
        className={`inline-flex w-full items-center justify-center gap-3 rounded-full border ${h} ${text} font-medium transition-opacity hover:opacity-80`}
        style={{ borderColor: "var(--line-strong)", color: "var(--ink)", background: "var(--bg-elevated)" }}
      >
        <GoogleMark />
        Continue with Google
      </Link>
      <Link
        href="/join?provider=apple"
        className={`inline-flex w-full items-center justify-center gap-3 rounded-full ${h} ${text} font-medium transition-opacity hover:opacity-80`}
        style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
      >
        <AppleMark />
        Continue with Apple
      </Link>
    </div>
  );
}
