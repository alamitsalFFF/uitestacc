import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { useNavigate } from "react-router-dom";
import { StoredProcedures_Base } from "../../api/url";

export const SOfromSR = async (AccDocNoC,refno, navigate) => {
  console.log("AccDocNo:", AccDocNoC);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const SOFromSR = {
      name: "Insert_SOFromSR",
      parameters: [
        {
          param: "srno",
          value: AccDocNoC,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "duedate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "refno",
          value: refno,
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        // {
        //   param: "itemno",
        //   value: 0,
        // },
        // {
        //   param: "pono",
        //   value: 0,
        // },
      ],
    };
    console.log("SOFromSR:", SOFromSR);
    const responseSOFromSR = await axios.post(
      StoredProcedures_Base,
      SOFromSR,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseSOFromSR.status === 200) {
      console.log("SO Header create successfully");
      console.log("SO:", responseSOFromSR.data.data[0].SONo);
      Swal.fire({
        icon: "success",
        title: `Created SO: ${responseSOFromSR.data.data[0].SONo}`, // ใช้ค่า PSNo จาก state
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          // เพิ่ม willClose event
          navigate(`/uitestacc/SOList/`);
        },
      });
    } else {
      console.error(
        "Error creating SO Header:",
        responseSOFromSR.status,
        responseSOFromSR.statusText
      );
      alert(
        `สร้าง SO Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseSOFromSR.status})`
      );
    }
  } catch (error) {
    console.error("Error creating SO Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง SO Header: " + error.message);
  }
};
