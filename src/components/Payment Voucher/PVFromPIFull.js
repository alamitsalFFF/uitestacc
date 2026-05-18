import axios from "../../components/Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
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
 * PVfromPIFull
 * สร้าง PV จาก PI (Payment Invoice) โดยเรียก Stored Procedure Insert_PVFromPI
 *
 * @param {string}   AccDocNoC  - PI Doc No
 * @param {string}   taxno      - DocRef No / เลขใบเสร็จ
 * @param {string}   docdate    - Due Date (YYYY-MM-DD)
 * @param {string}   pvno       - PV No ที่ต้องการ Choose เข้าไป (เลข JournalNo)
 * @param {string}   acccode    - รหัสบัญชีเครดิต (เงินสดที่จ่าย) → acccredit
 * @param {string}   accdebit   - รหัสบัญชี Debit
 * @param {string}   webAddress - unused (ส่งว่างเพื่อไม่ redirect)
 * @param {fn}       navigate   - unused (ส่ง no-op เพื่อไม่ redirect)
 */
export const PVfromPIFull = async (
  AccDocNoC,
  taxno,
  docdate,
  pvno,
  acccode,
  accdebit,
  webAddress = "",
  navigate = () => { }
) => {
  console.log("PVfromPI — AccDocNoC:", AccDocNoC);
  try {
    const payload = {
      name: "Insert_PVFromPI",
      parameters: [
        {
          param: "invno",
          value: AccDocNoC,
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
          value: docdate, // วันที่จ่ายเงิน
        },
        {
          param: "pvno",
          value: pvno,
        },
        {
          param: "acccredit",
          value: acccode, // รหัสบัญชีเงินสดที่จ่าย
        },
        {
          param: "accdebit",
          value: accdebit, // รหัสบัญชีค่าใช้จ่าย/รายได้
        },
      ],
    };

    console.log("Insert_PVFromPI payload:", payload);
    const response = await axios.post(StoredProcedures_Base, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      console.log("Insert_PVFromPI response:", response);
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
          text: "ระบบบันทึกแล้ว แต่ไม่พบหมายเลข PV ในผลตอบกลับ",
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
    console.error("PVfromPIFull error:", error);
    return { error: true, message: error.message, rawError: error };
  }
};
