import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import SelectItemPR from "./SelectItemFromPR";
import { //createPOHeaderAndFirstItem1,
  addPODetailToExistingPOFromPR } from "./InsertPOFromPR";

const POManagementComponentFromPR = ({ currentPONo, onClose , onSave }) => {
  console.log("currentPONo in POManagementComponentFromPR:", currentPONo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedPRNo, selectedItemNos) => {
    if (!selectedPRNo || selectedItemNos.length === 0) {
      Swal.fire(
        "ข้อผิดพลาด",
        "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการ",
        "error"
      );
      return;
    }

    try {
      // เพิ่มข้อมูลแบบ batch และรอให้ทุกรายการสำเร็จ
      await Promise.all(
        selectedItemNos.map(itemNo =>
          addPODetailToExistingPOFromPR(selectedPRNo, currentPONo, itemNo)
        )
      );

      Swal.fire({
        icon: "success",
        title: `เพิ่มรายการจาก PR: ${selectedPRNo} สำเร็จ`,
        html: `เพิ่มรายการเข้าสู่ Purchase Order: ${currentPONo} จำนวน ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          if (onSave) onSave(); // รีเฟรชข้อมูล PO ใน AccordionPODT
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถเพิ่มรายการจาก PR ได้: ${error.message || "โปรดลองอีกครั้ง"}`,
        "error"
      );
    }
  };


  return (
    <div>
      <SelectItemPR
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        // prNo={AccDocNo}
      />
    </div>
  );
};

export default POManagementComponentFromPR;
