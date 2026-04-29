import React from "react";
import Swal from "sweetalert2";
import axios from "../Auth/axiosConfig";
import { values } from "lodash";
import { API_VIEW_RESULT, StoredProcedures_Base, URL} from "../api/url";
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


export const PIToJournal = async (AccDocNo,navigate) => {
  console.log("AccDocNo:", AccDocNo);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD

    const PIToJournal = {
      name: "Insert_PIToJournal",
      parameters: [
        {
          param: "pino",
          value: AccDocNo, 
        },
        {
          param: "userid",
          // value: "admin",
          value:  localStorage.getItem("userName") || "",
        },
        {
          param: "duedate",
          value: formattedDate, 
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
    console.log("PIToJournal:",PIToJournal)

    const isConfirm = await Swal.fire({
      title: "ยืนยันการบันทึก",
      text: "คุณต้องการบันทึกข้อมูลลง Journal หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (!isConfirm.isConfirmed) {
      return;
    }

    const responsePIToJournal = await axios.post(
        StoredProcedures_Base,
        PIToJournal,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (responsePIToJournal.status === 200) {
       console.log(
          "PI Header created successfully from PI:",
          responsePIToJournal.data.data[0].EntryId
        );
        const entryId = responsePIToJournal.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        if (journalId) {
          Swal.fire({
            icon: "success",
            title: `Created Journal No.: ${journalId}`, // แสดง JournalID
            showConfirmButton: false,
            timer: 3000,
          });
          setTimeout(() => {
            navigate(`${URL}JournalEntries/`);
            }, 3000);
        } else {
          Swal.fire({
            icon: "warning",
            title: `Created Journal No.: ${journalId} (Journal ID not found)`, // แจ้งเตือนถ้าไม่พบ JournalID
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }  
    } catch (error) {
      console.error("Error creating PI Header:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PI Header: " + error.message);
    }
  };

