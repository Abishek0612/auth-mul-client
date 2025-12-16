import PropTypes from "prop-types";
import { formatValidationErrors } from "../utils/validationHelpers";

const ValidationErrorAlert = ({ editedData, organizationConfig }) => {
  const shouldShowValidation = () => {
    return (
      editedData.organization?.code === "UBOARD" &&
      (editedData.documentType === "Purchase Order" ||
        organizationConfig?.fields.some((f) => f.key === "poNumber"))
    );
  };

  if (!shouldShowValidation()) return null;

  if (!editedData.validation_results && !editedData.site_validation) {
    return null;
  }

  const siteValidation = editedData.site_validation;
  const itemValidationErrors = formatValidationErrors(
    editedData.validation_results
  );
  const totalItems = editedData.validation_results?.length || 0;
  const validItems =
    editedData.validation_results?.filter((r) => r.isValid).length || 0;
  const invalidItems = totalItems - validItems;

  const hasSiteError = siteValidation && !siteValidation.isValid;
  const hasItemErrors = itemValidationErrors.length > 0;

  if (!hasSiteError && !hasItemErrors) {
    return (
      <div className="mb-4 p-3 border rounded-lg bg-green-50 border-green-200">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          Product Master Validation
        </h4>
        <div className="flex space-x-4 text-xs">
          <span className="text-green-600">Valid: {validItems}</span>
          <span className="text-gray-600">Total: {totalItems}</span>
        </div>
        <p className="text-sm text-green-700 mt-2">
          All line items and site code match the master data
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Product Master Validation Errors
          </h3>

          {hasSiteError && (
            <div className="mt-2 mb-3 p-2 bg-red-100 rounded">
              <p className="text-sm font-medium text-red-700">
                Site Code Error:
              </p>
              <p className="text-sm text-red-600 mt-1">
                {siteValidation.error}
              </p>
            </div>
          )}

          {hasItemErrors && (
            <>
              <div className="flex space-x-4 text-xs mt-1 mb-2">
                <span className="text-green-600">Valid: {validItems}</span>
                <span className="text-red-600">Invalid: {invalidItems}</span>
                <span className="text-gray-600">Total: {totalItems}</span>
              </div>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-medium mb-1">Line Item Errors:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {itemValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ValidationErrorAlert.propTypes = {
  editedData: PropTypes.object.isRequired,
  organizationConfig: PropTypes.object,
};

export default ValidationErrorAlert;
