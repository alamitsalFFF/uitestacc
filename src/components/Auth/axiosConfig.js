import axios from "axios";
import { API } from "../api/url";

const instance = axios.create({
  baseURL: `${API}`,
  headers: { "Content-Type": "application/json" }
});

// Interceptor สำหรับแนบ token อัตโนมัติ
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// เพิ่มฟังก์ชันสำหรับตั้ง handler เมื่อเจอ 401
let on401;
export const set401Handler = (handler) => { on401 = handler; };

// Interceptor สำหรับ response
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401 && typeof on401 === "function") {
      on401();
    }
    return Promise.reject(error);
  }
);

export default instance;
