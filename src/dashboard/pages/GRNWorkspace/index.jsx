import { useState, useCallback, useMemo } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import GRNTable from "./components/GRNTable";
import GRNModal from "./components/GRNModal";
import { useWorkspaceData } from "../../../hooks/workspace/useWorkspaceData";
import workspaceService from "../../../api/workspaceService";

const GRNWorkspace = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

  const fetchGRNData = useCallback(
    (params) =>
      workspaceService.getGRNWorkspace({
        ...params,
        dateRange: params.dateRange
          ? JSON.stringify(params.dateRange)
          : undefined,
        invoiceStatus: params.invoiceStatus
          ? JSON.stringify(params.invoiceStatus)
          : undefined,
        acceptanceStatus: params.acceptanceStatus
          ? JSON.stringify(params.acceptanceStatus)
          : undefined,
      }),
    []
  );
  const initialFilters = useMemo(
    () => ({
      dateRange: { from: "2025-01-01", to: "2025-12-31" },
      dateType: "grnDate",
      search: "",
      invoiceStatus: [],
      acceptanceStatus: [],
    }),
    []
  );

  const {
    data: documents,
    summary,
    totals,
    pagination,
    isLoading,
    filters,
    handlePageChange,
    handleFilterChange,
    refresh,
  } = useWorkspaceData(fetchGRNData, initialFilters);

  const handleSummaryCardClick = (filterType, filterValue) => {
    if (activeStatusFilter === filterValue) {
      setActiveStatusFilter(null);
      handleFilterChange({
        ...filters,
        invoiceStatus: [],
        acceptanceStatus: [],
      });
    } else {
      setActiveStatusFilter(filterValue);
      if (
        [
          "Missing Invoice",
          "Under vs Invoice",
          "Matched vs Invoice",
          "Over vs Invoice",
        ].includes(filterValue)
      ) {
        handleFilterChange({
          ...filters,
          invoiceStatus: [filterValue],
          acceptanceStatus: [],
        });
      } else {
        handleFilterChange({
          ...filters,
          invoiceStatus: [],
          acceptanceStatus: [filterValue],
        });
      }
    }
  };

  const summaryGroups = [
    {
      title: "INVOICE STATUS",
      cards: [
        {
          label: "Total GRNs",
          value: summary.totalGRNs || 0,
          color: "default",
          isActive: activeStatusFilter === null,
          onClick: () => handleSummaryCardClick(null, null),
        },
        {
          label: "Missing Invoice",
          value: summary.missingInvoice || 0,
          color: "red",
          isActive: activeStatusFilter === "Missing Invoice",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Missing Invoice"),
        },
        {
          label: "Under vs Invoice",
          value: summary.underVsInvoice || 0,
          color: "yellow",
          isActive: activeStatusFilter === "Under vs Invoice",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Under vs Invoice"),
        },
        {
          label: "Matched vs Invoice",
          value: summary.matchedVsInvoice || 0,
          color: "green",
          isActive: activeStatusFilter === "Matched vs Invoice",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Matched vs Invoice"),
        },
        {
          label: "Over vs Invoice",
          value: summary.overVsInvoice || 0,
          color: "red",
          isActive: activeStatusFilter === "Over vs Invoice",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Over vs Invoice"),
        },
      ],
    },
    {
      title: "ACCEPTANCE STATUS",
      cards: [
        {
          label: "Fully Accepted",
          value: summary.fullyAccepted || 0,
          color: "green",
          isActive: activeStatusFilter === "Fully Accepted",
          onClick: () =>
            handleSummaryCardClick("acceptanceStatus", "Fully Accepted"),
        },
        {
          label: "Partially Accepted",
          value: summary.partiallyAccepted || 0,
          color: "orange",
          isActive: activeStatusFilter === "Partially Accepted",
          onClick: () =>
            handleSummaryCardClick("acceptanceStatus", "Partially Accepted"),
        },
      ],
    },
  ];

  const localFilters = {
    search: filters.search,
    searchPlaceholder: "Search GRN No, Invoice, PO, Article...",
    statusFilters: [
      {
        key: "invoiceStatus",
        label: "All Invoice Status",
        options: [
          { value: "Missing Invoice", label: "Missing Invoice" },
          { value: "Under vs Invoice", label: "Under vs Invoice" },
          { value: "Matched vs Invoice", label: "Matched vs Invoice" },
          { value: "Over vs Invoice", label: "Over vs Invoice" },
        ],
      },
      {
        key: "acceptanceStatus",
        label: "All GRN Status",
        options: [
          { value: "Fully Accepted", label: "Fully Accepted" },
          { value: "Partially Accepted", label: "Partially Accepted" },
        ],
      },
    ],
    multiSelectFilters: [
      { key: "buyer", label: "All Buyers" },
      { key: "seller", label: "All Sellers" },
      { key: "site", label: "All Sites" },
      { key: "city", label: "All Cities" },
    ],
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setShowModal(true);
  };

  return (
    <>
      <WorkspaceLayout
        title="GRN Workspace"
        subtitle="All goods receipt notes with reconciliation"
        globalFilters={filters}
        onGlobalFilterChange={handleFilterChange}
        summaryGroups={summaryGroups}
        localFilters={localFilters}
        onLocalFilterChange={handleFilterChange}
        totals={totals}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      >
        <GRNTable documents={documents} onDocumentClick={handleDocumentClick} />
      </WorkspaceLayout>
      {/* 
      {showModal && (
        <GRNModal
          document={selectedDocument}
          onClose={() => {
            setShowModal(false);
            setSelectedDocument(null);
          }}
        />
      )} */}
    </>
  );
};

export default GRNWorkspace;
