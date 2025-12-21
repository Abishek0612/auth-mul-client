import axiosInstance from "./axiosConfig";

const workspaceService = {
  getPOWorkspace: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.site) params.append("site", filters.site);
    if (filters.buyer) params.append("buyer", filters.buyer);
    if (filters.seller) params.append("seller", filters.seller);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await axiosInstance.get(
      `/workspace/po?${params.toString()}`
    );
    return response.data;
  },

  getPODetails: async (poId) => {
    const response = await axiosInstance.get(`/workspace/po/${poId}`);
    return response.data;
  },

  getInvoiceWorkspace: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.buyer) params.append("buyer", filters.buyer);
    if (filters.seller) params.append("seller", filters.seller);
    if (filters.search) params.append("search", filters.search);

    const response = await axiosInstance.get(
      `/workspace/invoice?${params.toString()}`
    );
    return response.data;
  },

  getGRNWorkspace: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.buyer) params.append("buyer", filters.buyer);
    if (filters.seller) params.append("seller", filters.seller);
    if (filters.search) params.append("search", filters.search);

    const response = await axiosInstance.get(
      `/workspace/grn?${params.toString()}`
    );
    return response.data;
  },
};

export default workspaceService;
