import axios from "../../Auth/axiosConfig"; // ใช้ axiosConfig ที่คุณมี
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createPOHeaderAndFirstItem = async (AccDocNo, firstItemNo) => {
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
export const addPODetailToExistingPO = async (AccDocNo,poNo, prNo, itemNo) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_POFromPR", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [

        { param: "prno", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo },
        { param: "pono", value: poNo },
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
      throw new Error(`Failed to add SO detail for item ${itemNo}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding PO detail for item ${itemNo}:`, error);
    throw error;
  }
};

// --- API ใหม่สำหรับดึงรายการ Itemno ของ PR (สำหรับ Modal) ---
export const getPRItems = async (prNo) => {
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
      console.log("Fetched PR items:", response.data);
      return response.data; // คืนค่ารายการ Itemno
    } else {
      console.log("Fetched PR items:", response.data);
      console.error("Error fetching SP items:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching PR items:", error);
    return [];
  }
};