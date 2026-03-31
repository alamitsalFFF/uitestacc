import { useCallback } from 'react';
import { useAuth } from "./AuthContext";

// export const useAuthFetch = () => {
//   const { showLoginModal } = useAuth();

//   const authFetch = async (url, options = {}) => {
//     const token = localStorage.getItem("userToken");
//     const headers = {
//       ...(options.headers || {}),
//       "Authorization": `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//     const response = await fetch(url, { ...options, headers });
//     if (response.status === 401) {
//       showLoginModal();
//     }
//     return response;
//   };

//   return authFetch;
// };

export const useAuthFetch = () => {
  const { showLoginModal } = useAuth(); // ดึง showLoginModal ออกมา

  // ใช้ useCallback เพื่อ memoize authFetch
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("userToken");
    const headers = {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      showLoginModal(); // showLoginModal ถูกใช้ที่นี่
    }
    return response;
  }, [showLoginModal]); // Dependency array: ใส่ showLoginModal เข้าไป

  return authFetch;
};
