// import React from "react";
import Swal from "sweetalert2";
import axios from "../../Auth/axiosConfig";
import { API_VIEW_RESULT, StoredProcedures_Base } from "../../api/url";
// import { values } from "lodash";

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
        { sourceField: "DocNo" },
        { sourceField: "Seq" },
        { sourceField: "Text1" },
        { sourceField: "Date1" },
        { sourceField: "Num1" },
        { sourceField: "Text2" },
        { sourceField: "Date2" },
        { sourceField: "Num2" },
        { sourceField: "Text3" },
        { sourceField: "Date3" },
        { sourceField: "Num3" },
        { sourceField: "Text4" },
        { sourceField: "Date4" },
        { sourceField: "Num4" },
        { sourceField: "Text5" },
        { sourceField: "Date5" },
        { sourceField: "Num5" },
        { sourceField: "Text6" },
        { sourceField: "Date6" },
        { sourceField: "Num6" },
        { sourceField: "Text7" },
        { sourceField: "Date7" },
        { sourceField: "Num7" },
        { sourceField: "Text8" },
        { sourceField: "Date8" },
        { sourceField: "Num8" },
        { sourceField: "Text9" },
        { sourceField: "Date9" },
        { sourceField: "Num9" },
        { sourceField: "Text10" },
        { sourceField: "Date10" },
        { sourceField: "Num10" },
        { sourceField: "ItemNo" },
        { sourceField: "AccCode" },
        { sourceField: "AccName" },
        { sourceField: "AccMainCode" },
        { sourceField: "AccMainCodeName" },
        { sourceField: "AccRemark" },
        { sourceField: "AccDesc" },
        { sourceField: "Debit" },
        { sourceField: "Credit" },
        { sourceField: "AccTypeID" },
        { sourceField: "DText1" },
        { sourceField: "DDate1" },
        { sourceField: "DNum1" },
        { sourceField: "DText2" },
        { sourceField: "DDate2" },
        { sourceField: "DNum2" },
        { sourceField: "DText3" },
        { sourceField: "DDate3" },
        { sourceField: "DNum3" },
        { sourceField: "DText4" },
        { sourceField: "DDate4" },
        { sourceField: "DNum4" },
        { sourceField: "DText5" },
        { sourceField: "DDate5" },
        { sourceField: "DNum5" },
        { sourceField: "DText6" },
        { sourceField: "DDate6" },
        { sourceField: "DNum6" },
        { sourceField: "DText7" },
        { sourceField: "DDate7" },
        { sourceField: "DNum7" },
        { sourceField: "DText8" },
        { sourceField: "DDate8" },
        { sourceField: "DNum8" },
        { sourceField: "DText9" },
        { sourceField: "DDate9" },
        { sourceField: "DNum9" },
        { sourceField: "DText10" },
        { sourceField: "DDate10" },
        { sourceField: "DNum10" },

      ],
    };

    const response = await axios.post(
      `${API_VIEW_RESULT}`,
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

export const DOfromSOandStock = async (AccDocNO,refno, navigate) => {
  //   const navigate = useNavigate();
  console.log("AccDocNO:", AccDocNO);
  console.log("AccDocNO:", typeof AccDocNO);
  // console.log("userId:", userId);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD
    const loginUser = localStorage.getItem("userName") || "";
    const DOFromSOData = {
      name: "Insert_DOFromSO",
      parameters: [
        {
          param: "sono",
          value: AccDocNO,
        },
        {
          param: "docdate",
          value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        },
        // {
        //   param: "duedate",
        //   value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
        // },
        {
          param: "refno",
          value: refno, // ส่งเลขSOเป็นเลขเเท็กเอกสาร
        },
        {
          param: "userid",
          value: loginUser, 
        },
        // {
        //   param: "costtype",
        //   value: 0,
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
        //   param: "dno",
        //   value: "",
        // },
      ],
    };
    console.log("DOFromSO:", DOFromSOData);
    const responseDOFromSO = await axios.post(
      `${StoredProcedures_Base}`,
      DOFromSOData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (responseDOFromSO.status === 200) {
      console.log("DO Header created successfully:");
      console.log("DOFromSO1:", responseDOFromSO);
      console.log("DOFromSO2:", responseDOFromSO.data);
      // console.log("DOFromSO3:", responseDOFromSO.data.data[0]);
      console.log("DOFromSO4:", responseDOFromSO.data.data[0].AccDocNo);
      const DODocNofromSO = responseDOFromSO.data.data[0].AccDocNo;

      // console.log("DO Header created successfully:", );
      //   -----------
      const StockFromDOData = {
        name: "Insert_StockFromDO",
        parameters: [
          {
            param: "dono",
            value: DODocNofromSO, // ใช้เลขที่ DO ที่ได้จาก API ก่อนหน้า
          },
          {
            param: "userid",
            value: loginUser,
          },
          {
            param: "caltype",
            value: 0, //0=FIFO,1=AVG
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
      console.log("StockFromDOData:", StockFromDOData);

      const responseStockFrom = await axios.post(
        `${StoredProcedures_Base}`,
        StockFromDOData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responseStockFrom.status === 200) {//"message": "Stored procedure executed successfully."
        console.log("Created JV successfully",responseStockFrom);
        console.log("Created JV successfully",responseStockFrom.data);
        console.log("Created successfully",responseStockFrom.data.data[0].EntryId);
        const entryId = responseStockFrom.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        // if (DODocNofromSO) {
        //   Swal.fire({
        //     icon: "success",
        //     title: `Created:${DODocNofromSO} And Created:${journalId}`, // แสดง JournalID
        //     showConfirmButton: false,
        //     timer: 5000,
        //   });
        //   setTimeout(() => {
        //     navigate(`/uitestacc/DOList/`);
        //   }, 3000);
        // } 

        if (DODocNofromSO) {
        // แทนที่ Swal.fire เดิมด้วยโค้ดด้านล่าง
        const journalText = journalId ? ` และ JV: ${journalId}` : ""; // ใช้โค้ดจากคำตอบที่แล้วเพื่อจัดการค่า null

        Swal.fire({
          icon: "success",
          title: `สร้างเอกสารสำเร็จ!`,
          html: `DO: ${DODocNofromSO}${journalText}<br>คุณต้องการไปที่รายการใด?`,
          // กำหนดปุ่มที่ 1 (Confirm Button)
          showConfirmButton: true,
          confirmButtonText: `ไปที่ ${DODocNofromSO}`, 
          // กำหนดปุ่มที่ 2 (Cancel Button)
          showCancelButton: true,
          cancelButtonText: `ไปที่ ${journalId}`, 
        }).then((result) => {
          if (result.isConfirmed) {
            // เมื่อผู้ใช้กดปุ่ม "ไปรายการ DO" (Confirm Button)
            navigate(`/uitestacc/DOList/`); //ถ้าทำหน้า DO ให้แก้ไปที่หน้าเอกสารเลย
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // เมื่อผู้ใช้กดปุ่ม "ไปรายการ JV" (Cancel Button)
            navigate(`/uitestacc/JVList/`);
          }
        });

      }
        else {
          Swal.fire({
            icon: "warning",
            title: `Created DO (Journal ID not found): ${DODocNofromSO}`, 
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการสร้าง DO จาก SO",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการสร้าง SO",
      });
    }
  } catch (error) {
    console.error("Error creating DO Header:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: error.message,
    });
  }
};
