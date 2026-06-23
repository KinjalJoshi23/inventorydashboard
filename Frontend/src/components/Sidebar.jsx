import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        className="fixed top-4 left-4 z-70 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-60 bg-slate-900/30"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-65 flex h-screen w-64 flex-col bg-white text-slate-700 shadow-xl ring-1 ring-slate-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 pl-16 mb-5">
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Inventory<span className="text-fuchsia-500">Insights</span>
          </span>
        </div>

        <nav className="flex-1 space-y-5 px-3">
          <Link
            to="/productPortal"
            className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-400 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:brightness-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Product Portal
          </Link>

          <Link
            to="/allProducts"
            className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            All Products
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
