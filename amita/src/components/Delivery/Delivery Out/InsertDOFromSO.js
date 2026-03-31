import axios from "../../Auth/axiosConfig"; 
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createDOHeaderAndFirstItem1 = async (AccDocNo, firstItemNo) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const DOFromSO = {
      name: "Insert_DOFromSO", // ชื่อ Stored Procedure
      parameters: [
        { param: "pono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo }, 
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
      ],
    };
    console.log("Calling Insert_DOFromSO with first item:", DOFromSO);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      DOFromSO,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200 //&& response.data.data && response.data.data[0].PONo
    ) {
      return response.data.data[0].AccDocNo; // คืนค่า AccDocNo ที่สร้างได้
    } else {
      throw new Error(`Failed to create SO Header and first item: ${response.statusText || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error creating SO Header and first item:", error);
    throw error;
  }
};

// --- ฟังก์ชันสำหรับเพิ่ม Detail Item เข้าไปใน DI เดิม ---
export const addDODetailToExistingDOFromSO = async ( soNo_selected,currentDONo,itemNo_from_so,qtys) => {
    console.log("addDODetailToExistingDOFromSO called with:", soNo_selected, currentDONo, itemNo_from_so,qtys);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_DOFromSO", 
      parameters: [
        { param: "sono", value: soNo_selected },
        { param: "docdate", value: formattedDate },
        // { param: "duedate", value: formattedDate },
        { param: "refno", value: soNo_selected  },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo_from_so  },
        { param: "dno", value: currentDONo  },
        { param: "qty", value: qtys },
    ],
    };
    console.log("Calling SP Insert_DOFromSO:", requestBody);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to add DO detail for item ${itemNo_from_so}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding DO detail for item ${itemNo_from_so}:`, error);
    throw error;
  }
};

// --- API สำหรับดึงรายการ SO ที่ยังไม่ถูกใช้ (Balance > 0) ---
// ฟังก์ชันนี้จะดึง SO ทั้งหมดที่มี Balance > 0 เพื่อให้ผู้ใช้เลือก SO Number ก่อน
export const getAvailableSOs = async () => {
  try {
    const requestBody = {
      viewName: "vSO_Balance", // ใช้ view เดิม
      parameters: [], // ไม่ต้องมี AccDocNo ในครั้งแรก เพื่อดึง SO ทั้งหมด
      results: [
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
      // กรองเฉพาะ SO ที่มี Balance > 0 และ AccDocNo ไม่ซ้ำกัน
      const filteredSOs = response.data.filter(
        (item) => Number(item.Balance) > 0
      );

      // ดึงเฉพาะ AccDocNo ที่ไม่ซ้ำกันออกมา
      const uniqueSONumbers = [...new Set(filteredSOs.map((item) => item.AccDocNo))];

      console.log("Fetched available SO numbers:", uniqueSONumbers);
      return uniqueSONumbers; // คืนค่ารายการ AccDocNo ของ SO ที่มี Balance > 0
    } else {
      console.error(
        "Error fetching available SOs:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching available SOs:", error);
    return [];
  }
};
// --- API สำหรับดึงรายการ Item ของ SO ที่เลือก (Balance > 0) ---
// soNo: คือ SO Number ที่ผู้ใช้เลือกจาก Modal แรก
export const getItemsFromSelectedSO = async (soNo) => {
  try {
    const requestBody = {
      viewName: "vSO_Balance",
      parameters: [
        {
          field: "AccDocNo",
          value: soNo,
        },
      ],
     results: [
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
      console.log(`Fetched items for SO ${soNo}:`, response.data);
      // กรองเฉพาะรายการที่ Balance > 0
      return response.data.filter((item) => Number(item.Balance) > 0);
    } else {
      console.error(
        `Error fetching items for SO ${soNo}:`,
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error(`Error fetching items for SO ${soNo}:`, error);
    return [];
  }
};