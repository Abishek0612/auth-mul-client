import { useState } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import POTable from "./components/POTable";
import POModal from "./components/POModal";
import workspaceService from "../../../api/workspaceService";
import { useWorkspaceData } from "../../../hooks/workspace/useWorkspaceData";
import { getSummaryCardColor } from "../../../hooks/workspace/statusHelpers";

const POWorkspace = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

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
  } = useWorkspaceData(
    (params) =>
      workspaceService.getPOWorkspace({
        ...params,
        dateRange: params.dateRange
          ? JSON.stringify(params.dateRange)
          : undefined,
        invoiceStatus: params.invoiceStatus
          ? JSON.stringify(params.invoiceStatus)
          : undefined,
        grnStatus: params.grnStatus
          ? JSON.stringify(params.grnStatus)
          : undefined,
      }),
    {
      dateRange: { from: "2025-01-01", to: "2025-12-31" },
      dateType: "poDate",
      search: "",
      invoiceStatus: [],
      grnStatus: [],
    }
  );

  const handleSummaryCardClick = (filterType, filterValue) => {
    if (activeStatusFilter === filterValue) {
      setActiveStatusFilter(null);
      handleFilterChange({
        ...filters,
        invoiceStatus: [],
        grnStatus: [],
      });
    } else {
      setActiveStatusFilter(filterValue);
      if (
        [
          "Open",
          "Partially Invoiced",
          "Fully Invoiced",
          "Over Invoiced",
        ].includes(filterValue)
      ) {
        handleFilterChange({
          ...filters,
          invoiceStatus: [filterValue],
          grnStatus: [],
        });
      } else {
        handleFilterChange({
          ...filters,
          invoiceStatus: [],
          grnStatus: [filterValue],
        });
      }
    }
  };

  const summaryGroups = [
    {
      title: "INVOICING STATUS",
      cards: [
        {
          label: "Total POs",
          value: summary.totalPOs || 0,
          color: getSummaryCardColor("Total POs"),
          isActive: activeStatusFilter === null,
          onClick: () => handleSummaryCardClick(null, null),
        },
        {
          label: "Open",
          value: summary.open || 0,
          color: getSummaryCardColor("Open"),
          isActive: activeStatusFilter === "Open",
          onClick: () => handleSummaryCardClick("invoiceStatus", "Open"),
        },
        {
          label: "Partially Invoiced",
          value: summary.partiallyInvoiced || 0,
          color: getSummaryCardColor("Partially Invoiced"),
          isActive: activeStatusFilter === "Partially Invoiced",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Partially Invoiced"),
        },
        {
          label: "Fully Invoiced",
          value: summary.fullyInvoiced || 0,
          color: getSummaryCardColor("Fully Invoiced"),
          isActive: activeStatusFilter === "Fully Invoiced",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Fully Invoiced"),
        },
        {
          label: "Over Invoiced",
          value: summary.overInvoiced || 0,
          color: getSummaryCardColor("Over Invoiced"),
          isActive: activeStatusFilter === "Over Invoiced",
          onClick: () =>
            handleSummaryCardClick("invoiceStatus", "Over Invoiced"),
        },
      ],
    },
    {
      title: "GRN STATUS",
      cards: [
        {
          label: "No GRN Yet",
          value: summary.noGRNYet || 0,
          color: getSummaryCardColor("No GRN Yet"),
          isActive: activeStatusFilter === "No GRN Yet",
          onClick: () => handleSummaryCardClick("grnStatus", "No GRN Yet"),
        },
        {
          label: "Partially Received",
          value: summary.partiallyReceived || 0,
          color: getSummaryCardColor("Partially Received"),
          isActive: activeStatusFilter === "Partially Received",
          onClick: () =>
            handleSummaryCardClick("grnStatus", "Partially Received"),
        },
        {
          label: "Fully Received",
          value: summary.fullyReceived || 0,
          color: getSummaryCardColor("Fully Received"),
          isActive: activeStatusFilter === "Fully Received",
          onClick: () => handleSummaryCardClick("grnStatus", "Fully Received"),
        },
        {
          label: "Over Received",
          value: summary.overReceived || 0,
          color: getSummaryCardColor("Over Received"),
          isActive: activeStatusFilter === "Over Received",
          onClick: () => handleSummaryCardClick("grnStatus", "Over Received"),
        },
        {
          label: "Has Rejections",
          value: summary.hasRejections || 0,
          color: getSummaryCardColor("Has Rejections"),
          isActive: activeStatusFilter === "Has Rejections",
          onClick: () => handleSummaryCardClick("grnStatus", "Has Rejections"),
        },
      ],
    },
  ];

  const localFilters = {
    search: filters.search,
    searchPlaceholder: "Search PO No, Article, Description...",
    statusFilters: [
      {
        key: "invoiceStatus",
        label: "All Invoice Status",
        options: [
          { value: "Open", label: "Open" },
          { value: "Partially Invoiced", label: "Partially Invoiced" },
          { value: "Fully Invoiced", label: "Fully Invoiced" },
          { value: "Over Invoiced", label: "Over Invoiced" },
        ],
      },
      {
        key: "grnStatus",
        label: "All GRN Status",
        options: [
          { value: "No GRN Yet", label: "No GRN Yet" },
          { value: "Partially Received", label: "Partially Received" },
          { value: "Fully Received", label: "Fully Received" },
          { value: "Over Received", label: "Over Received" },
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
        title="PO Workspace"
        subtitle="All purchase orders with reconciliation status"
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
        <POTable documents={documents} onDocumentClick={handleDocumentClick} />
      </WorkspaceLayout>

      {showModal && (
        <POModal
          document={selectedDocument}
          onClose={() => {
            setShowModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </>
  );
};

export default POWorkspace;
