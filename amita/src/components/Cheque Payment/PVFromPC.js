import React from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
// const navigate = useNavigate();

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
        { sourceField: "AdjustNo" },
        { sourceField: "CancelBy" },
        { sourceField: "CancelReason" },
        { sourceField: "CancelDate" },
        { sourceField: "TransType" },
        { sourceField: "TransNo" },
        { sourceField: "TransReceipt" },
        { sourceField: "TransDetail" },
      ],
    };

    const response = await axios.post(
      API_VIEW_RESULT,
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


export const PVfromPC = async (accDocNo, docRefNo, acccode, navigate) => {
  console.log("AccDocNo:", accDocNo);
  console.log("DocRefNo:", docRefNo);
  console.log("AccCode:", acccode);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PVFromPC = {
      name: "Insert_PVFromPC",
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
          param: "bankchg", //รอถามพี่โบ๊ท
          value: 0,
        },
        {
          param: "pvno", // เลขที่เอกสาร PV เดิม
          value: '',
        },
        {
          param: "accdebit", //รอถามพี่โบ๊ท
          value: '',
        },
      ],
    };
    console.log("PVFromPC:", PVFromPC)
    const responsePVFromPC = await axios.post(
      StoredProcedures_Base,
      PVFromPC,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePVFromPC.status === 200) {
      console.log(
        "PV Header created successfully from PI:",
        responsePVFromPC.data.data[0].EntryId
      );
      const entryId = responsePVFromPC.data.data[0].EntryId;
      const entryIdtoString = entryId.toString();
      console.log("entryId0:", entryIdtoString);
      console.log("entryId1:", typeof entryIdtoString);
      const journalId = await fetchJournalNo(entryIdtoString);

      if (journalId) {
        Swal.fire({
          icon: "success",
          title: `Created PV: ${journalId}`, // แสดง JournalID
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate(`${URL}PaymentVoucher/`);
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: `Created PV (Journal ID not found): ${journalId}`, // แจ้งเตือนถ้าไม่พบ JournalID
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  } catch (error) {
    console.error("Error creating PC Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PC Header: " + error.message);
  }
};

