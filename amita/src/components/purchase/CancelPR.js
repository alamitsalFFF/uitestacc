import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { API_BASE, StoredProcedures } from "../api/url";

export const CancelPR = async (AccDocNoC, navigate) => {
  // แสดงกล่องข้อความให้กรอกเหตุผลการยกเลิก
  const { value: cancelReason } = await Swal.fire({
    title: `ยืนยันการยกเลิก ${AccDocNoC}`,
    text: "กรุณาใส่เหตุผลในการยกเลิกเอกสารนี้",
    input: "textarea",
    // inputLabel: "เหตุผลการยกเลิก",
    inputPlaceholder: "ใส่เหตุผลของคุณที่นี่...",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    confirmButtonColor: "#d33", 
    cancelButtonText: "ยกเลิก",
    inputValidator: (value) => {
      if (!value) {
        return "กรุณาใส่เหตุผล";
      }
    },
  });

  // ถ้าผู้ใช้กรอกเหตุผลและกด "ยืนยัน"
  if (cancelReason) {
    try {
      const userID = localStorage.getItem("userName") || "";

      // สร้าง payload สำหรับการยกเลิก PR
      const payload = {
        name: "CancelPR",
        parameters: [
          {
            param: "prno",
            value: AccDocNoC,
          },
          {
            param: "cancelby",
            value: userID,
          },
          {
            param: "cancelreason",
            value: cancelReason, // ใช้ค่าจาก SweetAlert2
          },
        ],
      };

      console.log("Canceling PR with payload:", payload);

      const response = await axios.post(
        `${API_BASE}${StoredProcedures}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200) {
        const prno = response.data.data[0].DocNo;
        console.log("CancelPR created successfully:", response);
        console.log("CancelPR created successfully:", prno);
        Swal.fire({
          icon: "success",
          title: `ยกเลิกเอกสาร ${prno} เรียบร้อยแล้ว`,
          showConfirmButton: false,
          timer: 3000,
        });

        // นำทางผู้ใช้กลับไปที่หน้ารายการหลังจาก 3 วินาที
        setTimeout(() => {
          navigate(`/uitestacc/PRList/`);
        }, 3000);
      } else {
        console.error("Error creating CancelPR:", response.status, response.statusText);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `ไม่สามารถยกเลิกเอกสารได้ (Status: ${response.status})`,
        });
      }
    } catch (error) {
      console.error("Error creating CancelPR:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้: " + error.message,
      });
    }
  }
};
     
      