import React from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
// const navigate = useNavigate();

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
      API_VIEW_RESULT,
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


export const RVfromRC = async (accDocNo, docRefNo, acccode, webAddressRV, navigate) => {
  console.log("AccDocNo:", accDocNo);
  console.log("DocRefNo:", docRefNo);
  console.log("AccCode:", acccode);
  console.log("webAddressRV:", webAddressRV);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const RVFromRC = {
      name: "Insert_RVFromRC",
      parameters: [
        {
          param: "transno",
          value: accDocNo,
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "docdate",
          value: formattedDate,
        },
        {
          param: "acccode",
          value: acccode,
        },
        {
          param: "bankchg",
          value: 0,
        },
        {
          param: "rvno", // เลขที่เอกสาร RV เดิม
          value: '',
        },
      ],
    };
    console.log("RVFromRC:", RVFromRC)
    const responseRVFromRC = await axios.post(
      StoredProcedures_Base,
      RVFromRC,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseRVFromRC.status === 200) {
      console.log(
        "RV Header created successfully from RC:",
        responseRVFromRC.data.data[0].EntryId
      );
      const entryId = responseRVFromRC.data.data[0].EntryId;
      const entryIdtoString = entryId.toString();
      console.log("entryId0:", entryIdtoString);
      console.log("entryId1:", typeof entryIdtoString);
      const journalId = await fetchJournalNo(entryIdtoString);

      if (journalId) {
        Swal.fire({
          icon: "success",
          title: `Created RV: ${journalId}`, // แสดง JournalID
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate(`${URL}${webAddressRV}`);
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: `Created RV (Journal ID not found): ${journalId}`, // แจ้งเตือนถ้าไม่พบ JournalID
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  } catch (error) {
    console.error("Error creating RV Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง RV Header: " + error.message);
  }
};

