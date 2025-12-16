import PropTypes from "prop-types";

const GRNTable = ({ documents, onRowClick }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GRN Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GRN Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buyer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seller Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendor Invoice No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PO Number
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              GRN Qty
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => {
            const data = doc.extractedData || {};
            return (
              <tr
                key={doc.id}
                onClick={() => onRowClick(doc)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.grnNumber || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.grnDate || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.buyerName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.sellerName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.vendorInvoiceNo || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.poNumber || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {data.grnQty || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doc.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : doc.status === "pending-approval"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doc.status === "approved"
                      ? "Approved"
                      : doc.status === "pending-approval"
                      ? "Pending"
                      : "Rejected"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

GRNTable.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default GRNTable;
