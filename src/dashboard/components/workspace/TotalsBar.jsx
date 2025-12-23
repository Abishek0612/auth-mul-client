import PropTypes from "prop-types";

const TotalsBar = ({ totals }) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 mt-6 rounded-b-lg">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <span className="font-semibold text-gray-700">
          Totals ({totals.rows} rows)
        </span>
        {Object.entries(totals)
          .filter(([key]) => key !== "rows")
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

TotalsBar.propTypes = {
  totals: PropTypes.object.isRequired,
};

export default TotalsBar;
