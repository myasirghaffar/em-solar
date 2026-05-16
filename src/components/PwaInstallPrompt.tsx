import { Download, Share, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePwaInstall } from "../hooks/usePwaInstall";

const HIDDEN_PREFIXES = ["/admin", "/salesman", "/login", "/signup"];

export function PwaInstallPrompt() {
  const { pathname } = useLocation();
  const { visible, iosHint, canInstall, installing, install, dismiss } =
    usePwaInstall();

  const hiddenRoute = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  if (!visible || hiddenRoute) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[99990] px-4 pb-4 pt-2 pointer-events-none"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-live="polite"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg gap-3 rounded-2xl border border-[#FF7A00]/30 bg-[#0B2A4A] p-4 text-white shadow-[0_16px_48px_rgba(11,42,74,0.35)]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF7A00]/15">
          <img
            src="/favicon.svg"
            alt=""
            className="h-7 w-7"
            width={28}
            height={28}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            id="pwa-install-title"
            className="text-sm font-bold leading-snug text-white"
          >
            Install EnergyMart.pk
          </p>
          {iosHint && !canInstall ? (
            <p className="mt-1 text-xs leading-relaxed text-gray-300">
              Tap{" "}
              <Share className="inline h-3.5 w-3.5 align-text-bottom text-[#FF7A00]" />{" "}
              Share, then <span className="font-semibold text-white">Add to Home Screen</span>{" "}
              to use the app on your phone.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-gray-300">
              Add to your home screen for quick access to solar products and
              orders.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {canInstall && (
              <button
                type="button"
                onClick={() => void install()}
                disabled={installing}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A00] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#e86e00] disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden />
                {installing ? "Installing…" : "Install app"}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full px-3 py-2 text-xs font-semibold text-gray-300 transition hover:text-white"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss install prompt"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
