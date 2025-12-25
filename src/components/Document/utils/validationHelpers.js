export const getValidationStatus = (item, validationResults) => {
  if (!validationResults || !validationResults.length) return null;
  if (!item.articleNo) return null;

  const result = validationResults.find(
    (r) => r.articleCode === item.articleNo
  );
  return result;
};

export const getFieldValidationError = (item, fieldKey, validationResults) => {
  if (!validationResults || !validationResults.length) return null;
  if (!item.articleNo) return null;

  const result = validationResults.find(
    (r) => r.articleCode === item.articleNo
  );
  if (!result || result.isValid) return null;

  const fieldMapping = {
    hsn: "HSN Code",
    eanNo: "EAN Code",
    baseCost: "Base Cost",
    igstPercent: "GST Percentage",
    cgstPercent: "GST Percentage",
    sgstPercent: "GST Percentage",
  };

  return result.mismatches?.find((m) => m.field === fieldMapping[fieldKey]);
};

export const formatValidationErrors = (validationResults) => {
  if (!validationResults || !validationResults.length) return [];

  const errors = [];
  validationResults.forEach((result) => {
    if (!result.isValid && result.mismatches) {
      result.mismatches.forEach((mismatch) => {
        errors.push(
          `For article code ${result.articleCode}, expected value of ${mismatch.field} is ${mismatch.expected}, actual value is ${mismatch.actual}`
        );
      });
    }
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((error) => {
        errors.push(`For article code ${result.articleCode}: ${error}`);
      });
    }
  });

  return errors;
};

export const isDescriptionField = (fieldKey) => {
  return ["itemName", "description"].includes(fieldKey);
};
