export const getStatusColor = (status) => {
  const statusColors = {
    Open: "bg-gray-100 text-gray-800",
    "Partially Invoiced": "bg-yellow-100 text-yellow-800",
    "Fully Invoiced": "bg-green-100 text-green-800",
    "Over Invoiced": "bg-red-100 text-red-800",
    "No GRN Yet": "bg-gray-100 text-gray-800",
    "Partially Received": "bg-yellow-100 text-yellow-800",
    "Fully Received": "bg-green-100 text-green-800",
    "Over Received": "bg-red-100 text-red-800",
    "Has Rejections": "bg-orange-100 text-orange-800",
    "No PO": "bg-gray-100 text-gray-800",
    "PO Linked": "bg-green-100 text-green-800",
    "Missing GRN": "bg-red-100 text-red-800",
    "GRN Under": "bg-yellow-100 text-yellow-800",
    "GRN Matched": "bg-green-100 text-green-800",
    "GRN Over": "bg-red-100 text-red-800",
    "Missing Invoice": "bg-red-100 text-red-800",
    "Under vs Invoice": "bg-yellow-100 text-yellow-800",
    "Matched vs Invoice": "bg-green-100 text-green-800",
    "Over vs Invoice": "bg-red-100 text-red-800",
    "Fully Accepted": "bg-green-100 text-green-800",
    "Partially Accepted": "bg-orange-100 text-orange-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const getSummaryCardColor = (label) => {
  const colorMap = {
    "Total POs": "default",
    Open: "blue",
    "Partially Invoiced": "yellow",
    "Fully Invoiced": "green",
    "Over Invoiced": "red",
    "No GRN Yet": "purple",
    "Partially Received": "yellow",
    "Fully Received": "green",
    "Over Received": "red",
    "Has Rejections": "orange",
  };

  return colorMap[label] || "default";
};
