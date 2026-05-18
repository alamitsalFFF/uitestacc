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
 * PVfromPCFull
 * สร้าง PV จาก PC (Cheque Payment) โดยเรียก Stored Procedure Insert_PVFromPC
 *
 * @param {string} AccDocNoC  - PC Doc No (transno)
 * @param {string} docdate    - วันที่จ่ายเงิน
 * @param {string} acccode    - รหัสบัญชีเงินสดที่จ่าย
 * @param {string} bankchg    - ค่าธรรมเนียมธนาคาร
 * @param {string} pvno       - PV No (JournalNo ที่เปิดอยู่)
 * @param {string} accdebit   - รหัสบัญชี Debit
 */
export const PVfromPCFull = async (
  AccDocNoC,
  docdate,
  acccode,
  bankchg,
  pvno,
  accdebit
) => {
  console.log("PVfromPC — AccDocNoC:", AccDocNoC);
  try {
    const payload = {
      name: "Insert_PVFromPC",
      parameters: [
        {
          param: "transno",
          value: AccDocNoC,
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "docdate",
          value: docdate, // วันที่จ่ายเงิน
        },
        {
          param: "acccode",
          value: acccode, // รหัสบัญชีเงินสดที่จ่าย
        },
        {
          param: "bankchg",
          value: bankchg, // ค่าธรรมเนียมธนาคาร/bank charges
        },
        {
          param: "pvno",
          value: pvno,
        },
        {
          param: "accdebit",
          value: accdebit, // รหัสบัญชีค่าใช้จ่าย/รายได้
        },
      ],
    };

    console.log("Insert_PVFromPC payload:", payload);
    const response = await axios.post(StoredProcedures_Base, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      console.log("Insert_PVFromPC response:", response);
      const entryId = response.data.data[0].EntryId;
      const entryIdStr = entryId.toString();
      const PVNO = await fetchJournalNo(entryIdStr);

      if (PVNO) {
        Swal.fire({
          icon: "success",
          title: `Created PV: ${PVNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "สร้าง PV สำเร็จ",
          text: "ระบบบันทึกแล้ว",
          showConfirmButton: false,
          timer: 3000,
        });
      }

      return {
        data: { pvNo: entryId, pvNotoString: entryIdStr, pvAccDocNo: PVNO },
        raw: response.data,
      };
    } else {
      return { raw: response.data || response };
    }
  } catch (error) {
    console.error("PVfromPCFull error:", error);
    return { error: true, message: error.message, rawError: error };
  }
};
