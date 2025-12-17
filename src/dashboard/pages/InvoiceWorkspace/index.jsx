import { useState, useEffect, useCallback } from "react";
import workspaceService from "../../../api/workspaceService";
import InvoiceTable from "./components/InvoiceTable";
import WorkspaceDocumentModal from "../../components/WorkspaceDocumentModal";
import InvoiceDetailsTab from "./components/InvoiceDetailsTab";
import InvoiceLinesTab from "./components/InvoiceLinesTab";
import Toast from "../../../components/Toast";

const InvoiceWorkspace = () => {
  const [documents, setDocuments] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    buyers: ["All Buyers"],
    sellers: ["All Sellers"],
  });
  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    buyer: "All Buyers",
    seller: "All Sellers",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [toast, setToast] = useState(null);

  const tabs = [
    { id: "details", label: "Invoice Details" },
    { id: "lines", label: "Invoice Lines" },
    { id: "po", label: "Linked PO" },
    { id: "grn", label: "Linked GRN" },
  ];

  const fetchWorkspaceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await workspaceService.getInvoiceWorkspace({
        fromDate: filters.dateRange.from,
        toDate: filters.dateRange.to,
        buyer: filters.buyer !== "All Buyers" ? filters.buyer : undefined,
        seller: filters.seller !== "All Sellers" ? filters.seller : undefined,
        search: filters.search,
      });

      if (response.success) {
        setDocuments(response.data.invoices);
        setAvailableFilters(response.data.filters);
      }
    } catch (error) {
      setToast({
        message: "Failed to load invoices",
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

  const handleRowClick = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Workspace</h2>
        <p className="text-sm text-gray-600 mt-1">
          All invoices with reconciliation status
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Invoice Number, Buyer, Seller, or Order No..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={filters.buyer}
            onChange={(e) => handleFilterChange({ buyer: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.buyers.map((buyer) => (
              <option key={buyer} value={buyer}>
                {buyer}
              </option>
            ))}
          </select>
          <select
            value={filters.seller}
            onChange={(e) => handleFilterChange({ seller: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.sellers.map((seller) => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading invoices...</span>
        </div>
      ) : (
        <InvoiceTable documents={documents} onRowClick={handleRowClick} />
      )}

      <WorkspaceDocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        document={selectedDocument}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {selectedDocument && (
          <>
            {activeTab === "details" && (
              <InvoiceDetailsTab data={selectedDocument} />
            )}
            {activeTab === "lines" && <InvoiceLinesTab items={[]} />}
            {activeTab === "po" && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">
                  Linked purchase order will be displayed here
                </p>
              </div>
            )}
            {activeTab === "grn" && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">
                  Linked GRN will be displayed here
                </p>
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

export default InvoiceWorkspace;
