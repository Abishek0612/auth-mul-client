import axiosInstance from "./axiosConfig";

class WorkspaceService {
  async getPOWorkspace(params) {
    const response = await axiosInstance.get("/workspace/po", { params });
    return response.data;
  }

  async getInvoiceWorkspace(params) {
    const response = await axiosInstance.get("/workspace/invoice", { params });
    return response.data;
  }

  async getGRNWorkspace(params) {
    const response = await axiosInstance.get("/workspace/grn", { params });
    return response.data;
  }

  async getPODetails(poId) {
    const response = await axiosInstance.get(`/workspace/po/${poId}`);
    return response.data;
  }

  async getInvoiceDetails(invoiceId) {
    const response = await axiosInstance.get(`/workspace/invoice/${invoiceId}`);
    return response.data;
  }

  async getGRNDetails(grnId) {
    const response = await axiosInstance.get(`/workspace/grn/${grnId}`);
    return response.data;
  }
}

export default new WorkspaceService();
