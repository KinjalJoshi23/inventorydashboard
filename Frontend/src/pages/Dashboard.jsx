import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getProducts } from "@/services/productsApi";
import { exportProductsToCsv } from "@/utils/csv";

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const quickActions = [
  {
    label: "Manage Products",
    to: "/productPortal",
    accent: "bg-indigo-50 text-indigo-600",
    icon: <path d="M20 7h-9m9 5H9m9 5H9M5 7h.01M5 12h.01M5 17h.01" />,
  },
  {
    label: "Add Product",
    to: "/productPortal",
    state: { openAddModal: true },
    accent: "bg-fuchsia-50 text-fuchsia-600",
    icon: <path d="M12 5v14M5 12h14" />,
  },
  {
    label: "View Reports",
    to: "/reports",
    accent: "bg-orange-50 text-orange-600",
    icon: <path d="M3 3v18h18M7 13l3 3 7-7" />,
  },
];

const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const totalProducts = products.length;
  const stockValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const stats = [
    {
      label: "Total Products",
      value: String(totalProducts),
      from: "from-indigo-500",
      to: "to-indigo-700",
      icon: (
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      ),
    },
    {
      label: "Stock Value",
      value: `₹${stockValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      from: "from-emerald-500",
      to: "to-emerald-700",
      icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    },
    {
      label: "Low Stock Items",
      value: String(lowStockCount),
      from: "from-amber-500",
      to: "to-amber-700",
      icon: (
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />
      ),
    },
    {
      label: "Out of Stock Items",
      value: String(outOfStockCount),
      from: "from-rose-500",
      to: "to-rose-700",
      icon: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />,
    },
    {
      label: "Categories",
      value: String(categoriesCount),
      from: "from-fuchsia-500",
      to: "to-fuchsia-700",
      icon: <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7.5L9 4H5a2 2 0 0 0-2 2Z" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-5 py-6 sm:px-8 sm:py-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Inventory Dashboard</h1>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl bg-linear-to-br ${stat.from} ${stat.to} p-5 text-white shadow-lg`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Icon>{stat.icon}</Icon>
              </span>
              <p className="mt-4 text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Recent Products</h2>
              <Link
                to="/productPortal"
                className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                View all
              </Link>
            </div>

            <div className="table-scroll">
            <table className="w-full min-w-125 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Product
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                      No products yet.
                    </td>
                  </tr>
                ) : (
                  products.slice(0, 5).map((product) => (
                    <tr key={product.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                            {product.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">₹{product.price}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                            statusStyles[product.status] || "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
            

            <div className="mt-5 space-y-5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  state={action.state}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.accent}`}>
                    <Icon className="h-4 w-4">{action.icon}</Icon>
                  </span>
                  {action.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => exportProductsToCsv(products)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon className="h-4 w-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M12 15V3" />
                  </Icon>
                </span>
                Download Product Excel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
