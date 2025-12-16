import PropTypes from "prop-types";

const InvoiceLinesTab = ({ items }) => {
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
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                HSN
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Unit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                GST Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Total Amount
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
                    {item.itemName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.hsn || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.qtyUnit || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{parseFloat(item.rate || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.gstRate || "0"}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ₹{parseFloat(item.totalAmount || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
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

InvoiceLinesTab.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InvoiceLinesTab;
