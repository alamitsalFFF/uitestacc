import React, { useState, useEffect } from 'react';
import { useAuthFetch } from '../../Auth/fetchConfig'; 
import { API_BASE } from '../../api/url'; 
import Swal from 'sweetalert2'; 

const DocConfig = ({ accDocType, onDocConfigFetched }) => {
  const authFetch = useAuthFetch();
  const [docConfigID, setDocConfigID] = useState(null); // State สำหรับเก็บ docConfigID ที่ดึงมาได้

  useEffect(() => {
    const fetchDocConfig = async () => {
      // ตรวจสอบว่ามี accDocType ก่อนเรียก API
      if (!accDocType) {
        setDocConfigID(null);
        if (onDocConfigFetched) {
          onDocConfigFetched(null); // ส่งค่า null กลับไปถ้า accDocType ไม่มี
        }
        return;
      }

      try {
        const response = await authFetch(
          `${API_BASE}/DocConfig/GetDocConfig?category=${accDocType}` // เปลี่ยนเป็น API ของคุณ
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("DocConfig API Data:", data);

        // สมมติว่า API คืนค่าเป็น Array และเราต้องการ docConfigID ของรายการแรก
        // หรือคุณอาจจะต้องวนลูปหา docConfigID ที่ตรงเงื่อนไข
        if (Array.isArray(data) && data.length > 0) {
          const configId = data[0].docConfigID; // ดึง docConfigID จากข้อมูลแรก
          setDocConfigID(configId);
          if (onDocConfigFetched) {
            onDocConfigFetched(configId); // ส่งค่า docConfigID กลับไปให้คอมโพเนนต์แม่
            console.log("Fetched Document Config ID:", configId);
          }
        } else {
          setDocConfigID(null); // ถ้าไม่มีข้อมูล
          if (onDocConfigFetched) {
            onDocConfigFetched(null);
          }
          console.warn(`No DocConfig found for accDocType: ${accDocType}`);
        }
      } catch (error) {
        console.error(`Error fetching DocConfig for accDocType ${accDocType}:`, error);
        setDocConfigID(null); // ในกรณีเกิดข้อผิดพลาด
        if (onDocConfigFetched) {
          onDocConfigFetched(null);
        }
        Swal.fire({
          icon: "error",
          title: "Error fetching document configuration",
          text: error.message || "Please try again later.",
        });
      }
    };

    fetchDocConfig();
  }, [accDocType, authFetch, onDocConfigFetched]); // Dependencies

  // คอมโพเนนต์นี้ไม่จำเป็นต้อง render อะไรออกมา
  // เพียงแค่ดึงข้อมูลและส่งกลับผ่าน callback prop
  return null;
};

export default DocConfig;