import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import SelectItemPO from "../Delivery In/SelectItemFromPO";
import { addDODetailToExistingDOFromSO } from "./InsertDOFromSO";
import SelectItemSO from "./SelectItemFromSO";

const DOManagementComponentFromSO = ({ currentDONo, onClose , onSave }) => {
  console.log("currentDONo in DOManagementComponentFromSO:", currentDONo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedSONo, selectedItemNos) => {
    if (!selectedSONo || selectedItemNos.length === 0) {
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
        selectedItemNos.map(item =>
          addDODetailToExistingDOFromSO(selectedSONo, currentDONo, item.AccItemNo, item.Qty)
        )
      );

      Swal.fire({
        icon: "success",
        title: `เพิ่มรายการจาก SO: ${selectedSONo} สำเร็จ`,
        html: `เพิ่มรายการเข้าสู่ Delivery Item: ${currentDONo} จำนวน ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          if (onSave) onSave(); // รีเฟรชข้อมูล DO ใน AccordionPODT
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถเพิ่มรายการจาก PO ได้: ${error.message || "โปรดลองอีกครั้ง"}`,
        "error"
      );
    }
  };


  return (
    <div>
      <SelectItemSO
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        // poNo={AccDocNo}
      />
    </div>
  );
};

export default DOManagementComponentFromSO;
