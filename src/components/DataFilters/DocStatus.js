import React from 'react';

    function DocStatus({ status,docType }) {
      // console.log("DocStatus props:", { status, docType });
      let statusColor = '';
    
// 1. จัดการสถานะที่มีความแตกต่างตามประเภทเอกสาร (เช่น POSTED และ PAID)
  if (status === 'POSTED') {
    // POSTED: PC เป็นสีเขียว (DocStatus 2), อื่นๆ เป็นสีน้ำเงิน (DocStatus 1)
    if (docType === 'PC') {
      statusColor = 'green'; 
    } else {
      statusColor = 'blue';
    }
  } else if (status === 'PAID') { // เพิ่มเงื่อนไขสำหรับ PAID
    // PAID: 
    if (docType === 'PC') {
      statusColor = 'blue'; //  กำหนดให้ PAID ของ PC เป็นสีน้ำเงิน
    } else {
      statusColor = 'green'; //  PAID ของเอกสารอื่น ๆ ยังคงเป็นสีเขียว (ค่าเริ่มต้น)
    }
  } else {
    // ใช้ Switch/Case สำหรับสถานะอื่นๆ
    switch (status) {
      case 'OPEN': //0
        statusColor = 'yellow';
        break;
      case 'APPROVE': //1
        statusColor = 'blue';
        break;
      case 'BILLED': //1
        statusColor = 'blue';
        break;
      case 'PAID': //2
        statusColor = 'green';
        break;
      case 'COMPLETED': //2
        statusColor = 'green';
        break;
      case 'DELIVERED': //2
        statusColor = 'green';
        break;
      case 'CLOSED': //3
        statusColor = 'pink';
        break;
      case 'STOP': //98
        statusColor = 'orange';
        break;
      case 'CANCEL': //99
        statusColor = 'red';
        break;
      default:
        statusColor = 'black';
    }
  }

      // switch (status) {
      //   case 'OPEN': //0
      //     statusColor = 'yellow';
      //     break;
      //   case 'APPROVE': //1
      //     statusColor = 'blue';
      //     break;
      //   case 'POSTED': //1 DI, DO, PI ,SI /2 PC
      //     statusColor = 'blue';
      //     break;
      //   case 'BILLED': //1
      //     statusColor = 'blue';
      //     break;
      //   case 'PAID': //2
      //     statusColor = 'green';
      //     break;
      //   case 'COMPLETED':  //2
      //     statusColor = 'green';
      //     break;
      //   case 'DELIVERED': //2
      //     statusColor = 'green';
      //     break;         
      //   case 'CLOSED': //3
      //     statusColor = 'pink';
      //     break;
      //   case 'STOP': //98
      //     statusColor = 'orange';
      //     break;
      //   case 'CANCEL': //99
      //     statusColor = 'red';
      //     break;
        
      //   default:
      //     statusColor = 'black';
      // }


      // COMPLETEDสีเขียว (Green)ความสำเร็จ, เสร็จสมบูรณ์, ผ่าน, ดี (Success, Done, Go, Good)
      // CLOSEDสีเขียวเข้ม/น้ำเงิน (Dark Green/Blue)ความสิ้นสุด (ในเชิงบวก/จัดการแล้ว), ความมั่นคง (Finalized, Handled, Stability)
      // DELIVEREDสีเขียวอ่อน (Green)ความสำเร็จ, ถึงที่หมาย, เสร็จสิ้นกระบวนการ (Success, Reached Destination)
      // PAIDสีเขียว (Green)การทำธุรกรรมสำเร็จ, ได้รับการชำระเงินเรียบร้อย (Successful Transaction, Cleared)
      // APPROVEสีเขียว (Green)การอนุมัติ, ผ่าน, ไปต่อ (Approval, Passed, Proceed)
      // POSTEDสีฟ้า (Blue)การเผยแพร่, การดำเนินการตามปกติ, เป็นกลางเชิงบวก (Published, Normal Operation, Positive Neutral)
      // OPENสีฟ้า (Blue)เริ่มต้น, กำลังดำเนินการ, เป็นกลาง, มาตรฐาน (Starting, In Progress, Neutral, Standard)
      // BILLED [dodgerblue]สีฟ้าอ่อน/สีน้ำเงิน (Light Blue/Blue)อยู่ในกระบวนการออกใบแจ้งหนี้, เป็นขั้นตอนปกติที่ต้องดำเนินการต่อ (Invoicing Process, Normal Step)
      // CANCELสีแดง (Red)การหยุดชะงัก, ผิดพลาด, ยกเลิก, เตือน, ข้อผิดพลาด (Interruption, Error, Cancellation, Warning, Failure)
      // CANCELLEDสีแดง (Red)การหยุดชะงัก, ยกเลิกแล้ว (Interrupted, Cancelled)
      // PAIDสีเขียว (Green)การทำธุรกรรมสำเร็จ, ได้รับการชำระเงินเรียบร้อย (Successful Transaction, Cleared)
    
      return (
        // <div
        //   style={{
        //     width: '12px',
        //     height: '12px',
        //     borderRadius: '50%',
        //     backgroundColor: statusColor,
        //     display: 'inline-block', // ทำให้เป็น inline element เพื่อแสดงในบรรทัดเดียวกัน
        //     marginLeft: '5px', // เพิ่มระยะห่างจากข้อความ
        //   }}
        // ></div>
        <div
            // 💡 เพิ่มแอตทริบิวต์ title และกำหนดให้มีค่าเท่ากับ prop 'status' 
            // ซึ่งก็คือ StatusName นั่นเอง
            title={status} 
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: statusColor,
              display: 'inline-block',
              marginLeft: '5px',
              cursor: 'pointer', 
            }}
          ></div>
      );
    }

    export default DocStatus;