import { useState, useEffect, useCallback } from "react";
import documentService from "../../../api/documentService";
import POTable from "./components/POTable";
import WorkspaceDocumentModal from "../../components/WorkspaceDocumentModal";
import PODetailsTab from "./components/PODetailsTab";
import POLinesTab from "./components/POLinesTab";
import Toast from "../../../components/Toast";

const POWorkspace = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const tabs = [
    { id: "details", label: "PO Details" },
    { id: "lines", label: "PO Lines" },
    { id: "invoices", label: "Linked Invoices" },
    { id: "grns", label: "Linked GRNs" },
  ];

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments(1, 100);
      if (response.success) {
        const poDocuments = response.data
          .filter((doc) => doc.document_type === "Purchase Order")
          .map((doc) => ({
            id: doc._id,
            name: doc.file_name,
            type: doc.document_type,
            status: doc.status.toLowerCase(),
            extractedData: doc.purchase_order_data || {},
            createdAt: doc.createdAt,
          }));
        setDocuments(poDocuments);
      }
    } catch (error) {
      setToast({
        message: "Failed to load purchase orders",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleRowClick = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const filteredDocuments = documents.filter((doc) => {
    const data = doc.extractedData || {};
    const matchesSearch =
      searchTerm === "" ||
      (data.poNumber &&
        data.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.buyerName &&
        data.buyerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.sellerName &&
        data.sellerName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">PO Workspace</h2>
          <p className="text-sm text-gray-600 mt-1">
            All purchase orders with reconciliation status
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by PO Number, Buyer, or Seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex space-x-3 mt-3 md:mt-0">
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
              <option>All Sites</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
              <option>PO Date</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading purchase orders...</span>
        </div>
      ) : (
        <POTable documents={filteredDocuments} onRowClick={handleRowClick} />
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
              <PODetailsTab data={selectedDocument.extractedData} />
            )}
            {activeTab === "lines" && (
              <POLinesTab items={selectedDocument.extractedData?.items || []} />
            )}
            {activeTab === "invoices" && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">
                  Linked invoices will be displayed here
                </p>
              </div>
            )}
            {activeTab === "grns" && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">
                  Linked GRNs will be displayed here
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

export default POWorkspace;
