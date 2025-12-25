import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import documentService from "../../api/documentService";
import { getFieldConfig } from "./config/documentFieldConfigs";
import { useDocumentDuplicateCheck } from "./hooks/useDocumentDuplicateCheck";
import DocumentHeader from "./components/DocumentHeader";
import DocumentMainFields from "./components/DocumentMainFields";
import DocumentItemsTable from "./components/DocumentItemsTable";
import DocumentActionButtons from "./components/DocumentActionButtons";
import DuplicateErrorAlert from "./components/DuplicateErrorAlert";
import ValidationErrorAlert from "./components/ValidationErrorAlert";

const DocumentDataDisplay = ({
  documentData,
  onClose,
  onSave,
  onApprove,
  goBackCallback = null,
  documentId = null,
}) => {
  const [editedData, setEditedData] = useState(documentData);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [organizationConfig, setOrganizationConfig] = useState(null);
  const [imageZoomLevel, setImageZoomLevel] = useState(1);
  const [showImageControls, setShowImageControls] = useState(false);

  const { duplicateError, isCheckingDuplicates } = useDocumentDuplicateCheck(
    documentId,
    organizationConfig
  );

  const isPDF = (url) => {
    if (!url) return false;
    return (
      url.toLowerCase().includes(".pdf") || url.toLowerCase().endsWith(".pdf")
    );
  };

  useEffect(() => {
    if (editedData.organization?.code && editedData.documentType) {
      setOrganizationConfig(
        getFieldConfig(editedData.organization.code, editedData.documentType)
      );
    } else if (editedData.organization?.code) {
      const hasPoNumber = editedData.poNumber !== undefined;
      const hasInvoiceNumber = editedData.invoiceNumber !== undefined;
      const hasGrnNumber = editedData.grnNumber !== undefined;
      const hasDocumentNumber = editedData.documentNumber !== undefined;

      let docType = "Invoice";
      if (
        hasGrnNumber &&
        !hasInvoiceNumber &&
        !hasPoNumber &&
        !hasDocumentNumber
      ) {
        docType = "GRN";
      } else if (hasPoNumber && !hasInvoiceNumber && !hasDocumentNumber) {
        docType = "Purchase Order";
      } else if (
        hasDocumentNumber &&
        !hasInvoiceNumber &&
        !hasPoNumber &&
        !hasGrnNumber
      ) {
        docType = "Payment Advice";
      }

      setOrganizationConfig(
        getFieldConfig(editedData.organization.code, docType)
      );
    } else {
      const hasPoNumber = editedData.poNumber !== undefined;
      const hasGrnNumber = editedData.grnNumber !== undefined;
      const hasDocumentNumber = editedData.documentNumber !== undefined;

      const docType = hasGrnNumber
        ? "GRN"
        : hasPoNumber
        ? "Purchase Order"
        : hasDocumentNumber
        ? "Payment Advice"
        : "Invoice";
      setOrganizationConfig(getFieldConfig("KIWI", docType));
    }
  }, [editedData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (documentId) {
        const documentType = organizationConfig?.fields.some(
          (f) => f.key === "grnNumber"
        )
          ? "GRN"
          : organizationConfig?.fields.some((f) => f.key === "poNumber")
          ? "Purchase Order"
          : organizationConfig?.fields.some((f) => f.key === "documentNumber")
          ? "Payment Advice"
          : "Invoice";

        await documentService.updateDocumentData(
          documentId,
          editedData,
          documentType
        );
      }
      onSave(editedData);
    } catch (error) {
      console.error("Error saving document data:", error);
      alert(
        `Failed to save data. Error: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      if (documentId) {
        const documentType = organizationConfig?.fields.some(
          (f) => f.key === "grnNumber"
        )
          ? "GRN"
          : organizationConfig?.fields.some((f) => f.key === "poNumber")
          ? "Purchase Order"
          : organizationConfig?.fields.some((f) => f.key === "documentNumber")
          ? "Payment Advice"
          : "Invoice";

        await documentService.updateDocumentStatus(
          documentId,
          "approved",
          documentType
        );
        onApprove(documentId);
      }
    } catch (error) {
      console.error("Error approving document:", error);
      alert("Failed to approve document. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleFieldChange = (fieldKey, value, fieldType) => {
    let processedValue = value;

    if (fieldType === "date" && value) {
      processedValue = value;
    }

    setEditedData((prev) => {
      const newData = { ...prev, [fieldKey]: processedValue };
      if (["cgstAmount", "sgstAmount", "igstAmount"].includes(fieldKey)) {
        const cgst = parseFloat(newData.cgstAmount) || 0;
        const sgst = parseFloat(newData.sgstAmount) || 0;
        const igst = parseFloat(newData.igstAmount) || 0;
        const totalGst = igst > 0 ? igst : cgst + sgst;
        newData.gstAmount = parseFloat(totalGst.toFixed(2));
      }
      return newData;
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...(editedData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setEditedData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddItem = () => {
    if (!organizationConfig) return;

    const newItem = {};
    organizationConfig.itemFields.forEach((field) => {
      if (
        [
          "quantity",
          "rate",
          "baseCost",
          "totalAmount",
          "totalBaseValue",
          "discountAmount",
          "acceptedQty",
          "challanQty",
          "receivedQty",
          "igstValue",
          "cgstValue",
          "sgstValue",
          "invoiceAmount",
          "paymentAmount",
          "tds",
          "gstTaxHold",
          "gstTaxPaid",
        ].includes(field.key)
      ) {
        newItem[field.key] = "0";
      } else if (
        field.key === "gstRate" ||
        field.key === "igstPercent" ||
        field.key === "cgstPercent" ||
        field.key === "sgstPercent" ||
        field.key === "discountRate"
      ) {
        newItem[field.key] = "0";
      } else {
        newItem[field.key] = "";
      }
    });

    const updatedItems = [...(editedData.items || []), newItem];

    setEditedData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...(editedData.items || [])];
    updatedItems.splice(index, 1);

    setEditedData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSummaryFieldChange = (fieldKey, value) => {
    setEditedData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleZoomIn = () => {
    setImageZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoomLevel(1);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  if (!organizationConfig) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading configuration...</span>
      </div>
    );
  }

  const currentStatus = documentData.status || "pending-approval";
  const isApproved = currentStatus === "approved";
  const documentType = organizationConfig.fields.some(
    (f) => f.key === "grnNumber"
  )
    ? "GRN"
    : organizationConfig.fields.some((f) => f.key === "poNumber")
    ? "Purchase Order"
    : organizationConfig.fields.some((f) => f.key === "documentNumber")
    ? "Payment Advice"
    : "Invoice";
  const documentName = documentType;

  return (
    <>
      <style jsx>{`
        .table-container {
          position: relative;
          overflow: auto;
          max-height: 400px;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background-color: #f9fafb;
        }

        .sticky-column {
          position: sticky;
          left: 0;
          z-index: 20;
          background-color: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        }

        .sticky-header.sticky-column {
          z-index: 40;
          background-color: #f9fafb;
        }

        .image-zoom-container {
          position: relative;
          overflow: auto;
          width: 100%;
          height: 100%;
        }

        .zoom-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          display: flex;
          gap: 5px;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px;
          border-radius: 6px;
        }

        .zoom-button {
          background: white;
          border: none;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          transition: background-color 0.2s;
        }

        .zoom-button:hover {
          background: #f3f4f6;
        }

        .image-container {
          transform-origin: top left;
          transition: transform 0.2s ease;
        }

        .description-field {
          min-width: 250px;
          max-width: 400px;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      >
        <div
          className="relative bg-white w-screen h-screen overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <DocumentHeader
            documentName={documentName}
            currentStatus={currentStatus}
            onClose={onClose}
            goBackCallback={goBackCallback}
          />

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full p-6">
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium mb-4 text-center">
                  {documentName} Document
                </h3>
                <div
                  className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 min-h-[400px] relative"
                  onMouseEnter={() => setShowImageControls(true)}
                  onMouseLeave={() => setShowImageControls(false)}
                >
                  {documentData.imageUrl ? (
                    isPDF(documentData.imageUrl) ? (
                      <iframe
                        src={documentData.imageUrl}
                        title={documentName}
                        className="w-full h-full"
                        style={{ minHeight: "600px" }}
                      />
                    ) : (
                      <div className="image-zoom-container">
                        {showImageControls && (
                          <div className="zoom-controls">
                            <button
                              className="zoom-button"
                              onClick={handleZoomIn}
                              title="Zoom In"
                            >
                              +
                            </button>
                            <button
                              className="zoom-button"
                              onClick={handleZoomOut}
                              title="Zoom Out"
                            >
                              -
                            </button>
                            <button
                              className="zoom-button"
                              onClick={handleResetZoom}
                              title="Reset Zoom"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                        <div
                          className="image-container w-full h-full flex items-center justify-center"
                          style={{
                            transform: `scale(${imageZoomLevel})`,
                            cursor: imageZoomLevel > 1 ? "move" : "default",
                          }}
                        >
                          <img
                            src={documentData.imageUrl}
                            alt={documentName}
                            className="max-w-full max-h-full object-contain"
                            draggable={false}
                          />
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                      No document available
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium mb-4 text-center">
                  {isEditing
                    ? `Edit ${documentName} Data`
                    : `Extracted ${documentName} Data`}
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                      isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isApproved ? "Approved" : "Pending Approval"}
                  </span>
                </h3>

                <DuplicateErrorAlert
                  duplicateError={duplicateError}
                  isChecking={isCheckingDuplicates}
                />

                <ValidationErrorAlert
                  editedData={editedData}
                  organizationConfig={organizationConfig}
                />

                <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="p-5 h-full overflow-y-auto">
                    <DocumentMainFields
                      fields={organizationConfig.fields}
                      editedData={editedData}
                      isEditing={isEditing}
                      onFieldChange={handleFieldChange}
                      onSummaryFieldChange={handleSummaryFieldChange}
                    />

                    <DocumentItemsTable
                      itemFields={organizationConfig.itemFields}
                      items={editedData.items || []}
                      editedData={editedData}
                      isEditing={isEditing}
                      onItemChange={handleItemChange}
                      onAddItem={handleAddItem}
                      onRemoveItem={handleRemoveItem}
                      organizationConfig={organizationConfig}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DocumentActionButtons
            isEditing={isEditing}
            isApproved={isApproved}
            isSaving={isSaving}
            isApproving={isApproving}
            onClose={onClose}
            onStartEditing={handleStartEditing}
            onSave={handleSave}
            onApprove={handleApprove}
            documentName={documentName}
          />
        </div>
      </div>
    </>
  );
};

DocumentDataDisplay.propTypes = {
  documentData: PropTypes.shape({
    imageUrl: PropTypes.string,
    status: PropTypes.string,
    documentType: PropTypes.string,
    organization: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
    invoiceNumber: PropTypes.string,
    poNumber: PropTypes.string,
    grnNumber: PropTypes.string,
    documentNumber: PropTypes.string,
    supplierName: PropTypes.string,
    buyerOrderNo: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    validation_results: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  goBackCallback: PropTypes.func,
  documentId: PropTypes.string,
};

export default DocumentDataDisplay;
