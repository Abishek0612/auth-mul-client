import PropTypes from "prop-types";

const GRNLinesTab = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Article No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                EAN
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Challan Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Received Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Accepted Qty
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.articleNo || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.ean || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.challanQty || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.receivedQty || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {item.acceptedQty || "0"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No line items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

GRNLinesTab.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GRNLinesTab;
