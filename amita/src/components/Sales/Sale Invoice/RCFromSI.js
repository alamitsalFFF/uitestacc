import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../../api/url";
// const navigate = useNavigate();

// -----------ทำหน้าเเยกUI--------------------
const fetchAccDocNo = async (rcNotoString) => {
  console.log("RCNo:", rcNotoString);
  try {
    const vRC_All = {
      viewName: "vRC_All",
      parameters: [{ field: "AccDocNo", value: `${rcNotoString}` }],
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
      vRC_All,
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
export const RCfromSI = async (AccDocNoC, bankacc, bankName, transtype, rcpno, duedate, webAddressRC, navigate) => {
  console.log("AccDocNo:", AccDocNoC);
  console.log("Bankacc:", bankacc);
  console.log("BankName:", bankName);
  console.log("transtype:", transtype);
  console.log("rcpno:", rcpno);
  console.log("duedate:", duedate);
  console.log("webAddressRC:", webAddressRC);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const RCFromSI = {
      name: "Insert_RCFromSI",
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
          param: "sino",
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
    console.log("RCFromSI:", RCFromSI)
    const responseRCFromSI = await axios.post(
      StoredProcedures_Base,
      RCFromSI,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseRCFromSI.status === 200) {
      console.log("responseRCFromSI:", responseRCFromSI);
      const rcNo = responseRCFromSI.data.data[0].RCNo;
      const rcNotoString = rcNo.toString();
      console.log("entryId0:", rcNotoString);
      console.log("entryId1:", typeof rcNotoString);
      const RCNO = await fetchAccDocNo(rcNotoString);

      if (RCNO) {
        Swal.fire({
          icon: "success",
          title: `Created RC: ${RCNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate(`${URL}${webAddressRC}`);
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: `Created RC (Not found): ${RCNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
      }

      // return normalized result for caller
      return {
        data: { RCNo: rcNo, RCNoString: rcNotoString, RCAccDocNo: RCNO },
        raw: responseRCFromSI.data,
      };
    } else {
      // non-200 — return raw for inspection
      return { raw: responseRCFromSI.data || responseRCFromSI };
    }
  } catch (error) {
    console.error("Error creating RC Header:", error);
    // rethrow so caller can handle, or return an error object if preferred
    // throw error;
    return { error: true, message: error.message, rawError: error };
  }
};

