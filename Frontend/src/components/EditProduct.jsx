import { useState } from "react";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100";

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-slate-800">{children}</h3>
);

const EditProduct = ({ isOpen, onClose, onSave, product }) => {
  const [form, setForm] = useState(product);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Edit Product</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-indigo-100 transition hover:bg-white/10 hover:text-white"
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
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[65vh] overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <SectionTitle>Basic information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="e.g. Wireless Mouse"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option>Electronics</option>
                  <option>Groceries</option>
                  <option>Clothing</option>
                  <option>Furniture</option>
                  <option>Stationery</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>SKU</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. WM-1023"
                  className={inputClass}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <SectionTitle>Pricing &amp; stock</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Quantity</label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}>
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="box">box</option>
                  <option value="ltr">ltr</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Price</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <SectionTitle>Additional details</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Supplier</label>
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Acme Supplies"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Optional notes about the product"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
