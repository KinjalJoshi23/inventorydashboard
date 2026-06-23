import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getProducts } from "@/services/productsApi";

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const statusBarColors = {
  "In Stock": "bg-emerald-500",
  "Low Stock": "bg-amber-500",
  "Out of Stock": "bg-rose-500",
};

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const categoryRows = Object.values(
    products.reduce((acc, product) => {
      const key = product.category || "Uncategorized";
      if (!acc[key]) {
        acc[key] = { category: key, count: 0, quantity: 0, value: 0 };
      }
      acc[key].count += 1;
      acc[key].quantity += Number(product.quantity || 0);
      acc[key].value += Number(product.price || 0) * Number(product.quantity || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const statusCounts = ["In Stock", "Low Stock", "Out of Stock"].map((status) => ({
    status,
    count: products.filter((p) => p.status === status).length,
  }));

  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Category Breakdown</h2>
            </div>

            <div className="table-scroll">
            <table className="w-full min-w-125 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Products
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Quantity
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Stock Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                      Loading report...
                    </td>
                  </tr>
                ) : categoryRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                      No products yet.
                    </td>
                  </tr>
                ) : (
                  categoryRows.map((row) => (
                    <tr key={row.category} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{row.count}</td>
                      <td className="px-5 py-3.5 text-slate-600">{row.quantity}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        ₹{row.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold text-slate-800">Stock Status</h2>
            <p className="mt-1 text-sm text-slate-500">Share of products by status.</p>

            <div className="mt-5 space-y-4">
              {statusCounts.map(({ status, count }) => {
                const percent = totalProducts === 0 ? 0 : Math.round((count / totalProducts) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{count}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${statusBarColors[status]}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
