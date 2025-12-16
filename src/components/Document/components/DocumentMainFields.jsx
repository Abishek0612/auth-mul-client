import PropTypes from "prop-types";
import { formatDateForInput, displayDateValue } from "../utils/dateFormatters";

const DocumentMainFields = ({
  fields,
  editedData,
  isEditing,
  onFieldChange,
  onSummaryFieldChange,
}) => {
  const summaryFields = [
    "grossAmount",
    "gstAmount",
    "totalAmount",
    "invoiceQty",
    "totalBasicValue",
    "totalIGST",
    "totalOrderValue",
    "totalQty",
    "grnQty",
    "totalAmountSettled",
    "cgstAmount",
    "sgstAmount",
    "igstAmount",
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => {
          const isSummaryField = summaryFields.includes(field.key);
          const hasSiteError =
            field.key === "site" &&
            editedData.site_validation &&
            !editedData.site_validation.isValid;

          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={isEditing ? field.type : "text"}
                className={`w-full px-4 py-2.5 border rounded-md ${
                  isEditing
                    ? hasSiteError
                      ? "border-red-500 bg-red-50"
                      : "border-blue-300"
                    : hasSiteError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } ${
                  isEditing && field.key !== "gstAmount"
                    ? "bg-white"
                    : hasSiteError
                    ? "bg-red-50"
                    : "bg-gray-50"
                } ${
                  isSummaryField && !isEditing
                    ? "font-semibold text-green-600"
                    : hasSiteError
                    ? "text-red-600 font-medium"
                    : ""
                }`}
                value={
                  isEditing && field.type === "date"
                    ? formatDateForInput(editedData[field.key])
                    : isEditing
                    ? editedData[field.key] || ""
                    : field.type === "date"
                    ? displayDateValue(editedData[field.key])
                    : editedData[field.key] || ""
                }
                onChange={(e) =>
                  isSummaryField
                    ? onSummaryFieldChange(field.key, e.target.value)
                    : onFieldChange(field.key, e.target.value, field.type)
                }
                readOnly={!isEditing || field.key === "gstAmount"}
              />
              {hasSiteError && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Invalid site code
                </p>
              )}
              {isSummaryField && (
                <p className="text-xs text-gray-500 mt-1">
                  {isEditing && field.key === "gstAmount"
                    ? "Auto-calculated"
                    : "Manual entry"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

DocumentMainFields.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  editedData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSummaryFieldChange: PropTypes.func.isRequired,
};

export default DocumentMainFields;
