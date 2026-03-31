import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { StoredProcedures_Base, URL } from "../../api/url";
// const navigate = useNavigate();

export const DIfromPO = async (AccDocNoC, refno, navigate, duedate, authFetch, webAddress) => {
  console.log("AccDocNo:", AccDocNoC);
  console.log("refno:", refno);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const formData = {
      name: "Insert_DIFromPO",
      parameters: [
        { param: "pono", value: AccDocNoC },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: duedate },
        // ใช้ค่า refno ที่รับมาจาก Modal
        { param: "refno", value: refno },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: 0 }, //PO<DI
        { param: "qty", value: 0 },
        { param: "dno", value: "" },
        { param: "whcode", value: "" },
      ],
    };
    console.log("formData:", formData);

    const response = await axios.post(
      `${StoredProcedures_Base}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {

      // if (response.data && response.data.length > 0 && response.data[0] && response.data[0].AccDocNo) {
      console.log("DI Header create successfully");
      console.log("DI:", response.data.data[0].AccDocNo);
      // setPoNo(response.data.data.AccDocNo); // อัปเดต state AccDocNo
      Swal.fire({
        icon: "success",
        title: `Created DI: ${response.data.data[0].AccDocNo}`, // ใช้ค่า poNo จาก state
        showConfirmButton: false,
        timer: 2000,
        willClose: () => { // เพิ่ม willClose event
          // navigate('/uitestacc/DIList/');
          navigate(`${URL}${webAddress}`);
        }
      });
      //   navigate(`/uitestacc/POHeader?accDocNo=${response.data.data[0].PONo}`);
      // } else {
      //   console.error("Error: Invalid response data", response.data);
      //   alert("เกิดข้อผิดพลาด: ข้อมูลตอบกลับไม่ถูกต้อง");
      // }
    } else {
      console.error("Error creating DI Header:", response.status, response.statusText);
      alert(`สร้าง DI Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${response.status})`);
    }
  } catch (error) {
    console.error("Error creating DI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง DI Header: " + error.message);
  }

  return "";
};