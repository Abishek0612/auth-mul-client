import PropTypes from "prop-types";

const PODetailsTab = ({ data, summary }) => {
  const formatDate = (dateString) => {
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

  const formatCurrency = (value) => {
    if (!value) return "₹0.00";
    return `₹${parseFloat(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            Invoices:{" "}
            <span className="font-semibold text-gray-900">
              {summary?.linkedInvoicesCount || 0} linked
            </span>
          </div>
          <div className="text-sm text-gray-600">
            GRNs:{" "}
            <span className="font-semibold text-gray-900">
              {summary?.linkedGRNsCount || 0} linked
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">PO Details</h3>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">PO Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(data.poDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(data.deliveryDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Site</p>
            <p className="text-sm font-medium text-gray-900">
              {data.site || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">City</p>
            <p className="text-sm font-medium text-gray-900">
              {data.city || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Buyer</p>
            <p className="text-sm font-medium text-gray-900">
              {data.buyerName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Seller</p>
            <p className="text-sm font-medium text-gray-900">
              {data.sellerName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">File Name</p>
            <p className="text-sm font-medium text-gray-900">
              {data.fileName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Qty</p>
            <p className="text-sm font-medium text-gray-900">
              {data.totalQty || 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Basic Value</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(data.basicValue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">GST Value</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(data.gstValue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Total Value</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(data.totalOrderValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Summary
          </h3>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoiced Value</p>
              <p className="text-xl font-semibold text-blue-600">
                {formatCurrency(summary?.totalInvoiceValue)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">% Value Invoiced</p>
              <p className="text-xl font-semibold text-blue-600">
                {summary?.valueInvoicedPercent || "0.0%"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Invoiced Qty</p>
              <p className="text-xl font-semibold text-green-600">
                {summary?.totalInvoiceQty || 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">% Qty Invoiced</p>
              <p className="text-xl font-semibold text-green-600">
                {summary?.qtyInvoicedPercent || "0.0%"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            GRN Summary
          </h3>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">GRN Accepted Qty</p>
              <p className="text-xl font-semibold text-purple-600">
                {summary?.totalGRNQty || 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">% Qty GRN Accepted</p>
              <p className="text-xl font-semibold text-purple-600">
                {summary?.qtyGRNAcceptedPercent || "0.0%"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PODetailsTab.propTypes = {
  data: PropTypes.shape({
    poDate: PropTypes.string,
    deliveryDate: PropTypes.string,
    site: PropTypes.string,
    city: PropTypes.string,
    buyerName: PropTypes.string,
    sellerName: PropTypes.string,
    fileName: PropTypes.string,
    totalQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    basicValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gstValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalOrderValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  summary: PropTypes.shape({
    totalInvoiceValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    totalInvoiceQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalGRNQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueInvoicedPercent: PropTypes.string,
    qtyInvoicedPercent: PropTypes.string,
    qtyGRNAcceptedPercent: PropTypes.string,
    linkedInvoicesCount: PropTypes.number,
    linkedGRNsCount: PropTypes.number,
  }),
};

export default PODetailsTab;
