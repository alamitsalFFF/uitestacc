import axios from "../../Auth/axiosConfig";
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createDIHeaderAndFirstItem1 = async (AccDocNo, firstItemNo) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const DIFromPO = {
      name: "Insert_DIFromPO", // ชื่อ Stored Procedure
      parameters: [
        { param: "pono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
        { param: "whcode", value: "" },
      ],
    };
    console.log("Calling Insert_DIFromPO with first item:", DIFromPO);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      DIFromPO,
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
export const addDIDetailToExistingDIFromPO = async (poNo_selected, currentDINo, itemNo_from_po, refno, duedate) => {
  console.log("addDIDetailToExistingDIFromPO called with:", poNo_selected, currentDINo, itemNo_from_po);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_DIFromPO", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [
        { param: "pono", value: poNo_selected },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: duedate },
        { param: "refno", value: refno },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo_from_po },
        { param: "dno", value: currentDINo },
        { param: "whcode", value: "" },
      ],
    };
    console.log("Calling SP Insert_DIFromPO:", requestBody);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to add DI detail for item ${itemNo_from_po}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding DI detail for item ${itemNo_from_po}:`, error);
    throw error;
  }
};

// --- API สำหรับดึงรายการ PO ที่ยังไม่ถูกใช้ (Balance > 0) ---
// ฟังก์ชันนี้จะดึง PO ทั้งหมดที่มี Balance > 0 เพื่อให้ผู้ใช้เลือก PO Number ก่อน
export const getAvailablePOs = async () => {
  try {
    const requestBody = {
      viewName: "vPO_Balance", // ใช้ view เดิม
      parameters: [], // ไม่ต้องมี AccDocNo ในครั้งแรก เพื่อดึง PO ทั้งหมด
      results: [
        // เพิ่ม AccDocNo เพื่อให้สามารถเลือก PO Number ได้
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
      // กรองเฉพาะ PO ที่มี Balance > 0 และ AccDocNo ไม่ซ้ำกัน
      const filteredPOs = response.data.filter(
        (item) => Number(item.Balance) > 0
      );

      // ดึงเฉพาะ AccDocNo ที่ไม่ซ้ำกันออกมา
      const uniquePONumbers = [...new Set(filteredPOs.map((item) => item.AccDocNo))];

      console.log("Fetched available PO numbers:", uniquePONumbers);
      return uniquePONumbers; // คืนค่ารายการ AccDocNo ของ PO ที่มี Balance > 0
    } else {
      console.error(
        "Error fetching available POs:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching available POs:", error);
    return [];
  }
};

// --- API สำหรับดึงรายการ Item ของ PO ที่เลือก (Balance > 0) ---
// poNo: คือ PO Number ที่ผู้ใช้เลือกจาก Modal แรก
export const getItemsFromSelectedPO = async (poNo) => {
  try {
    const requestBody = {
      viewName: "vPO_Balance",
      parameters: [
        {
          field: "AccDocNo",
          value: poNo,
        },
      ],
      results: [
        // เพิ่ม field ทั้งหมดที่จำเป็นตามที่คุณมีใน vPO_Balance
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
        { sourceField: "RcvQty" },
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
      console.log(`Fetched items for PO ${poNo}:`, response.data);
      // กรองเฉพาะรายการที่ Balance > 0
      return response.data.filter((item) => Number(item.Balance) > 0);
    } else {
      console.error(
        `Error fetching items for PO ${poNo}:`,
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error(`Error fetching items for PO ${poNo}:`, error);
    return [];
  }
};