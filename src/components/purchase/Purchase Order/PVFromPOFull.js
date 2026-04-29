import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL } from "../../api/url";
// const navigate = useNavigate();

// -----------ทำหน้าเเยกUI--------------------
const fetchJournalNo = async (entryIdtoString) => {
  console.log("EntryID:", entryIdtoString);
  try {
    const vPV_All = {
      viewName: "vPV_All",
      parameters: [{ field: "EntryId", value: `${entryIdtoString}` }],
      results: [
        { sourceField: "EntryId" },
        { sourceField: "JournalNo" },
        { sourceField: "EntryDate" },
        { sourceField: "EffectiveDate" },
        { sourceField: "EntryBy" },
        { sourceField: "Description" },
        { sourceField: "TotalDebit" },
        { sourceField: "TotalCredit" },
        { sourceField: "Seq" },
        { sourceField: "AccCode" },
        { sourceField: "AccName" },
        { sourceField: "AccDesc" },
        { sourceField: "Debit" },
        { sourceField: "Credit" },
      ],
    };

    const response = await axios.post(
      API_VIEW_RESULT,
      vPV_All,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("JournalNo:", response);
      if (response.data && response.data.length > 0) {
        console.log("JournalNo:", response.data[0].JournalNo);
        return response.data[0].JournalNo;
      }
      return null;
    } else {
      console.error("Error fetching JournalNo:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching JournalNo:", error);
    return null;
  }
};

//จ่ายเช็ค
export const PVfromPOFull = async (AccDocNoC, tranno, transtype, taxno, docdate, trandatail, acccode, accdebit, webAddress, navigate) => {
  console.log("AccDocNo:", AccDocNoC);
  console.log("tranno:", tranno);
  console.log("transtype:", transtype);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PVFromPO = {
      name: "Insert_PVFromPO",
      parameters: [
        {
          param: "pono", 
          value: AccDocNoC,
        },
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "taxno",
          value: taxno,//--เลขใบเสร็จ/ถ้าไม่มีใส่เลขใบหัก/หรือบัตรประชาชน
        },
        {
          param: "docdate",
          value: docdate, //วันที่จ่ายเงิน
        },
        {
          param: "transtype", //CA หรือ TR
          value: transtype,
        },
        {
          param: "tranno", //เลขสลิป หรือ เลขอ้างอิง
          value: tranno,
        },
        {
          param: "trandatail", //เลขใบเสร็จ/ถ้าไม่มีใส่เลขใบหัก/หรือบัตรประชาชน
          value: trandatail,
        },
        {
          param: "pvno",
          value: '',
        },
        {
          param: "acccode",
          value: acccode, //--รหัสบัญชีเงินสดที่จ่าย
        },
        {
          param: "doctype",
          value: 'PV', //ประเภทเอกสาร journal สำหรับ running
        },
        {
          param: "isexpense",
          value: 1,//ใส่ 1 เพราะเป็นค่าใช้จ่าย จะดึงจาก ExpenseAccCode ถ้าว่างๆไว้ ถ้า 0 จะดึงจาก AssetAccCode
        },
        {
          param: "accdebit",
          value: accdebit, //รหัสบัญชีค่าใช้จ่าย/รายได้
        },
      ],
    };
    console.log("PVFromPO:", PVFromPO)
    const responsePVFromPO = await axios.post(
      StoredProcedures_Base,
      PVFromPO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePVFromPO.status === 200) {
      console.log("responsePVFromPO:", responsePVFromPO);
      const pvNo = responsePVFromPO.data.data[0].PVNo;
      const pvNotoString = pvNo.toString();
      console.log("pvNo:", pvNotoString);
      console.log("pvNo:", typeof pvNotoString);
      const PVNO = await fetchJournalNo(pvNotoString);

      if (PVNO) {
        Swal.fire({
          icon: "success",
          title: `Created PV: ${PVNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          navigate(`${URL}${webAddress}`);
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: `Created PV (Not found): ${PVNO}`,
          showConfirmButton: false,
          timer: 3000,
        });
      }

      // return normalized result for caller
      return {
        data: { pvNo: pvNo, pvNotoString: pvNotoString, pvAccDocNo: PVNO },
        raw: responsePVFromPO.data,
      };
    } else {
      // non-200 — return raw for inspection
      return { raw: responsePVFromPO.data || responsePVFromPO };
    }
  } catch (error) {
    console.error("Error creating PV Header:", error);
    // rethrow so caller can handle, or return an error object if preferred
    // throw error;
    return { error: true, message: error.message, rawError: error };
  }
};

