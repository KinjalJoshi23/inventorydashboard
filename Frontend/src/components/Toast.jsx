import { useEffect } from "react";

const toastStyles = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
};

const ToastItem = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
        toastStyles[type] || "bg-slate-800"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
      >
        {type === "error" ? (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </>
        ) : (
          <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </>
        )}
      </svg>
      {message}
    </div>
  );
};

const Toast = ({ toasts, onDismiss }) => (
  <div className="fixed top-4 right-4 z-90 flex flex-col gap-2">
    {toasts.map((toast) => (
      <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
    ))}
  </div>
);

export default Toast;
