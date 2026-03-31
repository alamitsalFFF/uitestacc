import axios from "../../Auth/axiosConfig"; 
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createPOHeaderAndFirstItem1 = async (AccDocNo, firstItemNo) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const POFromPR = {
      name: "Insert_POFromPR", // ชื่อ Stored Procedure
      parameters: [
        { param: "prno", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo }, 
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
        { param: "closedoc", value: 0 },
      ],
    };
    console.log("Calling Insert_POFromSP with first item:", POFromPR);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      POFromPR,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200 && response.data.data && response.data.data[0].PONo) {
      return response.data.data[0].PONo; // คืนค่า PONo ที่สร้างได้
    } else {
      throw new Error(`Failed to create SO Header and first item: ${response.statusText || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error creating SO Header and first item:", error);
    throw error;
  }
};

// --- ฟังก์ชันสำหรับเพิ่ม Detail Item เข้าไปใน SO เดิม ---
export const addPODetailToExistingPOFromPR = async ( prNo_selected,currentPONo,itemNo_from_pr) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_POFromPR", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [
        { param: "prno", value: prNo_selected },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: prNo_selected  },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo_from_pr  },
        { param: "pono", value: currentPONo  },
        { param: "closedoc", value: 0 },
    ],
    };
    console.log("Calling SP Insert_POFromPR:", requestBody);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to add PO detail for item ${itemNo_from_pr}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding PO detail for item ${itemNo_from_pr}:`, error);
    throw error;
  }
};

// --- API สำหรับดึงรายการ PR ที่ยังไม่ถูกใช้ (Balance > 0) ---
// ฟังก์ชันนี้จะดึง PR ทั้งหมดที่มี Balance > 0 เพื่อให้ผู้ใช้เลือก PR Number ก่อน
export const getAvailablePRs = async () => {
  try {
    const requestBody = {
      viewName: "vPR_Balance", // ใช้ view เดิม
      parameters: [], // ไม่ต้องมี AccDocNo ในครั้งแรก เพื่อดึง PR ทั้งหมด
      results: [
        // เพิ่ม AccDocNo เพื่อให้สามารถเลือก PR Number ได้
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
      // กรองเฉพาะ PR ที่มี Balance > 0 และ AccDocNo ไม่ซ้ำกัน
      const filteredPRs = response.data.filter(
        (item) => Number(item.Balance) > 0
      );

      // ดึงเฉพาะ AccDocNo ที่ไม่ซ้ำกันออกมา
      const uniquePRNumbers = [...new Set(filteredPRs.map((item) => item.AccDocNo))];

      console.log("Fetched available PR numbers:", uniquePRNumbers);
      return uniquePRNumbers; // คืนค่ารายการ AccDocNo ของ PR ที่มี Balance > 0
    } else {
      console.error(
        "Error fetching available PRs:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching available PRs:", error);
    return [];
  }
};

// --- API สำหรับดึงรายการ Item ของ PR ที่เลือก (Balance > 0) ---
// prNo: คือ PR Number ที่ผู้ใช้เลือกจาก Modal แรก
export const getItemsFromSelectedPR = async (prNo) => {
  try {
    const requestBody = {
      viewName: "vPR_Balance",
      parameters: [
        {
          field: "AccDocNo",
          value: prNo,
        },
      ],
      results: [
        // เพิ่ม field ทั้งหมดที่จำเป็นตามที่คุณมีใน vPR_Balance
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
      console.log(`Fetched items for PR ${prNo}:`, response.data);
      // กรองเฉพาะรายการที่ Balance > 0
      return response.data.filter((item) => Number(item.Balance) > 0);
    } else {
      console.error(
        `Error fetching items for PR ${prNo}:`,
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error(`Error fetching items for PR ${prNo}:`, error);
    return [];
  }
};