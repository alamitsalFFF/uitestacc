import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../../api/url";
// const navigate = useNavigate();

const fetchJournalNo = async (entryIdtoString) => {
  console.log("EntryID:", entryIdtoString);
  try {
    const vJournal_All = {
      viewName: "vJournal_All",
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
      vJournal_All,
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


export const SIToJournal = async (AccDocNo,navigate) => {
  console.log("AccDocNo:", AccDocNo);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const SIToJournal = {
      name: "Insert_SIToJournal",
      parameters: [
        {
          param: "invno",
          value: AccDocNo, 
        },
        {
          param: "userid",
          // value: "admin",
          value:  localStorage.getItem("userName") || "",
        },
        // {
        //   param: "duedate",
        //   value: formattedDate, 
        // },
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
    console.log("SIToJournal:",SIToJournal)
    const responseSIToJournal = await axios.post(
        StoredProcedures_Base,
        SIToJournal,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (responseSIToJournal.status === 200) {
       console.log(
          "PI Header created successfully from PI:",
          responseSIToJournal.data.data[0].EntryId
        );
        const entryId = responseSIToJournal.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        if (journalId) {
          Swal.fire({
            icon: "success",
            title: `Created : ${journalId}`, // แสดง JournalID
            showConfirmButton: false,
            timer: 3000,
          });
          setTimeout(() => {
            navigate(`/uitestacc/JVList/`);
            }, 3000);
        } else {
          Swal.fire({
            icon: "warning",
            title: `Created PV (Journal ID not found): ${journalId}`, // แจ้งเตือนถ้าไม่พบ JournalID
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }  
    } catch (error) {
      console.error("Error creating SI Header:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง SI Header: " + error.message);
    }
  };

