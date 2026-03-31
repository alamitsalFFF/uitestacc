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

export const StockFromDO = async (accDocNo, calType, navigate) => {
  console.log("accDocNo:", accDocNo);
  console.log("accDocNo:", typeof accDocNo );
  console.log("calType:", calType);
  console.log("calType:", typeof calType);
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // จัดรูปแบบเป็น YYYY-MM-DD
    const loginUser = localStorage.getItem("userName") || "";
     const StockFromDOData = {
        name: "Insert_StockFromDO",
        parameters: [
          {
            param: "dono",
            value: accDocNo, // ใช้เลขที่ DO ที่ได้จาก API ก่อนหน้า
          },
          {
            param: "userid",
            value: loginUser,
          },
          {
            param: "caltype",
            value: calType, //0=FIFO,1=AVG
          },
          {
            param: "docdate",
            value: formattedDate, // ใช้ค่าวันที่ปัจจุบัน
          },
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

      if (responseStockFrom.status === 200) {
        console.log("Created JV successfully",responseStockFrom);
        console.log("Created JV successfully",responseStockFrom.data);
        console.log("Created successfully",responseStockFrom.data.data[0].EntryId);
        const entryId = responseStockFrom.data.data[0].EntryId;
        const entryIdtoString = entryId.toString();
        console.log("entryId0:", entryIdtoString);
        console.log("entryId1:", typeof entryIdtoString);
        const journalId = await fetchJournalNo(entryIdtoString);

        if (accDocNo) {
        const journalText = journalId ? ` และ JV: ${journalId}` : ""; 

        Swal.fire({
          icon: "success",
          title: `สร้างเอกสารสำเร็จ!`,
          html: `DO: ${accDocNo}${journalText}<br>คุณต้องการไปที่รายการใด?`,
          // กำหนดปุ่มที่ 1 (Confirm Button)
          showConfirmButton: true,
          confirmButtonText: `อยู่ที่ ${accDocNo}`, 
          // กำหนดปุ่มที่ 2 (Cancel Button)
          showCancelButton: true,
          cancelButtonText: `ไปที่ ${journalId}`, 
        }).then((result) => {
          if (result.isConfirmed) {
            // เมื่อผู้ใช้กดปุ่ม "ไปรายการ DO" (Confirm Button)
            navigate(`/uitestacc/AccordionDO?accDocNo=${accDocNo}`); //ถ้าทำหน้า DO ให้แก้ไปที่หน้าเอกสารเลย
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // เมื่อผู้ใช้กดปุ่ม "ไปรายการ JV" (Cancel Button)
            navigate(`/uitestacc/JVList/`);
          }
        });

      }
        else {
          Swal.fire({
            icon: "warning",
            title: `Created  (Journal ID not found): ${accDocNo}`, 
            showConfirmButton: false,
            timer: 3000,
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
