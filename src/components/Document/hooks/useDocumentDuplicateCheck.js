import { useState, useCallback, useEffect } from "react";
import documentService from "../../../api/documentService";

export const useDocumentDuplicateCheck = (documentId, organizationConfig) => {
  const [duplicateError, setDuplicateError] = useState(null);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateCheckComplete, setDuplicateCheckComplete] = useState(false);

  const checkForDuplicates = useCallback(async () => {
    if (!documentId || !organizationConfig || duplicateCheckComplete) {
      return;
    }

    setIsCheckingDuplicates(true);
    setDuplicateError(null);

    try {
      const documentType = organizationConfig?.fields.some(
        (f) => f.key === "grnNumber"
      )
        ? "GRN"
        : organizationConfig?.fields.some((f) => f.key === "poNumber")
        ? "Purchase Order"
        : organizationConfig?.fields.some((f) => f.key === "documentNumber")
        ? "Payment Advice"
        : "Invoice";

      const response = await documentService.checkDocumentDuplicates(
        documentId,
        documentType
      );

      if (response.success && response.data.hasDuplicates) {
        setDuplicateError({
          hasDuplicates: true,
          duplicates: response.data.duplicates,
          documentNumber: response.data.currentDocumentNumber,
          documentType: response.data.documentType,
          organizationCode: response.data.organizationCode,
        });
      } else {
        setDuplicateError(null);
      }

      setDuplicateCheckComplete(true);
    } catch (error) {
      console.error("Error checking duplicates:", error);
      setDuplicateError(null);
      setDuplicateCheckComplete(true);
    } finally {
      setIsCheckingDuplicates(false);
    }
  }, [documentId, organizationConfig, duplicateCheckComplete]);

  useEffect(() => {
    if (organizationConfig && documentId && !duplicateCheckComplete) {
      checkForDuplicates();
    }
  }, [
    organizationConfig,
    documentId,
    duplicateCheckComplete,
    checkForDuplicates,
  ]);

  return { duplicateError, isCheckingDuplicates };
};
