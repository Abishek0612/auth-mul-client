import PropTypes from "prop-types";

const POLinesTab = ({ items }) => {
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
                HSN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                EAN No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Base Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                IGST%
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                IGST Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                CGST%
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                CGST Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                SGST%
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                SGST Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Total Base Value
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.hsn || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.eanNo || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{parseFloat(item.baseCost || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.igstPercent || "0"}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{parseFloat(item.igstValue || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.cgstPercent || "0"}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{parseFloat(item.cgstValue || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.sgstPercent || "0"}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{parseFloat(item.sgstValue || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ₹{parseFloat(item.totalBaseValue || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="13"
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

POLinesTab.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default POLinesTab;
