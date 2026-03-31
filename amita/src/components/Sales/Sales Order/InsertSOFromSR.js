import axios from "../../Auth/axiosConfig"; 
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createSOHeaderAndFirstItem1 = async (AccDocNo, firstItemNo) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const SOFromSR = {
      name: "Insert_SOFromSR", // ชื่อ Stored Procedure
      parameters: [
        { param: "srno", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo }, 
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
      ],
    };
    console.log("Calling Insert_SOFromSR with first item:", SOFromSR);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      SOFromSR,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200 && response.data.data && response.data.data[0].SONo) {
      return response.data.data[0].SONo; // คืนค่า SONo ที่สร้างได้
    } else {
      throw new Error(`Failed to create SO Header and first item: ${response.statusText || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error creating SO Header and first item:", error);
    throw error;
  }
};

// --- ฟังก์ชันสำหรับเพิ่ม Detail Item เข้าไปใน SO เดิม ---
export const addSODetailToExistingSOFromSR = async ( srNo_selected,currentSONo,itemNo_from_sr) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_SOFromSR", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [
        { param: "srno", value: srNo_selected },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: srNo_selected  },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo_from_sr  },
        { param: "sono", value: currentSONo  },
    ],
    };
    console.log("Calling SP Insert_SOFromSR:", requestBody);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to add SO detail for item ${itemNo_from_sr}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding SO detail for item ${itemNo_from_sr}:`, error);
    throw error;
  }
};

// --- API สำหรับดึงรายการ SR ที่ยังไม่ถูกใช้ (Balance > 0) ---
// ฟังก์ชันนี้จะดึง SR ทั้งหมดที่มี Balance > 0 เพื่อให้ผู้ใช้เลือก SR Number ก่อน
export const getAvailableSRs = async () => {
  try {
    const requestBody = {
      viewName: "vSR_Balance", // ใช้ view เดิม
      parameters: [], // ไม่ต้องมี AccDocNo ในครั้งแรก เพื่อดึง SR ทั้งหมด
      results: [
        // เพิ่ม AccDocNo เพื่อให้สามารถเลือก SR Number ได้
        { sourceField: "AccDocNo" },
        { sourceField: "AccBatchDate" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "PartyName" },
        { sourceField: "SalesDescription" },
        { sourceField: "AccItemNo" },
        { sourceField: "Qty" },
        { sourceField: "Price" },
        { sourceField: "Balance" },
      ],
    };
    const response = await axios.post(
      `${API_BASE}/View/GetViewResult/`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 && response.data) {
      // กรองเฉพาะ SR ที่มี Balance > 0 และ AccDocNo ไม่ซ้ำกัน
      const filteredSRs = response.data.filter(
        (item) => Number(item.Balance) > 0
      );

      // ดึงเฉพาะ AccDocNo ที่ไม่ซ้ำกันออกมา
      const uniqueSRNumbers = [...new Set(filteredSRs.map((item) => item.AccDocNo))];

      console.log("Fetched available SR numbers:", uniqueSRNumbers);
      return uniqueSRNumbers; // คืนค่ารายการ AccDocNo ของ SR ที่มี Balance > 0
    } else {
      console.error(
        "Error fetching available SRs:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching available SRs:", error);
    return [];
  }
};

// --- API สำหรับดึงรายการ Item ของ SR ที่เลือก (Balance > 0) ---
// srNo: คือ SR Number ที่ผู้ใช้เลือกจาก Modal แรก
export const getItemsFromSelectedSR = async (srNo) => {
  try {
    const requestBody = {
      viewName: "vSR_Balance",
      parameters: [
        {
          field: "AccDocNo",
          value: srNo,
        },
      ],
      results: [
        // เพิ่ม field ทั้งหมดที่จำเป็นตามที่คุณมีใน vSR_Balance
        { sourceField: "AccDocNo" },
        { sourceField: "AccBatchDate" },
        { sourceField: "AccEffectiveDate" },
        { sourceField: "PartyCode" },
        { sourceField: "PartyTaxCode" },
        { sourceField: "PartyName" },
        { sourceField: "PartyAddress" },
        { sourceField: "IssueBy" },
        { sourceField: "AccDocType" },
        { sourceField: "AccPostDate" },
        { sourceField: "FiscalYear" },
        { sourceField: "DocStatus" },
        { sourceField: "DocRefNo" },
        { sourceField: "AccItemNo" },
        { sourceField: "AccSourceDocNo" },
        { sourceField: "AccSourceDocItem" },
        { sourceField: "StockTransNo" },
        { sourceField: "Qty" },
        { sourceField: "Price" },
        { sourceField: "UnitMea" },
        { sourceField: "Currency" },
        { sourceField: "ExchangeRate" },
        { sourceField: "Amount" },
        { sourceField: "SaleProductCode" },
        { sourceField: "SalesDescription" },
        { sourceField: "VatType" },
        { sourceField: "RateVat" },
        { sourceField: "RateWht" },
        { sourceField: "IssQty" },
        { sourceField: "Balance" },
      ],
    };
    const response = await axios.post(
      `${API_BASE}/View/GetViewResult/`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 && response.data) {
      console.log(`Fetched items for SR ${srNo}:`, response.data);
      // กรองเฉพาะรายการที่ Balance > 0
      return response.data.filter((item) => Number(item.Balance) > 0);
    } else {
      console.error(
        `Error fetching items for SR ${srNo}:`,
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error(`Error fetching items for SR ${srNo}:`, error);
    return [];
  }
};