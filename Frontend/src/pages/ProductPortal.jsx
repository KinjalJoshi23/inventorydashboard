import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";
import ViewProduct from "@/components/ViewProduct";
import DeleteProduct from "@/components/DeleteProduct";
import Toast from "@/components/Toast";
import LowStockAlert from "@/components/LowStockAlert";
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/services/productsApi";

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const PAGE_SIZE = 10;

const ProductPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(() => Boolean(location.state?.openAddModal));
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = products.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const allOnPageSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAllOnPage = () => {
    const pageIds = paginatedProducts.map((p) => p.id);
    setSelectedIds((prev) =>
      allOnPageSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const showToast = (message, type = "success") => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (location.state?.openAddModal) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddProduct = async (formData) => {
    try {
      const newProduct = await createProduct(formData);
      setProducts((prev) => [newProduct, ...prev]);
      showToast("Product added successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const updated = await updateProduct(formData.id, formData);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast("Product updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteProduct(id)));
      const count = selectedIds.length;
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      showToast(`${count} product${count > 1 ? "s" : ""} deleted successfully`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus) return;
    try {
      const targets = products.filter((p) => selectedIds.includes(p.id));
      const updated = await Promise.all(
        targets.map((p) => updateProduct(p.id, { ...p, status: bulkStatus }))
      );
      setProducts((prev) => prev.map((p) => updated.find((u) => u.id === p.id) || p));
      showToast(`${updated.length} product${updated.length > 1 ? "s" : ""} updated successfully`);
      setSelectedIds([]);
      setBulkStatus("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Navbar />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Product Portal</h1>

          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-fuchsia-200 transition hover:brightness-110"
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
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Add Product
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
            {error}
          </div>
        )}

        <LowStockAlert products={products} />

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            All Products <span className="text-slate-400">({products.length})</span>
          </h2>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 ring-1 ring-inset ring-indigo-100">
            <span className="text-sm font-medium text-indigo-700">
              {selectedIds.length} selected
            </span>

            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Change status to...</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <button
              type="button"
              onClick={handleBulkStatusUpdate}
              disabled={!bulkStatus}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="ml-auto rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Delete Selected
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        )}

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="table-scroll">
          <table className="w-full min-w-190 text-center text-medium">
            <thead className="bg-indigo-600">
              <tr>
                <th className="w-10 px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAllOnPage}
                    aria-label="Select all products on this page"
                    className="h-4 w-4 cursor-pointer rounded"
                  />
                </th>
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
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">
                    No products yet. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelectOne(product.id)}
                        aria-label={`Select ${product.name}`}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                      />
                    </td>
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
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewProduct(product)}
                          title="View"
                          aria-label="View product"
                          className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-100"
                        >
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
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          title="Edit"
                          aria-label="Edit product"
                          className="rounded-lg bg-amber-50 p-2.5 text-amber-600 transition hover:bg-amber-100"
                        >
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
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingProduct(product)}
                          title="Delete"
                          aria-label="Delete product"
                          className="rounded-lg bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                        >
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
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>

          {!isLoading && products.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, products.length)} of {products.length} products
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

      <AddProduct
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      <EditProduct
        key={editingProduct?.id}
        isOpen={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateProduct}
      />

      <ViewProduct
        isOpen={Boolean(viewingProduct)}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

      <DeleteProduct
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && handleDeleteProduct(deletingProduct.id)}
      />

      <DeleteProduct
        isOpen={isBulkDeleteOpen}
        count={selectedIds.length}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default ProductPortal;
