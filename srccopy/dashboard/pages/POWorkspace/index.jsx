import { useState, useEffect, useCallback } from "react";
import workspaceService from "../../../api/workspaceService";
import POTable from "./components/POTable";
import POSecondaryFilters from "./components/POSecondaryFilters";
import WorkspaceDocumentModal from "../../components/WorkspaceDocumentModal";
import PODetailsTab from "./components/PODetailsTab";
import POLinesTab from "./components/POLinesTab";
import Toast from "../../../components/Toast";
import POSummaryStrip from "./components/POSummaryStrip";
import GlobalDateRangeFilter from "../../components/GlobalDateRangeFilter";
import GlobalPagination from "../../components/GlobalPagination";
import PODetailsSection from "./components/PODetailsSection";

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

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    site: "All Sites",
    buyer: "All Buyers",
    seller: "All Sellers",
    status: "All Statuses",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
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
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });

      if (response.success) {
        setSummary(response.data.summary);
        setDocuments(response.data.pos);
        setAvailableFilters(response.data.filters);
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.page,
            totalPages: response.data.pagination.pages,
            totalItems: response.data.pagination.total,
            itemsPerPage: pagination.itemsPerPage,
          });
        }
      }
    } catch (error) {
      setToast({
        message: "Failed to load PO workspace data",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleReset = () => {
    setFilters({
      dateRange: { from: "", to: "" },
      site: "All Sites",
      buyer: "All Buyers",
      seller: "All Sellers",
      status: "All Statuses",
      search: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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

      <GlobalDateRangeFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <POSummaryStrip summary={summary} />

      <POSecondaryFilters
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
        <>
          <POTable
            documents={documents}
            onRowClick={handleRowClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <GlobalPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
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
              <POLinesTab
                items={selectedDocument.details?.po?.items || []}
                data={selectedDocument.details?.po || {}}
                summary={selectedDocument.details?.summary || {}}
              />
            )}
            {activeTab === "invoices" && (
              <div className="space-y-6">
                <PODetailsSection
                  data={selectedDocument.details?.po || {}}
                  summary={selectedDocument.details?.summary || {}}
                />
                <div className="bg-white rounded-lg shadow">
                  {selectedDocument.details?.linkedInvoices?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              GRN
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedDocument.details.linkedInvoices.map(
                            (inv) => (
                              <tr key={inv.id} className="hover:bg-gray-50">
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
                                <td className="px-6 py-4 text-sm">
                                  {inv.grnNumber || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      inv.status === "Has GRN"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {inv.status || "Missing GRN"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      <p>No linked invoices</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "grns" && (
              <div className="space-y-6">
                <PODetailsSection
                  data={selectedDocument.details?.po || {}}
                  summary={selectedDocument.details?.summary || {}}
                />
                <div className="bg-white rounded-lg shadow">
                  {selectedDocument.details?.linkedGRNs?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              GRN No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Received Qty
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Accepted Qty
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Rejected Qty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Invoice No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedDocument.details.linkedGRNs.map((grn) => (
                            <tr key={grn.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm">
                                {grn.grnNumber}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {grn.grnDate}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                {grn.receivedQty}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                {grn.acceptedQty}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                {grn.rejectedQty}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {grn.vendorInvoiceNo || "-"}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  Fully Accepted
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      <p>No linked GRNs</p>
                    </div>
                  )}
                </div>
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
