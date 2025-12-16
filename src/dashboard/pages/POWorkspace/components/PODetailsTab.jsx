import PropTypes from "prop-types";

const PODetailsTab = ({ data }) => {
  const fields = [
    { label: "PO Number", key: "poNumber" },
    { label: "PO Date", key: "poDate" },
    { label: "Buyer Name", key: "buyerName" },
    { label: "Seller Name", key: "sellerName" },
    { label: "Delivery Date", key: "deliveryDate" },
    { label: "Site", key: "site" },
    { label: "Total Qty", key: "totalQty" },
    { label: "Total Basic Value", key: "totalBasicValue" },
    { label: "Total IGST", key: "totalIGST" },
    { label: "Total Order Value", key: "totalOrderValue" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PO Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            <p className="text-base text-gray-900">{data[field.key] || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

PODetailsTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PODetailsTab;
