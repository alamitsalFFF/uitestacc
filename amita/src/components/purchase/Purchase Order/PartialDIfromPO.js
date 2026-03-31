import axios from "../../Auth/axiosConfig"; // ใช้ axiosConfig ที่คุณมี
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createDIHeaderAndFirstItem = async (AccDocNo, firstItemNo, refno, duedate) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const DIFromPO = {
      name: "Insert_DIFromPO", // ชื่อ Stored Procedure
      parameters: [
        { param: "pono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: duedate },
        { param: "refno", value: refno },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
        { param: "qty", value: 0 },
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

    if (response.status === 200) {
      console.log("Created DINo:", response.data.data[0].AccDocNo);
      const dNo = response.data.data[0].AccDocNo;
      return dNo; // คืนค่า DINo ที่สร้างได้
    } else {
      throw new Error(`Failed to create DI Header and first item: ${response.statusText || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error creating DI Header and first item:", error);
    throw error;
  }
};

// --- ฟังก์ชันสำหรับเพิ่ม Detail Item เข้าไปใน DI เดิม ---
export const addDIDetailToExistingDI = async (AccDocNo, dNo, poNo, itemNo, refno, duedate) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_DIFromPO", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [

        { param: "pono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: duedate },
        { param: "refno", value: refno },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo },
        { param: "qty", value: 0 },
        { param: "dno", value: dNo },
        { param: "whcode", value: "" },
      ],
    };
    console.log("Insert_DIFromPO:", requestBody);
    const response = await axios.post(
      `${API_BASE}/StoredProcedures/GetResult/`,
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to add DI detail for item ${itemNo}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding DI detail for item ${itemNo}:`, error);
    throw error;
  }
};

// --- API ใหม่สำหรับดึงรายการ Itemno ของ PO (สำหรับ Modal) ---
export const getPOItems = async (poNo) => {
  console.log("Fetching PO items for poNo:", poNo);
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
      console.log("Fetched PO items:", response.data);
      return response.data; // คืนค่ารายการ Itemno
    } else {
      console.log("Fetched PO items:", response.data);
      console.error("Error fetching PO items:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching PO items:", error);
    return [];
  }
};