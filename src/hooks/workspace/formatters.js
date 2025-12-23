export const formatCurrency = (value) => {
  if (!value && value !== 0) return "₹0.00";
  return `₹${parseFloat(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

export const formatNumber = (value) => {
  if (!value && value !== 0) return "0";
  return parseFloat(value).toLocaleString("en-IN");
};

export const formatPercent = (value) => {
  if (!value && value !== 0) return "0.0%";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return `${numValue.toFixed(1)}%`;
};
