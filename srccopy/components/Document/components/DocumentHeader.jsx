import PropTypes from "prop-types";

const DocumentHeader = ({
  documentName,
  currentStatus,
  onClose,
  goBackCallback,
}) => {
  const isApproved = currentStatus === "approved";

  return (
    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
      {goBackCallback ? (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
          onClick={goBackCallback}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Files
        </button>
      ) : (
        <div className="flex items-center space-x-4"></div>
      )}
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 cursor-pointer"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

DocumentHeader.propTypes = {
  documentName: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  goBackCallback: PropTypes.func,
};

export default DocumentHeader;
