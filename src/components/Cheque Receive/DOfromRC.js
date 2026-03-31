import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { API_BASE, API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";
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

export const DOfromRC = async (accDocNo, refno, navigate, duedate, authFetch, webAddress) => {
  // const authFetch = useAuthFetch(); // Removed
  // const [ModuleMenu, setModuleMenu] = useState([]); // Removed
  // const [WebAddress, setWebAddress] = useState([]); // Removed
  // useEffect removed

  console.log("AccDocNo:", accDocNo);
  console.log("AccDocNo:", typeof accDocNo);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const DOFromRCData = {
      name: "Insert_DOFromRC",
      parameters: [
        {
          param: "rcno",
          value: accDocNo,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "duedate",
          value: duedate, // Use passed duedate
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
        //   param: "qty",
        //   value: 0,
        // },
        // {
        //   param: "dno",
        //   value: "",
        // },
      ],
    };
    console.log("DOFromRC:", DOFromRCData);
    const responseDOFromRC = await axios.post(
      `${StoredProcedures_Base}`,
      DOFromRCData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseDOFromRC.status === 200) {
      console.log("DO Header created successfully:");
      console.log("DOFromRC1:", responseDOFromRC.data);
      console.log("DOFromRC2:", responseDOFromRC.data);
      console.log("DOFromRC4:", responseDOFromRC.data.data[0].AccDocNo);
      const DODocNofromRC = responseDOFromRC.data.data[0].AccDocNo;
      Swal.fire({
        icon: "success",
        title: `Created DO: ${DODocNofromRC}`, // แสดง JournalID
        showConfirmButton: false,
        timer: 3000,
      });
      setTimeout(() => {
        // navigate(`/uitestacc/DOList/`);
        navigate(`${URL}${webAddress}`);
      }, 3000);
    } else {
      console.error("Error creating DO Header:", responseDOFromRC.status, responseDOFromRC.statusText);
      alert(`สร้าง DO Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseDOFromRC.status})`);
    }
  } catch (error) {
    console.error("Error creating DO Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง DO Header: " + error.message);
  }

  return "";
};
