import PropTypes from "prop-types";
import {
  getValidationStatus,
  getFieldValidationError,
  isDescriptionField,
} from "../utils/validationHelpers";

const DocumentItemsTable = ({
  itemFields,
  items,
  editedData,
  isEditing,
  onItemChange,
  onAddItem,
  onRemoveItem,
  organizationConfig,
}) => {
  const shouldShowValidation = () => {
    return (
      editedData.organization?.code === "UBOARD" &&
      (editedData.documentType === "Purchase Order" ||
        organizationConfig?.fields.some((f) => f.key === "poNumber"))
    );
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900 text-lg">Items</h4>
        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Item
          </button>
        )}
      </div>

      <div className="border rounded-lg shadow-sm">
        <div
          className="table-container"
          style={{
            maxHeight: "400px",
            position: "relative",
            overflow: "auto",
          }}
        >
          <table className="min-w-full divide-y divide-gray-200 relative table-auto">
            <thead>
              <tr>
                {itemFields.map((field, index) => (
                  <th
                    key={field.key}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50 sticky-header ${
                      index === 0
                        ? "sticky-column left-0 z-40 w-[180px]"
                        : isDescriptionField(field.key)
                        ? "whitespace-nowrap description-field"
                        : "whitespace-nowrap max-w-xs"
                    }`}
                    style={
                      index === 0
                        ? {
                            position: "sticky",
                            left: 0,
                            top: 0,
                            zIndex: 40,
                            backgroundColor: "#f9fafb",
                            boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                          }
                        : {
                            position: "sticky",
                            top: 0,
                            zIndex: 30,
                            backgroundColor: "#f9fafb",
                          }
                    }
                  >
                    {field.label}
                  </th>
                ))}
                {isEditing && (
                  <th
                    scope="col"
                    className="sticky top-0 z-30 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50 sticky-header"
                    style={{
                      minWidth: "80px",
                      position: "sticky",
                      top: 0,
                      zIndex: 30,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const validationResult = shouldShowValidation()
                    ? getValidationStatus(item, editedData.validation_results)
                    : null;
                  const isItemInvalid =
                    validationResult && !validationResult.isValid;

                  return (
                    <tr
                      key={index}
                      className={`${isEditing ? "hover:bg-gray-50" : ""} ${
                        isItemInvalid ? "bg-red-50" : ""
                      }`}
                    >
                      {itemFields.map((field, fieldIndex) => {
                        const validationError = shouldShowValidation()
                          ? getFieldValidationError(
                              item,
                              field.key,
                              editedData.validation_results
                            )
                          : null;

                        return (
                          <td
                            key={field.key}
                            className={`px-4 py-3 text-sm border-r border-gray-200 relative group ${
                              fieldIndex === 0
                                ? "sticky-column left-0 bg-white z-20 w-[180px]"
                                : isDescriptionField(field.key)
                                ? "description-field"
                                : "max-w-xs"
                            } ${
                              isItemInvalid && fieldIndex === 0
                                ? "bg-red-50"
                                : ""
                            }`}
                            style={
                              fieldIndex === 0
                                ? {
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 20,
                                    backgroundColor: isItemInvalid
                                      ? "#fef2f2"
                                      : "white",
                                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                                  }
                                : {}
                            }
                          >
                            {isEditing ? (
                              <input
                                type={field.type}
                                className={`w-full px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                  validationError
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                } ${
                                  isDescriptionField(field.key)
                                    ? "min-w-[250px]"
                                    : ""
                                }`}
                                value={item[field.key] || ""}
                                onChange={(e) =>
                                  onItemChange(index, field.key, e.target.value)
                                }
                              />
                            ) : (
                              <span
                                className={`block text-sm break-words ${
                                  validationError
                                    ? "text-red-600 font-medium"
                                    : "text-gray-900"
                                } ${fieldIndex === 0 ? "font-medium" : ""}`}
                              >
                                {[
                                  "totalAmount",
                                  "rate",
                                  "discountAmount",
                                  "baseCost",
                                  "igstValue",
                                  "cgstValue",
                                  "sgstValue",
                                  "totalBaseValue",
                                  "acceptedQty",
                                  "challanQty",
                                  "receivedQty",
                                  "invoiceAmount",
                                  "paymentAmount",
                                  "tds",
                                  "gstTaxHold",
                                  "gstTaxPaid",
                                ].includes(field.key) && item[field.key]
                                  ? parseFloat(item[field.key]).toFixed(2)
                                  : item[field.key] || "-"}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {isEditing && (
                        <td
                          className="px-4 py-3 text-center border-r border-gray-200"
                          style={{ minWidth: "80px" }}
                        >
                          <button
                            type="button"
                            onClick={() => onRemoveItem(index)}
                            className="inline-flex items-center justify-center p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={itemFields.length + (isEditing ? 1 : 0)}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

DocumentItemsTable.propTypes = {
  itemFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editedData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onItemChange: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  organizationConfig: PropTypes.object,
};

export default DocumentItemsTable;
