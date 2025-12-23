import PropTypes from "prop-types";

const POSummaryStrip = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-blue-600">
          {summary.totalPOs}
        </div>
        <div className="text-sm text-blue-600 font-medium">Total POs</div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-yellow-600">{summary.open}</div>
        <div className="text-sm text-yellow-600 font-medium">Open</div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-orange-600">
          {summary.partiallyInvoiced}
        </div>
        <div className="text-sm text-orange-600 font-medium">
          Partially Invoiced
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-green-600">
          {summary.fullyInvoiced}
        </div>
        <div className="text-sm text-green-600 font-medium">Fully Invoiced</div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-3xl font-bold text-red-600">
          {summary.overInvoiced}
        </div>
        <div className="text-sm text-red-600 font-medium">Over Invoiced</div>
      </div>
    </div>
  );
};

POSummaryStrip.propTypes = {
  summary: PropTypes.shape({
    totalPOs: PropTypes.number.isRequired,
    open: PropTypes.number.isRequired,
    partiallyInvoiced: PropTypes.number.isRequired,
    fullyInvoiced: PropTypes.number.isRequired,
    overInvoiced: PropTypes.number.isRequired,
  }).isRequired,
};

export default POSummaryStrip;
