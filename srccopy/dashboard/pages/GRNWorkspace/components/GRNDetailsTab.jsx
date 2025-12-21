import PropTypes from "prop-types";

const GRNDetailsTab = ({ data }) => {
  const fields = [
    { label: "GRN Number", key: "grnNumber" },
    { label: "GRN Date", key: "grnDate" },
    { label: "Buyer Name", key: "buyerName" },
    { label: "Seller Name", key: "sellerName" },
    { label: "Vendor Invoice No", key: "vendorInvoiceNo" },
    { label: "PO Number", key: "poNumber" },
    { label: "GRN Qty", key: "grnQty" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">GRN Details</h3>
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

GRNDetailsTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default GRNDetailsTab;
