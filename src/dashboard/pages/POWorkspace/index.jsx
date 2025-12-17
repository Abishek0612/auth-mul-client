import { useState, useEffect, useCallback } from "react";
import workspaceService from "../../../api/workspaceService";
import POTable from "./components/POTable";
import WorkspaceDocumentModal from "../../components/WorkspaceDocumentModal";
import PODetailsTab from "./components/PODetailsTab";
import POLinesTab from "./components/POLinesTab";
import Toast from "../../../components/Toast";
import POSummaryStrip from "./components/POSummaryStrip";
import POFilters from "./components/POFilters";

const POWorkspace = () => {
  const [summary, setSummary] = useState({
    totalPOs: 0,
    open: 0,
    partiallyInvoiced: 0,
    fullyInvoiced: 0,
    overInvoiced: 0,
  });
  const [documents, setDocuments] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    sites: ["All Sites"],
    buyers: ["All Buyers"],
    sellers: ["All Sellers"],
    statuses: ["All Statuses"],
  });
  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    site: "All Sites",
    buyer: "All Buyers",
    seller: "All Sellers",
    status: "All Statuses",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recon");
  const [toast, setToast] = useState(null);

  const tabs = [
    { id: "recon", label: "Recon Summary" },
    { id: "lines", label: "PO Line Items" },
    { id: "invoices", label: "Linked Invoices (0)" },
    { id: "grns", label: "Linked GRNs (0)" },
  ];

  const fetchWorkspaceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await workspaceService.getPOWorkspace({
        fromDate: filters.dateRange.from,
        toDate: filters.dateRange.to,
        site: filters.site !== "All Sites" ? filters.site : undefined,
        buyer: filters.buyer !== "All Buyers" ? filters.buyer : undefined,
        seller: filters.seller !== "All Sellers" ? filters.seller : undefined,
        status: filters.status !== "All Statuses" ? filters.status : undefined,
        search: filters.search,
      });

      if (response.success) {
        setSummary(response.data.summary);
        setDocuments(response.data.pos);
        setAvailableFilters(response.data.filters);
      }
    } catch (error) {
      setToast({
        message: "Failed to load PO workspace data",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRowClick = async (document) => {
    try {
      const response = await workspaceService.getPODetails(document.id);
      if (response.success) {
        setSelectedDocument({
          ...document,
          details: response.data,
        });
        setIsModalOpen(true);
        setActiveTab("recon");
      }
    } catch (error) {
      setToast({
        message: "Failed to load PO details",
        type: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">PO Workspace</h2>
        <p className="text-sm text-gray-600 mt-1">
          All purchase orders with reconciliation status
        </p>
      </div>

      <POSummaryStrip summary={summary} />

      <POFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        availableFilters={availableFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : (
        <POTable documents={documents} onRowClick={handleRowClick} />
      )}

      <WorkspaceDocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        document={selectedDocument}
        tabs={tabs.map((tab) =>
          tab.id === "invoices"
            ? {
                ...tab,
                label: `Linked Invoices (${
                  selectedDocument?.details?.linkedInvoices?.length || 0
                })`,
              }
            : tab.id === "grns"
            ? {
                ...tab,
                label: `Linked GRNs (${
                  selectedDocument?.details?.linkedGRNs?.length || 0
                })`,
              }
            : tab
        )}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {selectedDocument && (
          <>
            {activeTab === "recon" && (
              <PODetailsTab
                data={selectedDocument.details?.po || {}}
                summary={selectedDocument.details?.summary || {}}
              />
            )}
            {activeTab === "lines" && (
              <POLinesTab items={selectedDocument.details?.po?.items || []} />
            )}
            {activeTab === "invoices" && (
              <div className="bg-white rounded-lg shadow p-6">
                {selectedDocument.details?.linkedInvoices?.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Invoice No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Gross
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          GST
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDocument.details.linkedInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="px-6 py-4 text-sm">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {inv.invoiceDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            {inv.invoiceQty}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            ₹{inv.grossAmount}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            ₹{inv.gstAmount}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            ₹{inv.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No linked invoices</p>
                )}
              </div>
            )}
            {activeTab === "grns" && (
              <div className="bg-white rounded-lg shadow p-6">
                {selectedDocument.details?.linkedGRNs?.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          GRN No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Invoice No
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDocument.details.linkedGRNs.map((grn) => (
                        <tr key={grn.id}>
                          <td className="px-6 py-4 text-sm">{grn.grnNumber}</td>
                          <td className="px-6 py-4 text-sm">{grn.grnDate}</td>
                          <td className="px-6 py-4 text-sm text-right">
                            {grn.grnQty}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {grn.vendorInvoiceNo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No linked GRNs</p>
                )}
              </div>
            )}
          </>
        )}
      </WorkspaceDocumentModal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default POWorkspace;
