import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { API_BASE, API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
import { useAuthFetch } from "../Auth/fetchConfig";
import { useEffect, useState } from "react";

const fetchJournalNo = async (entryIdtoString) => {
  console.log("EntryID:", entryIdtoString);
  try {
    const vPV_All = {
      viewName: "vPV_All",
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
      vPV_All,
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

export const DIfromPC = async (AccDocNo, refno, navigate, duedate, authFetch, webAddress) => {
  // const authFetch = useAuthFetch(); // Removed
  // const [ModuleMenu, setModuleMenu] = useState([]); // Removed
  // const [WebAddress, setWebAddress] = useState([]); // Removed
  // useEffect removed

  console.log("AccDocNo:", AccDocNo);
  console.log("AccDocNo:", typeof AccDocNo);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const DIfromPCData = {
      name: "Insert_DIfromPC",
      parameters: [
        {
          param: "pcno",
          value: AccDocNo,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "duedate",
          value: duedate, //ให้เลือกวันที่กำหนด
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
    console.log("DIfromPC:", DIfromPCData);
    const responseDIfromPC = await axios.post(
      `${StoredProcedures_Base}`,
      DIfromPCData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseDIfromPC.status === 200) {
      console.log("DI Header created successfully:");
      console.log("DIfromPC1:", responseDIfromPC.data);
      console.log("DIfromPC2:", responseDIfromPC.data);
      console.log("DIfromPC4:", responseDIfromPC.data.data[0].AccDocNo);
      const DIDocNofromPC = responseDIfromPC.data.data[0].AccDocNo;
      Swal.fire({
        icon: "success",
        title: `Created DI: ${DIDocNofromPC}`,
        showConfirmButton: false,
        timer: 3000,
      });
      setTimeout(() => {
        // navigate(`/uitestacc/DIList/`);
        navigate(`${URL}${webAddress}`);
      }, 3000);
    } else {
      console.error("Error creating DI Header:", responseDIfromPC.status, responseDIfromPC.statusText);
      alert(`สร้าง DI Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseDIfromPC.status})`);
    }
  } catch (error) {
    console.error("Error creating DI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง DI Header: " + error.message);
  }

  return "";
};
