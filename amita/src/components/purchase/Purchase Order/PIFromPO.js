import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { StoredProcedures_Base, URL } from "../../api/url";
// const navigate = useNavigate();

export const PIfromPO = async (AccDocNoC, navigate) => {
  console.log("AccDocNo:", AccDocNoC);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PIFromPO = {
      name: "Insert_PIFromPO",
      parameters: [
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "pono",
          value: AccDocNoC,
        },
        {
          param: "invno",
          value: `${AccDocNoC}`,
        },
        // {
        //   param: "itemno",
        //   value: 0,
        // },
        // {
        //   param: "qty",
        //   value: 0,
        // },
        // {
        //   param: "docno",
        //   value: '',
        // },
      ],
    };
    console.log("PIFromPO:", PIFromPO)
    const responsePIFromPO = await axios.post(
      StoredProcedures_Base,
      PIFromPO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePIFromPO.status === 200) {

      // if (responsePIFromPO.data && responsePIFromPO.data.length > 0 && responsePIFromPO.data[0] && responsePIFromPO.data[0].PONo) {
      console.log("PI:", responsePIFromPO);
      console.log("PI Header create successfully");
      console.log("PI:", responsePIFromPO.data.data[0].PINo);
      // setPoNo(responsePIFromPO.data.data.PONo); // อัปเดต state poNo
      Swal.fire({
        icon: "success",
        title: `Created PI: ${responsePIFromPO.data.data[0].PINo}`, // ใช้ค่า poNo จาก state
        showConfirmButton: false,
        timer: 3000,
        willClose: () => { // เพิ่ม willClose event
          navigate(`${URL}PIList`);
        }
      });
      //    navigate(`/uitestacc/PIHeader?accDocNo=${responsePIFromPO.data.data[0].PINo}`);
      //  } else {
      //    console.error("Error: Invalid responsePIFromPO data", responsePIFromPO.data);
      //    alert("เกิดข้อผิดพลาด: ข้อมูลตอบกลับไม่ถูกต้อง");
      //  }
    } else {
      console.error("Error creating PI Header:", responsePIFromPO.status, responsePIFromPO.statusText);
      alert(`สร้าง PI Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responsePIFromPO.status})`);
    }
  } catch (error) {
    console.error("Error creating PI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PI Header: " + error.message);
  }
};

