import React from "react";
import Swal from "sweetalert2";
import axios from "../../components/Auth/axiosConfig";
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


export const PVfromPI = async (AccDocNo, DocRefNo, navigate, webAddressPV) => {
  console.log("AccDocNo:", AccDocNo);
  console.log("DocRefNo:", DocRefNo);
  console.log("webAddressPV:", webAddressPV);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PVFromPI = {
      name: "Insert_PVFromPI",
      parameters: [
        {
          param: "invno",
          value: AccDocNo, // ใช้เลขที่ PI ที่ได้จาก API ก่อนหน้า
        },
        {
          param: "userid",
          // value: "admin",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "taxno",
          value: `${DocRefNo}`,
          // value: `TEX-01`,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        //   {
        //     param: "pvno",
        //     value: '',
        //   },
        //   {
        //     param: "accdebit", //รอถามพี่โบ๊ท
        //     value: '',
        //   },
        //     param: "acccredit", //รอถามพี่โบ๊ท
        //     value: '',
        //   },
      ],
    };
    console.log("PVFromPI:", PVFromPI)
    const responsePVFromPI = await axios.post(
      StoredProcedures_Base,
      PVFromPI,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePVFromPI.status === 200) {
      console.log(
        "PV Header created successfully from PI:",
        responsePVFromPI.data.data[0].EntryId
      );
      const entryId = responsePVFromPI.data.data[0].EntryId;
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
          navigate(`${URL}${webAddressPV}`);
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
    console.error("Error creating PI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PI Header: " + error.message);
  }
};

