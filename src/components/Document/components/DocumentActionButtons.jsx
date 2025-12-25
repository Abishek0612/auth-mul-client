import PropTypes from "prop-types";

const DocumentActionButtons = ({
  isEditing,
  isApproved,
  isSaving,
  isApproving,
  onClose,
  onStartEditing,
  onSave,
  onApprove,
  documentName,
}) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50">
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          onClick={onClose}
          disabled={isSaving || isApproving}
        >
          Cancel
        </button>

        {isEditing ? (
          <button
            type="button"
            className={`px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } cursor-pointer`}
            onClick={onSave}
            disabled={isSaving || isApproving}
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={onStartEditing}
              disabled={isSaving || isApproving}
            >
              Edit {documentName}
            </button>

            {!isApproved && (
              <button
                type="button"
                className={`px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isApproving
                    ? "bg-green-400"
                    : "bg-green-600 hover:bg-green-700"
                } cursor-pointer`}
                onClick={onApprove}
                disabled={isSaving || isApproving}
              >
                {isApproving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Approving...
                  </span>
                ) : (
                  "Approve"
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

DocumentActionButtons.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isApproved: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isApproving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStartEditing: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  documentName: PropTypes.string.isRequired,
};

export default DocumentActionButtons;
