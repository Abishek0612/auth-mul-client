import PropTypes from "prop-types";
import DocumentItem from "./DocumentItem";
import { useState } from "react";

const DocumentList = ({
  documents,
  onDocumentClick,
  onDeleteDocument,
  onReScanDocument,
  selectedDocuments,
  onSelectionChange,
  onSelectAll,
  isAllSelected,
  activeTab,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-3 h-3 ml-1 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortConfig.direction === "asc") {
      return (
        <svg
          className="w-3 h-3 ml-1 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-3 h-3 ml-1 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="hidden md:block overflow-x-auto">
        <div className="bg-gray-50 px-2 py-3 border-b border-gray-200 min-w-[1200px]">
          <div className="grid grid-cols-12 items-center gap-2">
            {activeTab === "approved" ? (
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer"
                />
              </div>
            ) : (
              <div className="col-span-1"></div>
            )}

            <button
              onClick={() => handleSort("name")}
              className="col-span-3 flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Document Name
              {getSortIcon("name")}
            </button>

            <button
              onClick={() => handleSort("supplierName")}
              className="col-span-2 flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Supplier Name
              {getSortIcon("supplierName")}
            </button>

            <button
              onClick={() => handleSort("documentNumber")}
              className="col-span-1 flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Doc Number
              {getSortIcon("documentNumber")}
            </button>

            <button
              onClick={() => handleSort("type")}
              className="col-span-1 flex items-center justify-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Type
              {getSortIcon("type")}
            </button>

            <button
              onClick={() => handleSort("date")}
              className="col-span-1 flex items-center justify-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Date
              {getSortIcon("date")}
            </button>

            <button
              onClick={() => handleSort("status")}
              className="col-span-1 flex items-center justify-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
            >
              Status
              {getSortIcon("status")}
            </button>

            <div className="col-span-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ul className="divide-y divide-gray-200 min-w-[1200px]">
          {sortedDocuments.length > 0 ? (
            sortedDocuments.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onDocumentClick={onDocumentClick}
                onDeleteDocument={onDeleteDocument}
                onReScanDocument={onReScanDocument}
                isSelected={selectedDocuments.includes(document.id)}
                onSelectionChange={onSelectionChange}
                activeTab={activeTab}
              />
            ))
          ) : (
            <li className="px-6 py-12 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No documents found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or upload some documents.
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDocumentClick: PropTypes.func.isRequired,
  onDeleteDocument: PropTypes.func.isRequired,
  onReScanDocument: PropTypes.func.isRequired,
  selectedDocuments: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  activeTab: PropTypes.string,
};

export default DocumentList;
