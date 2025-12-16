import PropTypes from "prop-types";

const InvoiceDetailsTab = ({ data }) => {
  const fields = [
    { label: "Invoice Number", key: "invoiceNumber" },
    { label: "Buyer Order No", key: "buyerOrderNo" },
    { label: "Invoice Date", key: "invoiceDate" },
    { label: "Buyer Name", key: "buyerName" },
    { label: "Seller Name", key: "sellerName" },
    { label: "Invoice Qty", key: "invoiceQty" },
    { label: "Gross Amount", key: "grossAmount", isCurrency: true },
    { label: "GST Amount", key: "gstAmount", isCurrency: true },
    { label: "Total Amount", key: "totalAmount", isCurrency: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Invoice Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            <p className="text-base text-gray-900">
              {field.isCurrency && data[field.key]
                ? `₹${parseFloat(data[field.key]).toFixed(2)}`
                : data[field.key] || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

InvoiceDetailsTab.propTypes = {
  data: PropTypes.object.isRequired,
};

export default InvoiceDetailsTab;
