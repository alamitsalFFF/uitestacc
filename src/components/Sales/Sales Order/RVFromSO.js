// import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../../api/url";
// import { values } from "lodash";

const fetchJournalNo = async (entryIdtoString) => {
  console.log("EntryID:", entryIdtoString);
  try {
    const vRV_All = {
      viewName: "vRV_All",
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
      `${API_VIEW_RESULT}`,
      vRV_All,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("JournalNo:", response);
      console.log("JournalNo:", response.data[0].JournalNo);
      return response.data[0].JournalNo;
    } else {
      console.error("Error fetching JournalNo:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching JournalNo:", error);
    return null;
  }
};

export const RVfromSO = async (AccDocNO, DocRefNo,navigate) => {
//   const navigate = useNavigate();
  console.log("AccDocNo:", AccDocNO);
  console.log("AccDocNo:", typeof AccDocNO);
  console.log("AccDocNo:", AccDocNO);
  console.log("DocRefNo:", DocRefNo);
  console.log("DocRefNo:", typeof DocRefNo);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const SIFromSOData = {
      name: "Insert_SIFromSO",
     parameters: [
        {
          param: "userid",
          // value: "admin",
          value: localStorage.getItem("userName"),
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "duedate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        {
          param: "pono",
          value: AccDocNO,
        },
        // {
        //   param: "invno",
        //   value: `${AccDocNo}`,
        // },
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
    console.log("SIFromSO:", SIFromSOData);
    const responseSIFromSO = await axios.post(
      `${StoredProcedures_Base}`,
      SIFromSOData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseSIFromSO.status === 200) {
      console.log("SI Header created successfully:");
      console.log("SIFromSO:", responseSIFromSO.data);
      console.log("SIFromSO:", responseSIFromSO.data.data[0].IVNo);
      const SIDocNofromSO = responseSIFromSO.data.data[0].IVNo;
      console.log('SIDocNofromSO:',SIDocNofromSO)
      //   -----------
      const RVFromSIData = {
        name: "Insert_RVFromSI",
        parameters: [
          {
            param: "invno",
            value: SIDocNofromSO, // ใช้เลขที่ PI ที่ได้จาก API ก่อนหน้า
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
      console.log("DataRVFroSI:", RVFromSIData);

      const responseRVFromSI = await axios.post(
        `${StoredProcedures_Base}`,
        RVFromSIData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responseRVFromSI.status === 200) {
        console.log(
          "RV Header created successfully from PI:",
          responseRVFromSI.data.data[0].EntryId
        );
        const entryId = responseRVFromSI.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        if (journalId) {
          Swal.fire({
            icon: "success",
            title: `Created RV: ${journalId}`, // แสดง JournalID
            showConfirmButton: false,
            timer: 3000,
          });
          setTimeout(() => {
            navigate(`/uitestacc/RVList/`);
           }, 3000);
        } else {
          Swal.fire({
            icon: "warning",
            title: `Created RV (Journal ID not found): ${journalId}`, // แจ้งเตือนถ้าไม่พบ JournalID
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการสร้าง RV จาก SI",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการสร้าง SI",
      });
    }
  } catch (error) {
    console.error("Error creating SI/RV Header:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: error.message,
    });
  }
};
