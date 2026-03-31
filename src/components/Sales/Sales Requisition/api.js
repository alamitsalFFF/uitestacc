import axios from "../../Auth/axiosConfig"; // ใช้ axiosConfig ที่คุณมี
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

// export const API_BASE = API_BASE; 

// --- ฟังก์ชันสำหรับสร้าง SO Header และ Item แรก ---
export const createSOHeaderAndFirstItem = async (AccDocNo, firstItemNo) => {
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
    console.log("Calling SP Insert_SOFromSR with first item:", SOFromSR);
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
export const addSODetailToExistingSO = async (AccDocNo,soNo, srNo, itemNo) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_SOFromSR", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [

        { param: "srno", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo },
        { param: "sono", value: soNo },
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
      throw new Error(`Failed to add SO detail for item ${itemNo}: ${response.statusText || 'Unknown error'}`);
    }
    return true; // สำเร็จ
  } catch (error) {
    console.error(`Error adding SO detail for item ${itemNo}:`, error);
    throw error;
  }
};

// --- API ใหม่สำหรับดึงรายการ Itemno ของ SR (สำหรับ Modal) ---
export const getSRItems = async (srNo) => {
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
      console.log("Fetched SR items:", response.data);
      return response.data; // คืนค่ารายการ Itemno
    } else {
      console.log("Fetched SR items:", response.data);
      console.error("Error fetching SR items:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching SR items:", error);
    return [];
  }
};