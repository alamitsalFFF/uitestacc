import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../api/url";
// import { values } from "lodash";

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

export const DIfromPI = async (AccDocNo,refno, navigate) => {
  console.log("AccDocNo:", AccDocNo);
  console.log("AccDocNo:", typeof AccDocNo);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const DIfromPIData = {
      name: "Insert_DIfromPI",
      parameters: [
        {
          param: "pino",
          value: AccDocNo,
        },
        {
          param: "docdate",
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
    console.log("DIfromPI:", DIfromPIData);
    const responseDIfromPI = await axios.post(
      `${StoredProcedures_Base}`,
      DIfromPIData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseDIfromPI.status === 200) {
      console.log("DI Header created successfully:");
      console.log("DIfromPI1:", responseDIfromPI.data);
      console.log("DIfromPI2:", responseDIfromPI.data);
      console.log("DIfromPI4:", responseDIfromPI.data.data[0].AccDocNo);
      const DIDocNofromPI = responseDIfromPI.data.data[0].AccDocNo;
      Swal.fire({
        icon: "success",
        title: `Created DI: ${DIDocNofromPI}`, 
        showConfirmButton: false,
        timer: 3000,
      });
      setTimeout(() => {
        navigate(`/uitestacc/DIList/`);
      }, 3000);
    } else {
      console.error("Error creating DI Header:", responseDIfromPI.status, responseDIfromPI.statusText);
      alert(`สร้าง DI Header ไม่สำเร็จ กรุณาลองใหม่ (Status: ${responseDIfromPI.status})`);
    }
  } catch (error) {
    console.error("Error creating DI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง DI Header: " + error.message);
  }
      
    return "" ;
};
