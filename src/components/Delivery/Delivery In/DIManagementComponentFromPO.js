import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import SelectItemPR from "../../purchase/Purchase Order/SelectItemFromPR";
import { //createPOHeaderAndFirstItem1,
  addPODetailToExistingPOFromPR
} from "../../purchase/Purchase Order/InsertPOFromPR";
import SelectItemPO from "./SelectItemFromPO";
import { addDIDetailToExistingDIFromPO } from "./InsertDIFromPO";

const DIManagementComponentFromPO = ({ currentDINo, onClose, onSave }) => {
  console.log("currentDINo in DIManagementComponentFromPO:", currentDINo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedPONo, selectedItemNos, refno, duedate) => {
    if (!selectedPONo || selectedItemNos.length === 0) {
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
          addDIDetailToExistingDIFromPO(selectedPONo, currentDINo, itemNo, refno, duedate)
        )
      );

      Swal.fire({
        icon: "success",
        title: `เพิ่มรายการจาก PO: ${selectedPONo} สำเร็จ`,
        html: `เพิ่มรายการเข้าสู่ Delivery Item: ${currentDINo} จำนวน ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          if (onSave) onSave(); // รีเฟรชข้อมูล DI ใน AccordionPODT
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
      <SelectItemPO
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
      // poNo={AccDocNo}
      />
    </div>
  );
};

export default DIManagementComponentFromPO;
