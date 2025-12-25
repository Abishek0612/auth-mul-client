import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import workspaceService from "../../../../api/workspaceService";

const GRNModal = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [grnDetails, setGRNDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGRNDetails = async () => {
      try {
        setIsLoading(true);
        const response = await workspaceService.getGRNDetails(document.id);
        if (response.success) {
          setGRNDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch GRN details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (document?.id) {
      fetchGRNDetails();
    }
  }, [document]);

  const grnData = grnDetails?.grn || {};
  const linkedInvoice = grnDetails?.linkedInvoice;
  const linkedPO = grnDetails?.linkedPO;
  const totals = grnDetails?.totals || {};
  const reconciliation = grnDetails?.reconciliation || {};
  const lineItems = grnDetails?.lineItems || [];

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

  const GRNDetailsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">GRN Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(grnData.grnDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">File Name</p>
          <p className="text-sm font-medium text-gray-900">
            {grnData.fileName || "-"}
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
          <p className="text-xs text-gray-500 mb-1">Buyer</p>
          <p className="text-sm font-medium text-gray-900">
            {grnData.buyerName || document.buyer || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Seller</p>
          <p className="text-sm font-medium text-gray-900">
            {grnData.sellerName || document.seller || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">PO No</p>
          <p className="text-sm font-medium text-gray-900">
            {grnData.poNumber || document.poNumber || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Invoice No</p>
          <p className="text-sm font-medium text-gray-900">
            {grnData.vendorInvoiceNo || document.invoiceNumber || "-"}
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
              GRN {document?.grnNumber || "N/A"}
            </h2>
            {reconciliation.invoiceStatus && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {reconciliation.invoiceStatus}
              </span>
            )}
            {document.acceptanceStatus && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {document.acceptanceStatus}
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
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "details"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            GRN Details
          </button>
          <button
            onClick={() => setActiveTab("lines")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "lines"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            GRN Lines
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <GRNDetailsSection />

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      GRN Totals
                    </h3>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Received Qty
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {totals.receivedQty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Accepted Qty
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {totals.acceptedQty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Rejected Qty
                        </p>
                        <p className="text-lg font-semibold text-red-600">
                          {totals.rejectedQty || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Invoice Reconciliation
                    </h3>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Invoice Qty
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          {reconciliation.invoiceQty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Variance (Accepted - Invoice)
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          {reconciliation.variance || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Invoice Status
                        </p>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {reconciliation.invoiceStatus || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "lines" && (
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
                          EAN
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Challan Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Received Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Accepted Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Rejected
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
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.eanNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.challanQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.receivedQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.acceptedQty}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.rejectedQty}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

GRNModal.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GRNModal;
