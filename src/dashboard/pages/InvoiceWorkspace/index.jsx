import { useState, useEffect, useCallback } from "react";
import documentService from "../../../api/documentService";
import InvoiceTable from "./components/InvoiceTable";
import WorkspaceDocumentModal from "../../components/WorkspaceDocumentModal";
import InvoiceDetailsTab from "./components/InvoiceDetailsTab";
import InvoiceLinesTab from "./components/InvoiceLinesTab";
import Toast from "../../../components/Toast";

const InvoiceWorkspace = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "details", label: "Invoice Details" },
    { id: "lines", label: "Invoice Lines" },
    { id: "po", label: "Linked PO" },
    { id: "grn", label: "Linked GRN" },
  ];

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments(1, 100);
      if (response.success) {
        const invoiceDocuments = response.data
          .filter((doc) => doc.document_type === "Invoice")
          .map((doc) => ({
            id: doc._id,
            name: doc.file_name,
            type: doc.document_type,
            status: doc.status.toLowerCase(),
            extractedData: doc.invoice_data || {},
            createdAt: doc.createdAt,
          }));
        setDocuments(invoiceDocuments);
      }
    } catch (error) {
      setToast({
        message: "Failed to load invoices",
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
      (data.invoiceNumber &&
        data.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.buyerName &&
        data.buyerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.sellerName &&
        data.sellerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (data.buyerOrderNo &&
        data.buyerOrderNo.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Invoice Workspace
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            All invoices with reconciliation status
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Invoice Number, Buyer, Seller, or Order No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex space-x-3 mt-3 md:mt-0">
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
              <option>All Buyers</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
              <option>Invoice Date</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading invoices...</span>
        </div>
      ) : (
        <InvoiceTable
          documents={filteredDocuments}
          onRowClick={handleRowClick}
        />
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
              <InvoiceDetailsTab data={selectedDocument.extractedData} />
            )}
            {activeTab === "lines" && (
              <InvoiceLinesTab
                items={selectedDocument.extractedData?.items || []}
              />
            )}
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
