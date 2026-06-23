const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />
  </svg>
);

const summarize = (items, max = 3) => {
  const names = items.slice(0, max).map((p) => p.name).join(", ");
  const extra = items.length - max;
  return extra > 0 ? `${names} +${extra} more` : names;
};

const LowStockAlert = ({ products }) => {
  const outOfStock = products.filter((p) => p.status === "Out of Stock");
  const lowStock = products.filter((p) => p.status === "Low Stock");

  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {outOfStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 ring-1 ring-inset ring-rose-200">
          <span className="text-rose-600">
            <AlertTriangleIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-rose-700">
              {outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} out of stock
            </p>
            <p className="mt-0.5 text-sm text-rose-600">{summarize(outOfStock)}</p>
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-inset ring-amber-200">
          <span className="text-amber-600">
            <AlertTriangleIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low on stock
            </p>
            <p className="mt-0.5 text-sm text-amber-600">{summarize(lowStock)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
