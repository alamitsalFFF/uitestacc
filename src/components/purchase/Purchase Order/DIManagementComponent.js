import React from "react";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate ที่นี่
import Swal from "sweetalert2";
import ItemSelectionPO from "./ItemSelectionPO";
import { createDIHeaderAndFirstItem, addDIDetailToExistingDI } from "./PartialDIfromPO";

const DIManagementComponent = ({ AccDocNo, onClose }) => {
  console.log("DIManagementComponent AccDocNo:", AccDocNo);
  const navigate = useNavigate();

  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ยืนยันการเลือก Itemno
  const handleItemSelection = async (selectedItemNos, refno, duedate) => {
    if (selectedItemNos.length === 0) {
      Swal.fire(
        "ข้อผิดพลาด",
        "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการ",
        "error"
      );
      return;
    }

    let createdDINo = null;

    try {
      const firstItem = selectedItemNos[0];
      console.log("First item selected for DI:", firstItem);
      console.log("AccDocNo for DI:", AccDocNo);
      createdDINo = await createDIHeaderAndFirstItem(AccDocNo, firstItem, refno, duedate);

      if (selectedItemNos.length > 1) {
        for (let i = 1; i < selectedItemNos.length; i++) {
          const itemNo = selectedItemNos[i];
          console.log("Add DI detail: itemNo =", itemNo);
          await addDIDetailToExistingDI(
            AccDocNo,
            createdDINo,
            AccDocNo,
            itemNo,
            refno,
            duedate
          );
        }
      }

      Swal.fire({
        icon: "success",
        title: `สร้าง Delivery Order: ${createdDINo} สำเร็จ`,
        html: `สร้าง Delivery Order พร้อม ${selectedItemNos.length} รายการ`,
        showConfirmButton: false,
        timer: 3000,
        willClose: () => {
          onClose();
          navigate(`/uitestacc/DIList/`);
        },
      });
    } catch (error) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        `ไม่สามารถสร้าง Delivery Order บางส่วนได้: ${error.message || "โปรดลองอีกครั้ง"
        }`,
        "error"
      );
    }
  };

  return (
    <div>
      <ItemSelectionPO
        show={true}
        onClose={onClose}
        onSelectItems={handleItemSelection}
        poNo={AccDocNo}
      />
    </div>
  );
};

export default DIManagementComponent;
