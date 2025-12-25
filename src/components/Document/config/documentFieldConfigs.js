export const getFieldConfig = (orgCode, documentType) => {
  const configs = {
    UBOARD: {
      name: "UBOARD",
      Invoice: {
        fields: [
          { key: "invoiceNumber", label: "Invoice Number", type: "text" },
          { key: "buyerOrderNo", label: "Buyer Order No", type: "text" },
          { key: "invoiceDate", label: "Invoice Date", type: "date" },
          { key: "buyerName", label: "Buyer Name", type: "text" },
          { key: "sellerName", label: "Seller Name", type: "text" },
          { key: "invoiceQty", label: "Invoice Qty", type: "number" },
          { key: "grossAmount", label: "Gross Amount", type: "number" },
          { key: "gstAmount", label: "GST Amount", type: "number" },
          { key: "totalAmount", label: "Total Amount", type: "number" },
        ],
        itemFields: [
          { key: "articleNo", label: "Article No.", type: "text" },
          { key: "itemName", label: "Item Name", type: "text" },
          { key: "hsn", label: "HSN", type: "text" },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "qtyUnit", label: "Unit", type: "text" },
          { key: "rate", label: "Rate", type: "number" },
          { key: "gstRate", label: "GST Rate", type: "text" },
          { key: "totalAmount", label: "Amount", type: "number" },
        ],
      },
      "Purchase Order": {
        fields: [
          { key: "poNumber", label: "PO Number", type: "text" },
          { key: "poDate", label: "PO Date", type: "date" },
          { key: "buyerName", label: "Buyer Name", type: "text" },
          { key: "sellerName", label: "Seller Name", type: "text" },
          { key: "deliveryDate", label: "Delivery Date", type: "date" },
          { key: "site", label: "Site", type: "text" },
          { key: "totalQty", label: "Total Qty", type: "number" },
          {
            key: "totalBasicValue",
            label: "Total Basic Value",
            type: "number",
          },
          { key: "totalIGST", label: "Total GST", type: "number" },
          {
            key: "totalOrderValue",
            label: "Total Order Value",
            type: "number",
          },
        ],
        itemFields: [
          { key: "articleNo", label: "Article No", type: "text" },
          { key: "hsn", label: "HSN", type: "text" },
          { key: "eanNo", label: "EAN No", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "baseCost", label: "Base Cost", type: "number" },
          { key: "igstPercent", label: "IGST%", type: "text" },
          { key: "igstValue", label: "IGST Value", type: "number" },
          { key: "cgstPercent", label: "CGST%", type: "text" },
          { key: "cgstValue", label: "CGST Value", type: "number" },
          { key: "sgstPercent", label: "SGST%", type: "text" },
          { key: "sgstValue", label: "SGST Value", type: "number" },
          { key: "totalBaseValue", label: "Total Base Value", type: "number" },
        ],
      },
      GRN: {
        fields: [
          { key: "grnNumber", label: "GRN Number", type: "text" },
          { key: "grnDate", label: "GRN Date", type: "date" },
          { key: "buyerName", label: "Buyer Name", type: "text" },
          { key: "sellerName", label: "Seller Name", type: "text" },
          { key: "vendorInvoiceNo", label: "Vendor Invoice No", type: "text" },
          { key: "grnQty", label: "GRN Qty", type: "number" },
          { key: "poNumber", label: "PO Number", type: "text" },
        ],
        itemFields: [
          { key: "articleNo", label: "Article No", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "ean", label: "EAN No.", type: "text" },
          { key: "challanQty", label: "Challan Qty", type: "number" },
          { key: "receivedQty", label: "Received Qty", type: "number" },
          { key: "acceptedQty", label: "Accepted Qty", type: "number" },
        ],
      },
      "Payment Advice": {
        fields: [
          { key: "documentNumber", label: "Document Number", type: "text" },
          { key: "buyerName", label: "Buyer Name", type: "text" },
          { key: "sellerName", label: "Seller Name", type: "text" },
          {
            key: "totalAmountSettled",
            label: "Total Amount Settled",
            type: "number",
          },
        ],
        itemFields: [
          { key: "invoiceNumber", label: "Invoice Number", type: "text" },
          { key: "invoiceAmount", label: "Invoice Amount", type: "number" },
          { key: "paymentAmount", label: "Payment Amount", type: "number" },
          { key: "tds", label: "TDS", type: "number" },
          { key: "gstTaxHold", label: "GST Tax Hold", type: "number" },
          { key: "gstTaxPaid", label: "GST Tax Paid", type: "number" },
          { key: "remarks", label: "Remarks", type: "text" },
        ],
      },
    },
    ELZA: {
      name: "ELZA",
      Invoice: {
        fields: [
          { key: "supplierName", label: "Supplier Name", type: "text" },
          { key: "invoiceNumber", label: "Invoice Number", type: "text" },
          { key: "invoiceDate", label: "Invoice Date", type: "date" },
          { key: "supplierGSTNo", label: "Supplier GST No", type: "text" },
          { key: "grossAmount", label: "Gross Amount", type: "number" },
          { key: "cgstAmount", label: "CGST Amount", type: "number" },
          { key: "sgstAmount", label: "SGST Amount", type: "number" },
          { key: "igstAmount", label: "IGST Amount", type: "number" },
          { key: "gstAmount", label: "Total GST Amount", type: "number" },
          { key: "totalAmount", label: "Total Amount", type: "number" },
        ],
        itemFields: [
          { key: "itemName", label: "Item Name", type: "text" },
          { key: "hsn", label: "HSN", type: "text" },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "qtyUnit", label: "Unit", type: "text" },
          { key: "rate", label: "Rate", type: "number" },
          { key: "gstRate", label: "GST Rate", type: "text" },
          { key: "totalAmount", label: "Amount", type: "number" },
        ],
      },
    },
    KIWI: {
      name: "KIWI",
      Invoice: {
        fields: [
          { key: "supplierName", label: "Supplier Name", type: "text" },
          { key: "invoiceNumber", label: "Invoice Number", type: "text" },
          { key: "invoiceDate", label: "Invoice Date", type: "date" },
          { key: "supplierGSTNo", label: "Supplier GST No", type: "text" },
          { key: "grossAmount", label: "Gross Amount", type: "number" },
          { key: "cgstAmount", label: "CGST Amount", type: "number" },
          { key: "sgstAmount", label: "SGST Amount", type: "number" },
          { key: "igstAmount", label: "IGST Amount", type: "number" },
          { key: "gstAmount", label: "Total GST Amount", type: "number" },
          { key: "totalAmount", label: "Total Amount", type: "number" },
        ],
        itemFields: [
          { key: "itemName", label: "Item Name", type: "text" },
          { key: "hsn", label: "HSN", type: "text" },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "qtyUnit", label: "Unit", type: "text" },
          { key: "rate", label: "Rate", type: "number" },
          { key: "gstRate", label: "GST Rate", type: "text" },
          { key: "totalAmount", label: "Amount", type: "number" },
        ],
      },
    },
  };

  const orgConfig = configs[orgCode] || configs["KIWI"];
  const docTypeConfig = orgConfig[documentType] || orgConfig["Invoice"];

  return {
    name: orgConfig.name,
    fields: docTypeConfig.fields,
    itemFields: docTypeConfig.itemFields,
  };
};
