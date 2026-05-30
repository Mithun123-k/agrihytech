import API from "../../services/axios";

// 🔹 Send OTP
export const sendOtpAPI = (data) => {
  return API.post("/auth/send-otp", data);
};

// 🔹 Verify OTP
export const verifyOtpAPI = (data) => {
  return API.post("/auth/verify-otp", data);
};

// 🔹 Register B2B
export const registerB2BAPI = (data) => {
  return API.post("/auth/register-b2b", data);
};

// 🔹 Get current user
export const getMeAPI = () => {
  return API.get("/auth/me");
};

export const updateProfileAPI = (data) => {
  return API.put("/auth/me/update", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


// 🔥 REQUEST ACCOUNT DELETE
export const requestAccountDeletionAPI = (
  data
) => {

  return API.post(
    "/auth/request-delete-account",
    data
  );
};