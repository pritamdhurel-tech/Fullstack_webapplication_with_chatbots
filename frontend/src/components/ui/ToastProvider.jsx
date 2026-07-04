import { useEffect, useState } from "react";

export default function ToastProvider() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      setToast(event.detail);
      window.setTimeout(() => setToast(null), 2500);
    };

    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, []);

  if (!toast) return null;

  const toneClasses = {
    success: "bg-emerald-600/90 border-emerald-400/40 text-emerald-50",
    error: "bg-rose-600/90 border-rose-400/40 text-rose-50",
    info: "bg-slate-700/90 border-slate-400/40 text-slate-50",
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div
        className={`rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${toneClasses[toast.type] ?? toneClasses.info}`}
      >
        {toast.message}
      </div>
    </div>
  );
}
