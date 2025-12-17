import PropTypes from "prop-types";

const PODetailsTab = ({ data, summary }) => {
  const fields = [
    { label: "PO Date", key: "poDate" },
    { label: "Delivery Date", key: "deliveryDate" },
    { label: "Site", key: "site" },
    { label: "City", key: "city" },
    { label: "Buyer", key: "buyerName" },
    { label: "Seller", key: "sellerName" },
    { label: "File Name", key: "fileName" },
  ];

  const summaryFields = [
    { label: "Quantity", key: "totalQty" },
    { label: "Basic Value", key: "totalBasicValue", isCurrency: true },
    { label: "GST", key: "totalIGST", isCurrency: true },
    { label: "Total Value", key: "totalOrderValue", isCurrency: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">PO Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {field.label}
              </label>
              <p className="text-base text-gray-900">
                {data[field.key] || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">PO Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {summaryFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {field.label}
              </label>
              <p className="text-xl font-bold text-gray-900">
                {field.isCurrency && data[field.key]
                  ? `₹${parseFloat(data[field.key]).toFixed(2)}`
                  : data[field.key] || "0"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Invoice Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Invoiced Value
            </label>
            <p className="text-xl font-bold text-blue-600">
              ₹{summary.invoicedValue || "0.00"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              % Value Invoiced
            </label>
            <p className="text-xl font-bold text-blue-600">
              {(
                (parseFloat(summary.invoicedValue || 0) /
                  parseFloat(data.totalOrderValue || 1)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Invoiced Qty
            </label>
            <p className="text-xl font-bold text-green-600">
              {summary.invoicedQty || 0}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              % Qty Invoiced
            </label>
            <p className="text-xl font-bold text-green-600">
              {summary.qtyInvoicedPercent || "0.0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          GRN Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              GRN Accepted Qty
            </label>
            <p className="text-xl font-bold text-purple-600">
              {summary.grnQty || 0}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              % Qty GRN Accepted
            </label>
            <p className="text-xl font-bold text-purple-600">
              {(
                (parseFloat(summary.grnQty || 0) /
                  parseFloat(data.totalQty || 1)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PODetailsTab.propTypes = {
  data: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired,
};

export default PODetailsTab;
