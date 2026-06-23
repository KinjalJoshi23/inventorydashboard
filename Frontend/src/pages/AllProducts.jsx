import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getProducts } from "@/services/productsApi";

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const PAGE_SIZE = 10;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return [product.name, product.category, product.sku]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(term));
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Navbar />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All Products List</h1>
          
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            All Products <span className="text-slate-400">({filteredProducts.length})</span>
          </h2>

          <div className="relative w-full sm:max-w-sm sm:mb-3">
            <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-white"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full rounded-full border-2 border-violet-100 bg-violet-50/50 py-2.5 pl-11 pr-9 text-sm text-slate-900 shadow-sm transition placeholder:text-violet-400 focus:border-fuchsia-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-violet-100 text-violet-500 transition hover:bg-violet-200 hover:text-violet-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="table-scroll">
          <table className="w-full min-w-150 text-center text-medium">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Product
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Category
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  SKU
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Qty
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Price
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    {searchTerm ? "No products match your search." : "No products yet."}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                          {product.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{product.sku || "—"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.quantity} <span className="text-slate-400">{product.unit}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">₹{product.price}</td>
                    <td className="px-5 py-4">
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

          {!isLoading && filteredProducts.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-md text-sm font-medium transition ${
                      page === safePage
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
