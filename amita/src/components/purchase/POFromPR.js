import React from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { values } from "lodash";
import { useNavigate } from 'react-router-dom';
import { StoredProcedures_Base } from "../api/url";

export const POfromPR = async (AccDocNo, refno, navigate) => {
  console.log("AccDocNo:", AccDocNo);
  console.log("refno:", refno);
  console.log("navigate:", navigate);
  console.log("typeof navigate:", typeof navigate); 
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const POFromPR = {
      name: "Insert_POFromPR",
      parameters: [
        {
          param: "prno",
          value: AccDocNo,
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
          value: "admin",
        },
        // {
        //   param: "itemno",
        //   value: 0,
        // },
        // {
        //   param: "pono",
        //   value: 0,
        // },
        {
          param: "closedoc",
          value: 0,
        },
      ],
    };
    console.log("POFromPR:",POFromPR)
    const responsePOFromPR = await axios.post(
        StoredProcedures_Base,
        POFromPR,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (responsePOFromPR.status === 200) {
     
               console.log("PO Header create successfully");
               console.log("PO:", responsePOFromPR);
               console.log("PO:", responsePOFromPR.data.data[0].PONo);
               Swal.fire({
                 icon: "success",
                 title: `Created PO: ${responsePOFromPR.data.data[0].PONo}`, // ใช้ค่า PRNo จาก state
                 showConfirmButton: false,
                 timer: 3000,
                //  willClose: () => { // เพิ่ม willClose event
                //     navigate(`/uitestacc/ListPOHD/`); 
                //   }
               });
               setTimeout(() => {
                 navigate(`/uitestacc/POList/`);
                }, 3000);
           } else {
             console.error("Error creating PO Header:", responsePOFromPR.status, responsePOFromPR.statusText);
             alert(`สร้าง PO Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responsePOFromPR.status})`);
           }
         } catch (error) {
           console.error("Error creating PO Header:", error);
           alert("เกิดข้อผิดพลาดในการสร้าง PO Header: " + error.message);
         }
       };
     
      