import API from "../../services/axios";

// GET ALL PLANS
export const getPlansAPI = () => {
  return API.get("/subscription");
};

// CREATE ORDER
export const createOrderAPI = (data) => {
  return API.post(
    "/subscription/create-order",
    data
  );
};

// VERIFY PAYMENT
export const verifyPaymentAPI = (data) => {
  return API.post(
    "/subscription/verify-payment",
    data
  );
};

// ACTIVATE TRIAL
export const activateTrialAPI = () => {
  return API.post(
    "/subscription/skip-trial"
  );
};

// ADMIN PLAN MANAGEMENT
export const getAdminPlansAPI = () => API.get('/subscription');

export const saveAdminPlanAPI = (plan, id) => id
  ? API.put(`/subscription/${id}`, plan)
  : API.post('/subscription/create', plan);

export const deleteAdminPlanAPI = id => API.delete(`/subscription/${id}`);
