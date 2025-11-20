import axiosInstance from "@/axiosInstance";

export const createOrder = async (orderPayload) => {
  return await axiosInstance.post(`/student/order/create`, orderPayload);
};

export const captureAndFinalizePayment = async (
  paymentId,
  payerId,
  orderId
) => {
  return await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });
};
