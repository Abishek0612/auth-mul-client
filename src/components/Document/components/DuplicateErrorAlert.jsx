import PropTypes from "prop-types";

const DuplicateErrorAlert = ({ duplicateError, isChecking }) => {
  if (isChecking) {
    return (
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
          <span className="text-yellow-800 text-sm">
            Checking for duplicates...
          </span>
        </div>
      </div>
    );
  }

  if (!duplicateError || !duplicateError.hasDuplicates) {
    return null;
  }

  return (
    <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-lg p-4">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-red-800 font-semibold text-base mb-2">
            File Duplicate Error
          </h4>
          <p className="text-red-700 text-sm leading-relaxed">
            This file is a duplicate based on Organization (
            {duplicateError.organizationCode}), Document Type (
            {duplicateError.documentType}), and Document Number (
            {duplicateError.documentNumber}).
          </p>
          <div className="mt-3">
            <p className="text-red-800 font-medium text-sm mb-2">
              Duplicate files found:
            </p>
            <ul className="space-y-1">
              {duplicateError.duplicates.map((duplicate) => (
                <li key={duplicate.id} className="text-red-700 text-sm">
                  • {duplicate.fileName} (Document: {duplicate.documentNumber},
                  Created: {new Date(duplicate.createdAt).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

DuplicateErrorAlert.propTypes = {
  duplicateError: PropTypes.shape({
    hasDuplicates: PropTypes.bool,
    duplicates: PropTypes.arrayOf(PropTypes.object),
    documentNumber: PropTypes.string,
    documentType: PropTypes.string,
    organizationCode: PropTypes.string,
  }),
  isChecking: PropTypes.bool,
};

export default DuplicateErrorAlert;
