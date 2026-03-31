import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import SelectItemPR from "../../purchase/Purchase Order/SelectItemFromPR";
import { addSODetailToExistingSOFromSR } from "./InsertSOFromSR";
import SelectItemSR from "./SelectItemFromSR";

const SOManagementComponentFromSR = ({ currentSONo, onClose , onSave }) => {
  console.log("currentSONo in SOManagementComponentFromSR:", currentSONo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedSRNo, selectedItemNos) => {
    if (!selectedSRNo || selectedItemNos.length === 0) {
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
          addSODetailToExistingSOFromSR(selectedSRNo, currentSONo, itemNo)
        )
      );

      Swal.fire({
        icon: "success",
        title: `เพิ่มรายการจาก SR: ${selectedSRNo} สำเร็จ`,
        html: `เพิ่มรายการเข้าสู่ Sales Order: ${currentSONo} จำนวน ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          if (onSave) onSave(); // รีเฟรชข้อมูล SO ใน AccordionSODT
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถเพิ่มรายการจาก SR ได้: ${error.message || "โปรดลองอีกครั้ง"}`,
        "error"
      );
    }
  };


  return (
    <div>
      <SelectItemSR
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        // prNo={AccDocNo}
      />
    </div>
  );
};

export default SOManagementComponentFromSR;
