import axios from "../../Auth/axiosConfig"; // ใช้ axiosConfig ที่คุณมี
import Swal from "sweetalert2";
import { API_BASE } from "../../api/url";

export const createDOHeaderAndFirstItem = async (AccDocNo, firstItemNo,firstQty,useRefNo) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const DOFromSO = {
      name: "Insert_DOFromSO", // ชื่อ Stored Procedure
      parameters: [
        { param: "sono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        // { param: "duedate", value: formattedDate },
        { param: "refno", value: useRefNo }, 
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: firstItemNo },
        { param: "qty", value: firstQty },
        // { param: "costtype", value: 0 },
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

    if (response.status === 200) {
      console.log("Created DONo:", response.data.data[0].AccDocNo);
      const dNo = response.data.data[0].AccDocNo;
      return dNo; // คืนค่า DONo ที่สร้างได้
    } else {
      throw new Error(`Failed to create DO Header and first item: ${response.statusText || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error creating DO Header and first item:", error);
    throw error;
  }
};

// --- ฟังก์ชันสำหรับเพิ่ม Detail Item เข้าไปใน DO เดิม ---
export const addDODetailToExistingDO = async (AccDocNo, dNo, soNo, itemNo,qtys) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
  try {
    const requestBody = {
      name: "Insert_DOFromSO", // ชื่อ Stored Procedure ตัวใหม่
      parameters: [

        { param: "sono", value: AccDocNo },
        { param: "docdate", value: formattedDate },
        // { param: "duedate", value: formattedDate },
        { param: "refno", value: AccDocNo },
        { param: "userid", value: localStorage.getItem("userName") },
        { param: "itemno", value: itemNo },
        { param: "qty", value: qtys },
        { param: "dno", value: dNo },
        // { param: "costtype", value: 0 },
    ],
    };
    console.log("Insert_DOFromSO:", requestBody);
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

// --- API ใหม่สำหรับดึงรายการ Itemno ของ SO (สำหรับ Modal) ---
export const getSOItems = async (soNo) => {
  console.log("Fetching SO items for soNo:", soNo);
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
      console.log("Fetched SO items:", response.data);
      return response.data; // คืนค่ารายการ Itemno
    } else {
      console.log("Fetched SO items:", response.data);
      console.error("Error fetching SO items:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching SO items:", error);
    return [];
  }
};