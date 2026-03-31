import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../../api/url";
// const navigate = useNavigate();

export const SIfromSO = async (AccDocNo, navigate, duedate, webAddressSI) => {
  console.log("AccDocNo:", AccDocNo);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const SIFromSO = {
      name: "Insert_SIFromSO",
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
          param: "duedate",
          value: duedate, // ใช้ค่าวันที่ได้รับจาก Swal
        },
        {
          param: "pono",
          value: AccDocNo,
        },
        // {
        //   param: "invno",
        //   value: `${AccDocNo}`,
        // },
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
    console.log("SIFromSO:", SIFromSO);
    const responseSIFromSO = await axios.post(
      StoredProcedures_Base,
      SIFromSO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseSIFromSO.status === 200) {
      console.log("SI Header create successfully");
      console.log("SI:", responseSIFromSO.data.data[0].IVNo);
      Swal.fire({
        icon: "success",
        title: `Created SI: ${responseSIFromSO.data.data[0].IVNo}`, // ใช้ค่า SINo จาก state
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          // เพิ่ม willClose event
          navigate(`${URL}${webAddressSI}`);
          // navigate("/uitestacc/SIList/");
        },
      });
    } else {
      console.error(
        "Error creating SI Header:",
        responseSIFromSO.status,
        responseSIFromSO.statusText
      );
      alert(
        `สร้าง SI Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseSIFromSO.status})`
      );
    }
  } catch (error) {
    console.error("Error creating SI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง SI Header: " + error.message);
  }
};
