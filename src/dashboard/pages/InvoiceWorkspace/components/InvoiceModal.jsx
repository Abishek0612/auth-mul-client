import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import workspaceService from "../../../../api/workspaceService";

const InvoiceModal = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setIsLoading(true);
        const response = await workspaceService.getInvoiceDetails(document.id);
        if (response.success) {
          setInvoiceDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch invoice details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (document?.id) {
      fetchInvoiceDetails();
    }
  }, [document]);

  const invData = invoiceDetails?.invoice || {};
  const linkedPO = invoiceDetails?.linkedPO;
  const linkedGRN = invoiceDetails?.linkedGRN;
  const poSummary = invoiceDetails?.poSummary;
  const grnSummary = invoiceDetails?.grnSummary;
  const lineItems = invoiceDetails?.lineItems || [];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
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

  const InvoiceDetailsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Invoice Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(invData.invoiceDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Site</p>
          <p className="text-sm font-medium text-gray-900">
            {linkedPO?.site || document.site || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">City</p>
          <p className="text-sm font-medium text-gray-900">
            {linkedPO?.city || document.city || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">File Name</p>
          <p className="text-sm font-medium text-gray-900">
            {invData.fileName || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Buyer</p>
          <p className="text-sm font-medium text-gray-900">
            {invData.buyerName || document.buyer || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Seller</p>
          <p className="text-sm font-medium text-gray-900">
            {invData.sellerName || document.seller || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Invoice Qty</p>
          <p className="text-sm font-medium text-gray-900">
            {invData.invoiceQty || document.invoiceQty || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Gross Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(invData.grossAmount || document.grossAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">GST Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(invData.gstAmount || document.gstAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(invData.totalAmount || document.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[60%] max-w-5xl bg-white shadow-2xl transform transition-transform">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Invoice {document?.invoiceNumber || "N/A"}
            </h2>
            {document.poStatus && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {document.poStatus}
              </span>
            )}
            {document.grnStatus && document.grnStatus[0] && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {document.grnStatus[0]}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "summary"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Recon Summary
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "items"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Invoice Line Items
          </button>
          <button
            onClick={() => setActiveTab("po")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "po"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Linked PO ({linkedPO ? 1 : 0})
          </button>
          <button
            onClick={() => setActiveTab("grn")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "grn"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Linked GRN ({linkedGRN ? 1 : 0})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <InvoiceDetailsSection />

              {activeTab === "summary" && (
                <div className="space-y-6">
                  <div className="flex gap-4 mb-6">
                    {linkedPO && (
                      <span className="px-3 py-1 text-sm font-semibold rounded bg-green-100 text-green-800">
                        PO: 1 linked
                      </span>
                    )}
                    {linkedGRN && (
                      <span className="px-3 py-1 text-sm font-semibold rounded bg-green-100 text-green-800">
                        GRN: 1 linked
                      </span>
                    )}
                  </div>

                  {poSummary && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        PO Summary
                        {linkedPO && (
                          <span className="ml-4 text-sm font-normal text-gray-600">
                            Linked PO: {linkedPO.poNumber}
                          </span>
                        )}
                      </h3>
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">PO Value</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(poSummary.poValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            % Value Invoiced
                          </p>
                          <p className="text-lg font-semibold text-blue-600">
                            {poSummary.valueInvoicedPercent}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">PO Qty</p>
                          <p className="text-lg font-semibold text-green-600">
                            {poSummary.poQty}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            % Qty Invoiced
                          </p>
                          <p className="text-lg font-semibold text-green-600">
                            {poSummary.qtyInvoicedPercent}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {grnSummary && linkedGRN && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        GRN Summary
                        <span className="ml-4 text-sm font-normal text-gray-600">
                          GRN: {linkedGRN.grnNumber} •{" "}
                          {formatDate(linkedGRN.grnDate)}
                        </span>
                        <span className="ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Fully Accepted
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            GRN Accepted Qty
                          </p>
                          <p className="text-lg font-semibold text-purple-600">
                            {grnSummary.acceptedQty}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            % Qty GRN Accepted (vs PO)
                          </p>
                          <p className="text-lg font-semibold text-purple-600">
                            {grnSummary.qtyGRNAcceptedPercent}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "items" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Article No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          HSN
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Invoice Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          GST Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lineItems.length > 0 ? (
                        lineItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.articleNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.itemName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.hsn}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(item.rate)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(item.totalAmount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.gstRate}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No line items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "po" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  {linkedPO ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            PO No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            PO Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                            PO Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                            PO Value
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {linkedPO.poNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(linkedPO.poDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {linkedPO.poQty}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(linkedPO.poValue)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Fully Invoiced
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No linked PO
                    </p>
                  )}
                </div>
              )}

              {activeTab === "grn" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  {linkedGRN ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            GRN No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            GRN Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                            Received Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                            Accepted Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                            Rejected Qty
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {linkedGRN.grnNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(linkedGRN.grnDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {linkedGRN.receivedQty}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {linkedGRN.acceptedQty}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {linkedGRN.rejectedQty}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                linkedGRN.rejectedQty > 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {linkedGRN.rejectedQty > 0
                                ? "Partially Accepted"
                                : "Fully Accepted"}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No linked GRN
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

InvoiceModal.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InvoiceModal;
