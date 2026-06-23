const escapeCsvField = (value) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const exportProductsToCsv = (products, filename = "products.csv") => {
  const headers = [
    "Name",
    "Category",
    "SKU",
    "Quantity",
    "Unit",
    "Price",
    "Status",
    "Supplier",
    "Description",
  ];

  const rows = products.map((p) => [
    p.name,
    p.category,
    p.sku,
    p.quantity,
    p.unit,
    p.price,
    p.status,
    p.supplier,
    p.description,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
