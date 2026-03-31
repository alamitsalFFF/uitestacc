// import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { StoredProcedures_Base, URL, API_VIEW_RESULT } from "../../api/url";
// import { values } from "lodash";

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

export const PVfromPO = async (AccDocNoC, DocRefNo, navigate) => {
  //   const navigate = useNavigate();
  console.log("AccDocNo:", AccDocNoC);
  console.log("AccDocNo:", typeof AccDocNoC);
  console.log("AccDocNo:", AccDocNoC);
  console.log("DocRefNo:", DocRefNo);
  console.log("DocRefNo:", typeof DocRefNo);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PIFromPOData = {
      name: "Insert_PIFromPO",
      parameters: [
        {
          param: "userid",
          value: localStorage.getItem("userName") || "",
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "pono",
          value: AccDocNoC,
        },
        {
          param: "invno",
          value: DocRefNo,
        },
        // {
        //   param: "itemno",
        //   value: 0,
        // },
        // {
        //   param: "qty",
        //   value: 0,
        // },
        // {
        //   param: "docno",
        //   value: '',
        // },
      ],
    };
    console.log("PIFromPO:", PIFromPOData);
    const responsePIFromPO = await axios.post(
      StoredProcedures_Base,
      PIFromPOData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responsePIFromPO.status === 200) {
      console.log("PI Header created successfully:");
      console.log("PIFromPO:", responsePIFromPO.data.data[0].PINo);
      const PIDocNofromPO = responsePIFromPO.data.data[0].PINo;

      // console.log("PI Header created successfully:", PIDocNofromPO);
      //   -----------
      const PVFromPIData = {
        name: "Insert_PVFromPI",
        parameters: [
          {
            param: "invno",
            value: PIDocNofromPO, // ใช้เลขที่ PI ที่ได้จาก API ก่อนหน้า
          },
          {
            param: "userid",
            value: localStorage.getItem("userName"),
          },
          {
            param: "taxno",
            value: DocRefNo,
          },
          {
            param: "docdate",
            value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
          },
          //   {
          //     param: "pvno",
          //     value: '',
          //   },
          //   {
          //     param: "acccode",
          //     value: '',
          //   },
        ],
      };
      console.log("DataPVFromPI:", PVFromPIData);

      const responsePVFromPI = await axios.post(
        StoredProcedures_Base,
        PVFromPIData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responsePVFromPI.status === 200) {
        console.log(
          "PV Header created successfully from PI:",
          responsePVFromPI.data.data[0].EntryId
        );
        const entryId = responsePVFromPI.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        if (journalId) {
          Swal.fire({
            icon: "success",
            title: `Created PV: ${journalId}`, // แสดง JournalID
            showConfirmButton: false,
            timer: 3000,
          });
          setTimeout(() => {
            navigate(`${URL}PVList/`);
          }, 3000);
        } else {
          Swal.fire({
            icon: "warning",
            title: `Created PV (Journal ID not found): ${journalId}`, // แจ้งเตือนถ้าไม่พบ JournalID
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการสร้าง PV จาก PI",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการสร้าง PI",
      });
    }
  } catch (error) {
    console.error("Error creating PI/PV Header:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: error.message,
    });
  }
};
