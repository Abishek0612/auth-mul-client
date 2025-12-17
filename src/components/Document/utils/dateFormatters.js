export const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  if (dateValue instanceof Date) {
    return dateValue.toISOString().split("T")[0];
  }

  if (typeof dateValue === "string") {
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }

    if (dateValue.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const [day, month, year] = dateValue.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    if (dateValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [day, month, year] = dateValue.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  }

  return "";
};

export const displayDateValue = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB");
  }

  if (typeof value === "string") {
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split("-");
      return `${day}-${month}-${year}`;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB");
    }
  }

  return value;
};
