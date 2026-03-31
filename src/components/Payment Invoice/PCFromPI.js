import React from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../api/url";
// const navigate = useNavigate();

// -----------ทำหน้าเเยกUI--------------------
const fetchAccDocNo = async (pcNotoString) => {
  console.log("PCNo:", pcNotoString);
  try {
    const vPC_All = {
      viewName: "vPC_All",
      parameters: [{ field: "AccDocNo", value: `${pcNotoString}` }],
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
      ],
    };

    const response = await axios.post(
      API_VIEW_RESULT,
      vPC_All,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("AccDocNo:", response);
      console.log("AccDocNo:", response.data[0].AccDocNo);
      return response.data[0].AccDocNo;
    } else {
      console.error("Error fetching AccDocNo:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching AccDocNo:", error);
    return null;
  }
};

//จ่ายเช็ค
export const PCfromPI = async (AccDocNoC, bankacc, bankName, transtype, rcpno, duedate, webAddress, navigate) => {
  console.log("AccDocNo:", AccDocNoC);
  console.log("Bankacc:", bankacc);
  console.log("BankName:", bankName);
  console.log("transtype:", transtype);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PCFromPI = {
      name: "Insert_PCFromPI", //ยังไม่สมบรูณ์
      parameters: [
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "transno",
          value: ``,
        },

        {
          param: "transtype",
          value: transtype,
        },
        {
          param: "bankacc",
          value: bankacc,
        },
        {
          param: "bankname",
          value: bankName,
        },
        {
          param: "rcpno", //--เลขใบเสร็จ/ใบกำกับที่ได้มา 
          value: rcpno,
        },
        {
          param: "docdate",
          value: formattedDate,
        },

        {
          param: "duedate",
          value: duedate,
        },
        {
          param: "pino",
          value: AccDocNoC,
        },
        {
          param: "itemno",
          value: 0,
        },
        {
          param: "docno", //สำหรับ PC เก่าที่เคยใช้ไปเเล้ว
          value: '',
        },
      ],
    };
    console.log("PCFromPI:", PCFromPI)
    const responsePCFromPI = await axios.post(
      StoredProcedures_Base,
      PCFromPI,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePCFromPI.status === 200) {
      console.log("responsePCFromPI:", responsePCFromPI);
      const pcNo = responsePCFromPI.data.data[0].PCNo;
      const pcNotoString = pcNo.toString();
      console.log("entryId0:", pcNotoString);
      console.log("entryId1:", typeof pcNotoString);
      const PCNO = await fetchAccDocNo(pcNotoString);

      if (PCNO) {
        Swal.fire({
          icon: "success",
          title: `Created PC: ${PCNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate(`${URL}${webAddress}`);
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: `Created PC (Not found): ${PCNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
      }

      // return normalized result for caller
      return {
        data: { PCNo: pcNo, PCNoString: pcNotoString, PCAccDocNo: PCNO },
        raw: responsePCFromPI.data,
      };
    } else {
      // non-200 — return raw for inspection
      return { raw: responsePCFromPI.data || responsePCFromPI };
    }
  } catch (error) {
    console.error("Error creating PC Header:", error);
    // rethrow so caller can handle, or return an error object if preferred
    // throw error;
    return { error: true, message: error.message, rawError: error };
  }
};

