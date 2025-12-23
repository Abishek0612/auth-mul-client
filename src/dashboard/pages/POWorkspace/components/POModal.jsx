import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import workspaceService from "../../../../api/workspaceService";

const POModal = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [poDetails, setPoDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        setIsLoading(true);
        const response = await workspaceService.getPODetails(document.id);
        if (response.success) {
          setPoDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch PO details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (document?.id) {
      fetchPODetails();
    }
  }, [document]);

  const poData = poDetails?.po || {};
  const summary = poDetails?.summary || {};
  const linkedInvoices = poDetails?.linkedInvoices || [];
  const linkedGRNs = poDetails?.linkedGRNs || [];

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

  const PODetailsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">PO Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(poData.poDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(poData.deliveryDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Site</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.site || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">City</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.city || document.city || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Seller</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.sellerName || document.seller || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">File Name</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.fileName || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Qty</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.totalQty || document.poQty || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Buyer</p>
          <p className="text-sm font-medium text-gray-900">
            {poData.buyerName || document.buyer || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Basic Value</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(poData.totalBasicValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">GST Value</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(poData.totalIGST)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Value</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(poData.totalOrderValue || document.poValue)}
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
              PO {document?.poNumber || "N/A"}
            </h2>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
              {document?.invoiceStatus}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {document?.grnStatus?.[0]}
            </span>
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
            PO Line Items
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "invoices"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Linked Invoices ({linkedInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab("grns")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "grns"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Linked GRNs ({linkedGRNs.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <PODetailsSection />

              {activeTab === "summary" && (
                <div className="space-y-6">
                  <div className="text-sm text-gray-600 mb-6">
                    Invoices:{" "}
                    <span className="font-semibold text-gray-900">
                      {linkedInvoices.length} linked
                    </span>
                    <span className="ml-8">
                      GRNs:{" "}
                      <span className="font-semibold text-gray-900">
                        {linkedGRNs.length} linked
                      </span>
                    </span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Invoice Summary
                    </h3>
                    <div className="grid grid-cols-4 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Invoiced Value
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatCurrency(summary.totalInvoiceValue || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          % Value Invoiced
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {summary.valueInvoicedPercent || "0.0%"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Invoiced Qty
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {summary.totalInvoiceQty || document.invoicedQty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          % Qty Invoiced
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {summary.qtyInvoicedPercent ||
                            document.qtyInvoicedPercent ||
                            "0.0%"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      GRN Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          GRN Accepted Qty
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          {summary.totalGRNQty || document.grnQty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          % Qty GRN Accepted
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          {summary.qtyGRNAcceptedPercent || "0.0%"}
                        </p>
                      </div>
                    </div>
                  </div>
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
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          EAN
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          PO Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Base Cost
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          GST%
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Total Base Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {poData.items && poData.items.length > 0 ? (
                        poData.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.articleNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.hsn}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.eanNo || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(item.baseCost)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.igstPercent ||
                                (item.cgstPercent && item.sgstPercent
                                  ? `${
                                      parseFloat(item.cgstPercent) +
                                      parseFloat(item.sgstPercent)
                                    }%`
                                  : "-")}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(item.totalBaseValue)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
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

              {activeTab === "invoices" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Invoice No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Invoice Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Invoice Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Gross
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          GST
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          GRN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {linkedInvoices.length > 0 ? (
                        linkedInvoices.map((invoice, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(invoice.invoiceDate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {invoice.invoiceQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(invoice.grossAmount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(invoice.gstAmount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(invoice.totalAmount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {invoice.grnNumber || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Has GRN
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No linked invoices
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "grns" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          GRN No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          GRN Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Invoice No
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
                          GRN Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {linkedGRNs.length > 0 ? (
                        linkedGRNs.map((grn, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {grn.grnNumber}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(grn.grnDate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {grn.vendorInvoiceNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {grn.receivedQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {grn.acceptedQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {grn.rejectedQty}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  grn.rejectedQty > 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {grn.rejectedQty > 0
                                  ? "Partially Accepted"
                                  : "Fully Accepted"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No linked GRNs
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

POModal.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default POModal;
