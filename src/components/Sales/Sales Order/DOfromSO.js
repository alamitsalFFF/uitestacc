// import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../../api/url";
// import { values } from "lodash";

const fetchJournalNo = async (entryIdtoString) => {
  console.log("EntryID:", entryIdtoString);
  try {
    const vRV_All = {
      viewName: "vRV_All",
      parameters: [{ field: "EntryId", value: `${entryIdtoString}` }],
      results: [
        { sourceField: "EntryId" },
        { sourceField: "JournalNo" },
        { sourceField: "EntryDate" },
        { sourceField: "EffectiveDate" },
        { sourceField: "EntryBy" },
        { sourceField: "Description" },
        { sourceField: "TotalDebit" },
        { sourceField: "TotalCredit" },
        { sourceField: "Seq" },
        { sourceField: "AccCode" },
        { sourceField: "AccName" },
        { sourceField: "AccDesc" },
        { sourceField: "Debit" },
        { sourceField: "Credit" },
      ],
    };

    const response = await axios.post(
      `${API_VIEW_RESULT}`,
      vRV_All,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("JournalNo:", response);
      console.log("JournalNo:", response.data[0].JournalNo);
      return response.data[0].JournalNo;
    } else {
      console.error("Error fetching JournalNo:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching JournalNo:", error);
    return null;
  }
};

export const DOfromSO = async (AccDocNo,refno, navigate) => {
  //   const navigate = useNavigate();
  console.log("AccDocNo:", AccDocNo);
  console.log("AccDocNo:", typeof AccDocNo);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const DOFromSOData = {
      name: "Insert_DOFromSO",
      parameters: [
        {
          param: "sono",
          value: AccDocNo,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        // {
        //   param: "duedate",
        //   value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        // },
        {
          param: "refno",
          value: refno, // ส่งเลขSOเป็นเลขเเท็กเอกสาร
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        // {
        //   param: "costtype",
        //   value: 0,
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
        //   param: "dno",
        //   value: "",
        // },
      ],
    };
    console.log("DOFromSO:", DOFromSOData);
    const responseDOFromSO = await axios.post(
      `${StoredProcedures_Base}`,
      DOFromSOData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseDOFromSO.status === 200) {
      console.log("DO Header created successfully:");
      console.log("DOFromSO1:", responseDOFromSO);
      console.log("DOFromSO2:", responseDOFromSO.data);
      console.log("DOFromSO4:", responseDOFromSO.data.data[0].AccDocNo);
      const DODocNofromSO = responseDOFromSO.data.data[0].AccDocNo;
      Swal.fire({
        icon: "success",
        title: `Created DO: ${DODocNofromSO}`, // แสดง JournalID
        showConfirmButton: false,
        timer: 3000,
      });
      setTimeout(() => {
        navigate(`/uitestacc/DOList/`);
      }, 3000);
    } else {
      console.error("Error creating DO Header:", responseDOFromSO.status, responseDOFromSO.statusText);
      alert(`สร้าง DO Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseDOFromSO.status})`);
    }
  } catch (error) {
    console.error("Error creating DO Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง DO Header: " + error.message);
  }
      
    return "" ;
};
