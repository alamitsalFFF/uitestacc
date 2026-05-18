import axios from "../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../api/url";
import Swal from "sweetalert2";

// ดึง JournalNo จาก EntryId
const fetchJournalNo = async (entryIdtoString) => {
  try {
    const payload = {
      viewName: "vJournal_All",
      parameters: [{ field: "EntryId", value: `${entryIdtoString}` }],
      results: [
        { sourceField: "EntryId" },
        { sourceField: "JournalNo" },
      ],
    };
    const response = await axios.post(API_VIEW_RESULT, payload, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data?.length > 0) {
      return response.data[0].JournalNo;
    }
    return null;
  } catch (error) {
    console.error("fetchJournalNo error:", error);
    return null;
  }
};

/**
 * RVfromSIFull
 * สร้าง RV จาก SI (Sales Invoice) โดยเรียก Stored Procedure Insert_RVFromSI
 *
 * @param {string} AccDocNo  - SI Doc No (invno)
 * @param {string} taxno     - เลขใบเสร็จ/ใบหัก/บัตรประชาชน
 * @param {string} docdate   - วันที่รับเงิน
 * @param {string} rvno      - RV No (JournalNo ที่เปิดอยู่)
 */
export const RVfromSIFull = async (
  AccDocNo,
  taxno,
  docdate,
  rvno
) => {
  console.log("RVfromSI — AccDocNo:", AccDocNo);
  try {
    const payload = {
      name: "Insert_RVFromSI",
      parameters: [
        {
          param: "invno",
          value: AccDocNo,
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "taxno",
          value: taxno, // เลขใบเสร็จ/ใบหัก/บัตรประชาชน
        },
        {
          param: "docdate",
          value: docdate, // วันที่รับเงิน
        },
        {
          param: "rvno",
          value: rvno,
        },
      ],
    };

    console.log("Insert_RVFromSI payload:", payload);
    const response = await axios.post(StoredProcedures_Base, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      console.log("Insert_RVFromSI response:", response);
      const entryId = response.data.data[0].EntryId;
      const entryIdStr = entryId.toString();
      const RVNO = await fetchJournalNo(entryIdStr);

      if (RVNO) {
        Swal.fire({
          icon: "success",
          title: `Created RV: ${RVNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "สร้าง RV สำเร็จ",
          text: "ระบบบันทึกแล้ว",
          showConfirmButton: false,
          timer: 3000,
        });
      }

      return {
        data: { rvNo: entryId, rvNotoString: entryIdStr, rvAccDocNo: RVNO },
        raw: response.data,
      };
    } else {
      return { raw: response.data || response };
    }
  } catch (error) {
    console.error("RVfromSIFull error:", error);
    return { error: true, message: error.message, rawError: error };
  }
};
