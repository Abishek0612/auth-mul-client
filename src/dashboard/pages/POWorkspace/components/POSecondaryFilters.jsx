import PropTypes from "prop-types";

const POSecondaryFilters = ({ filters, onFilterChange, availableFilters }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Search PO No, Article, Description..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="md:col-span-1">
          <select
            value={filters.status || "All Statuses"}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.statuses?.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <select
            value={filters.buyer || "All Buyers"}
            onChange={(e) => onFilterChange({ buyer: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.buyers?.map((buyer) => (
              <option key={buyer} value={buyer}>
                {buyer}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <select
            value={filters.seller || "All Sellers"}
            onChange={(e) => onFilterChange({ seller: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.sellers?.map((seller) => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <select
            value={filters.site || "All Sites"}
            onChange={(e) => onFilterChange({ site: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {availableFilters.sites?.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

POSecondaryFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  availableFilters: PropTypes.object.isRequired,
};

export default POSecondaryFilters;
