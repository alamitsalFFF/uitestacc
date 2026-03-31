import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../../api/url";
import { values } from "lodash";
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


export const RVfromSI = async (AccDocNo, DocRefNo, webAddressRV, navigate) => {
  console.log("AccDocNo:", AccDocNo);
  console.log("DocRefNo:", DocRefNo);
  console.log("webAddressRV:", webAddressRV);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const RVFromSI = {
      name: "Insert_RVFromSI",
      parameters: [
        {
          param: "invno",
          value: AccDocNo, // ใช้เลขที่ PI ที่ได้จาก API ก่อนหน้า
        },
        {
          param: "userid",
          value: "admin",
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
        //     param: "acccode",
        //     value: '',
        //   },
      ],
    };
    console.log("RVFromSI:", RVFromSI)
    const responseRVFromSI = await axios.post(
      StoredProcedures_Base,
      RVFromSI,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseRVFromSI.status === 200) {
      console.log(
        "RV Header created successfully from PI:",
        responseRVFromSI.data.data[0].EntryId
      );
      const entryId = responseRVFromSI.data.data[0].EntryId;
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
    console.error("Error creating SI Header:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง SI Header: " + error.message);
  }
};

