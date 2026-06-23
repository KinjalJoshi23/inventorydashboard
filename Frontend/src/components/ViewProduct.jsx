const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";
const valueClass = "text-sm text-slate-900";

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-slate-800">{children}</h3>
);

const DetailField = ({ label, value, className = "" }) => (
  <div className={className}>
    <span className={labelClass}>{label}</span>
    <p className={valueClass}>{value || "—"}</p>
  </div>
);

const ViewProduct = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

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
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Product Details</h2>
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

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <SectionTitle>Basic information</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Product Name" value={product.name} className="col-span-2" />
              <DetailField label="Category" value={product.category} />
              <DetailField label="SKU" value={product.sku} />
            </div>

            <hr className="border-slate-100" />

            <SectionTitle>Pricing &amp; stock</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              <DetailField label="Quantity" value={`${product.quantity} ${product.unit}`} />
              <DetailField label="Price" value={`₹${product.price}`} />
              <DetailField
                label="Status"
                value={
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {product.status}
                  </span>
                }
              />
            </div>

            <hr className="border-slate-100" />

            <SectionTitle>Additional details</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Supplier" value={product.supplier} className="col-span-2" />
              <DetailField label="Description" value={product.description} className="col-span-2" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
