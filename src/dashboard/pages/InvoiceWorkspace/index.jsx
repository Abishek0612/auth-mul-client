import { useState, useCallback, useMemo } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceModal from "./components/InvoiceModal";
import workspaceService from "../../../api/workspaceService";
import { useWorkspaceData } from "../../../hooks/workspace/useWorkspaceData";

const InvoiceWorkspace = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

  const fetchInvoiceData = useCallback(
    (params) =>
      workspaceService.getInvoiceWorkspace({
        ...params,
        dateRange: params.dateRange
          ? JSON.stringify(params.dateRange)
          : undefined,
        poStatus: params.poStatus ? JSON.stringify(params.poStatus) : undefined,
        grnStatus: params.grnStatus
          ? JSON.stringify(params.grnStatus)
          : undefined,
      }),
    []
  );

  const initialFilters = useMemo(
    () => ({
      dateRange: { from: "2025-01-01", to: "2025-12-31" },
      dateType: "invoiceDate",
      search: "",
      poStatus: [],
      grnStatus: [],
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
  } = useWorkspaceData(fetchInvoiceData, initialFilters);

  const handleSummaryCardClick = (filterType, filterValue) => {
    if (activeStatusFilter === filterValue) {
      setActiveStatusFilter(null);
      handleFilterChange({
        ...filters,
        poStatus: [],
        grnStatus: [],
      });
    } else {
      setActiveStatusFilter(filterValue);
      if (["No PO", "PO Linked"].includes(filterValue)) {
        handleFilterChange({
          ...filters,
          poStatus: [filterValue],
          grnStatus: [],
        });
      } else {
        handleFilterChange({
          ...filters,
          poStatus: [],
          grnStatus: [filterValue],
        });
      }
    }
  };

  const summaryGroups = [
    {
      title: "PO STATUS",
      cards: [
        {
          label: "Total Invoices",
          value: summary.totalInvoices || 0,
          color: "default",
          isActive: activeStatusFilter === null,
          onClick: () => handleSummaryCardClick(null, null),
        },
        {
          label: "No PO",
          value: summary.noPO || 0,
          color: "blue",
          isActive: activeStatusFilter === "No PO",
          onClick: () => handleSummaryCardClick("poStatus", "No PO"),
        },
        {
          label: "PO Linked",
          value: summary.poLinked || 0,
          color: "green",
          isActive: activeStatusFilter === "PO Linked",
          onClick: () => handleSummaryCardClick("poStatus", "PO Linked"),
        },
      ],
    },
    {
      title: "GRN STATUS",
      cards: [
        {
          label: "Missing GRN",
          value: summary.missingGRN || 0,
          color: "red",
          isActive: activeStatusFilter === "Missing GRN",
          onClick: () => handleSummaryCardClick("grnStatus", "Missing GRN"),
        },
        {
          label: "GRN Under",
          value: summary.grnUnder || 0,
          color: "yellow",
          isActive: activeStatusFilter === "GRN Under",
          onClick: () => handleSummaryCardClick("grnStatus", "GRN Under"),
        },
        {
          label: "GRN Matched",
          value: summary.grnMatched || 0,
          color: "green",
          isActive: activeStatusFilter === "GRN Matched",
          onClick: () => handleSummaryCardClick("grnStatus", "GRN Matched"),
        },
        {
          label: "GRN Over",
          value: summary.grnOver || 0,
          color: "red",
          isActive: activeStatusFilter === "GRN Over",
          onClick: () => handleSummaryCardClick("grnStatus", "GRN Over"),
        },
        {
          label: "Has Rejections",
          value: summary.hasRejections || 0,
          color: "orange",
          isActive: activeStatusFilter === "Has Rejections",
          onClick: () => handleSummaryCardClick("grnStatus", "Has Rejections"),
        },
      ],
    },
  ];

  const localFilters = {
    search: filters.search,
    searchPlaceholder: "Search Invoice No, PO, Article...",
    statusFilters: [
      {
        key: "poStatus",
        label: "All PO Status",
        options: [
          { value: "No PO", label: "No PO" },
          { value: "PO Linked", label: "PO Linked" },
        ],
      },
      {
        key: "grnStatus",
        label: "All GRN Status",
        options: [
          { value: "Missing GRN", label: "Missing GRN" },
          { value: "GRN Under", label: "GRN Under" },
          { value: "GRN Matched", label: "GRN Matched" },
          { value: "GRN Over", label: "GRN Over" },
          { value: "Has Rejections", label: "Has Rejections" },
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
        title="Invoice Workspace"
        subtitle="All invoices with reconciliation status"
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
        <InvoiceTable
          documents={documents}
          onDocumentClick={handleDocumentClick}
        />
      </WorkspaceLayout>
      {/* 
      {showModal && (
        <InvoiceModal
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

export default InvoiceWorkspace;
